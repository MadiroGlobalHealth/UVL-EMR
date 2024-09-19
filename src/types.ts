export const spaBasePath = `${window.spaBase}/home`;

export enum SearchTypes {
  BASIC = "basic",
  ADVANCED = "advanced",
  SEARCH_RESULTS = "search_results",
  SCHEDULED_VISITS = "scheduled-visits",
  VISIT_FORM = "visit_form",
  QUEUE_SERVICE_FORM = "queue_service_form",
  QUEUE_ROOM_FORM = "queue_room_form",
}

export interface WaitTime {
  metric: string;
  averageWaitTime: string;
}

export interface RegionsResponse {
  message: string;
  status: boolean;
  data: Data;
}

export interface Data {
  resourceType: string;
  id: string;
  meta: Meta;
  type: string;
  total: number;
  link: Link[];
  entry: Entry[];
}

export interface Meta {
  lastUpdated: string;
}

export interface Link {
  relation: string;
  url: string;
}

export interface Entry {
  fullUrl: string;
  resource: Resource;
  search: Search;
}

export interface Resource {
  resourceType: string;
  id: string;
  meta: Meta2;
  extension: Extension[];
  status: string;
  name: string;
  type: Type[];
}

export interface Meta2 {
  versionId: string;
  lastUpdated: string;
  source: string;
}

export interface Extension {
  url: string;
  valueString: string;
}

export interface Type {
  coding: Coding[];
}

export interface Coding {
  code: string;
}

export interface Search {
  mode: string;
}
