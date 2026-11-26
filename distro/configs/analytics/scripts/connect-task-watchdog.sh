#!/usr/bin/env bash
# Kafka Connect task watchdog for the UVL analytics VM.
#
# After a normal deploy recreates the source database containers, a Debezium connector keeps
# reporting RUNNING while its task is FAILED, so rows silently stop flowing. This script restarts
# FAILED tasks (and FAILED connectors) and nothing else: it never deletes, pauses or reconfigures
# anything and never touches replication slots.
#
# Cron (ubuntu), every 5 minutes:
#   */5 * * * * /home/ubuntu/ANALYTICS/uvl-analytics/connect-task-watchdog.sh >/dev/null 2>&1
# Log: /home/ubuntu/ANALYTICS/logs/connect-task-watchdog.log (trimmed to the last 2000 lines).
# Limit: at most 3 restarts per task (or connector) per hour, then "giving up, needs a human".
# Disable: comment the cron line.
#
# Test settings (never set in cron):
#   WATCHDOG_DRY_RUN=1          log what would be restarted, call no POST, do not sleep
#   WATCHDOG_STATUS_FILE=<json> read connector statuses from a file: {"<name>": <status object>, ...}
#   WATCHDOG_STATE_FILE, WATCHDOG_LOG, WATCHDOG_LOCK: override the default paths
set -euo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:${PATH}"

DIR="/home/ubuntu/ANALYTICS/uvl-analytics"
LOG="${WATCHDOG_LOG:-/home/ubuntu/ANALYTICS/logs/connect-task-watchdog.log}"
STATE="${WATCHDOG_STATE_FILE:-$DIR/.connect-task-watchdog.state}"
LOCK="${WATCHDOG_LOCK:-$DIR/.connect-task-watchdog.lock}"
CONNECT_CONTAINER="ozone-analytics-connect-1"
DRY="${WATCHDOG_DRY_RUN:-0}"
STATUS_FILE="${WATCHDOG_STATUS_FILE:-}"
MAX_PER_HOUR=3
WAIT_SECONDS=20
LOG_LINES=2000

mkdir -p "$(dirname "$LOG")"
touch "$STATE" "$LOG"
exec 9>"$LOCK"
flock -n 9 || exit 0

now() { date -u +%s; }
log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*" >>"$LOG"; }

# State file lines: "<key> <epoch>"; a key may repeat (one line per restart).
state_count() { awk -v k="$1" -v lim="$(( $(now) - 3600 ))" '$1==k && $2>lim {n++} END{print n+0}' "$STATE"; }
state_last() { awk -v k="$1" '$1==k {l=$2} END{print l+0}' "$STATE"; }
state_add() { printf '%s %s\n' "$1" "$(now)" >>"$STATE"; }
state_del() { grep -v "^$1 " "$STATE" >"$STATE.tmp" || true; mv "$STATE.tmp" "$STATE"; }
state_prune() { awk -v lim="$(( $(now) - 7200 ))" '$1=="apidown" || $2>lim' "$STATE" >"$STATE.tmp" || true; mv "$STATE.tmp" "$STATE"; }

connect_get() {
  if [ -n "$STATUS_FILE" ]; then
    case "$1" in
      /connectors) jq -c 'keys' "$STATUS_FILE" ;;
      /connectors/*/status) local n="${1#/connectors/}"; n="${n%/status}"; jq -c --arg n "$n" '.[$n]' "$STATUS_FILE" ;;
      *) return 1 ;;
    esac
  else
    docker exec "$CONNECT_CONTAINER" curl -sf --max-time 10 "localhost:8083$1"
  fi
}

# Only POST paths of the two restart kinds are ever built below.
connect_post() {
  [ "$DRY" = "1" ] && return 0
  docker exec "$CONNECT_CONTAINER" curl -sf --max-time 20 -X POST "localhost:8083$1" >/dev/null
}

# First line of a trace, cut at the first jdbc: or password (connection URLs and secrets), max 200 chars.
clean_trace() {
  printf '%s' "$1" | head -n1 | sed -E 's/(jdbc:|[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]).*$/[cut]/' | cut -c1-200
}

trim_log() {
  if [ "$(wc -l <"$LOG")" -gt "$LOG_LINES" ]; then
    tail -n "$LOG_LINES" "$LOG" >"$LOG.tmp" && mv "$LOG.tmp" "$LOG"
  fi
}
trap trim_log EXIT

# Returns 0 when a restart is allowed for key $1; otherwise logs (at most hourly) and returns 1.
allow_restart() {
  if [ "$(state_count "$1")" -ge "$MAX_PER_HOUR" ]; then
    if [ $(( $(now) - $(state_last "gaveup:$1") )) -ge 3600 ]; then
      log "$1 giving up, needs a human ($MAX_PER_HOUR restarts in the last hour, still FAILED)"
      state_add "gaveup:$1"
    fi
    return 1
  fi
  return 0
}

state_prune

if ! names="$(connect_get /connectors)"; then
  if [ "$(state_last apidown)" -eq 0 ]; then
    log "Connect REST API does not answer, skipping (logged once until it answers again)"
    state_add apidown
  fi
  exit 0
fi
state_del apidown

acted=0
for name in $(printf '%s' "$names" | jq -r '.[]'); do
  case "$name" in *[!A-Za-z0-9._-]*|"") log "skipping connector with unexpected name"; continue ;; esac
  if ! status="$(connect_get "/connectors/$name/status")"; then
    log "$name: status not readable, skipping"; continue
  fi

  cstate="$(printf '%s' "$status" | jq -r '.connector.state')"
  if [ "$cstate" = "FAILED" ]; then
    acted=1
    key="$name/connector"
    trace="$(clean_trace "$(printf '%s' "$status" | jq -r '.connector.trace // ""')")"
    log "$name: connector FAILED, trace: $trace"
    if allow_restart "$key"; then
      state_add "$key"
      if connect_post "/connectors/$name/restart?includeTasks=true&onlyFailed=true"; then
        [ "$DRY" = "1" ] && log "$name: DRY RUN, would POST restart?includeTasks=true&onlyFailed=true" || {
          sleep "$WAIT_SECONDS"
          new="$(connect_get "/connectors/$name/status" | jq -r '.connector.state' || echo unreadable)"
          log "$name: connector restarted, state now $new"
        }
      else
        log "$name: connector restart request failed"
      fi
    fi
  fi

  for id in $(printf '%s' "$status" | jq -r '.tasks[] | select(.state=="FAILED") | .id'); do
    acted=1
    key="$name/task$id"
    trace="$(clean_trace "$(printf '%s' "$status" | jq -r --argjson i "$id" '.tasks[] | select(.id==$i) | .trace // ""')")"
    log "$name: task $id FAILED, trace: $trace"
    if allow_restart "$key"; then
      state_add "$key"
      if connect_post "/connectors/$name/tasks/$id/restart"; then
        if [ "$DRY" = "1" ]; then
          log "$name: task $id DRY RUN, would POST tasks/$id/restart"
        else
          sleep "$WAIT_SECONDS"
          new="$(connect_get "/connectors/$name/status" | jq -r --argjson i "$id" '.tasks[] | select(.id==$i) | .state' || echo unreadable)"
          log "$name: task $id restarted, state now $new"
        fi
      else
        log "$name: task $id restart request failed"
      fi
    fi
  done
done

# Nothing wrong: at most one heartbeat line per hour.
if [ "$acted" -eq 0 ] && [ $(( $(now) - $(state_last heartbeat) )) -ge 3600 ]; then
  log "heartbeat: all connectors and tasks RUNNING"
  state_add heartbeat
fi
