import useSWR from "swr";
import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { CQIReportingCohort } from "./data-visualizer.component";
import dayjs from "dayjs";

type ReportRequest = {
  uuid: string;
  startDate: string;
  endDate: string;
  type: string;
  reportCategory?: {
    category: ReportCategory;
    renderType?: RenderType;
  };
  reportIndicators?: Array<Indicator>;
  reportType: ReportType;
  reportingCohort?: CQIReportingCohort;
};

type saveReportRequest = {
  reportName: string;
  reportDescription?: string;
  reportType?: string;
  columns?: string;
  rows: string;
  report_request_object: string;
};

type ReportDownloadParams = {
  uuid: string;
  startDate: string;
  endDate: string;
  reportCategory?: ReportCategory;
  reportingCohort?: CQIReportingCohort;
};

export async function getReport(params: ReportRequest) {
  const abortController = new AbortController();
  let apiUrl = `${restBaseUrl}/ugandaemrreports/reportingDefinition`;
  let fixedReportUrl = `${apiUrl}?startDate=${params.startDate}&endDate=${params.endDate}&uuid=${params.uuid}`;

  if (params.reportType === "fixed") {
    if (params.reportCategory.category === "cqi") {
      fixedReportUrl += `&cohortList=${params.reportingCohort}`;
    } else {
      if (params.reportCategory.renderType === "html") {
        fixedReportUrl += `&renderType=${params.reportCategory.renderType}`;
      }
    }

    return openmrsFetch(fixedReportUrl, {
      signal: abortController.signal,
    });
  } else {
    const parameters =
      params.reportIndicators.length > 0
        ? formatReportArray(params.reportIndicators)
        : [];

    return openmrsFetch(`${restBaseUrl}/ugandaemrreports/dataDefinition`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        cohort: {
          type: params.type,
          clazz: "",
          uuid: params.uuid,
          name: "",
          description: "",
          parameters: [
            {
              startDate: params.startDate,
            },
            {
              endDate: params.endDate,
            },
          ],
        },
        columns: parameters,
      },
    });
  }
}

export function downloadReport(params: ReportDownloadParams) {
  const abortController = new AbortController();
  let apiUrl = `${restBaseUrl}/ugandaemrreports/reportDownload?startDate=${params.startDate}&endDate=${params.endDate}&uuid=${params.uuid}`;
  if (params.reportCategory === "cqi") {
    apiUrl += `&cohortList=${params.reportingCohort}`;
  }

  return openmrsFetch(apiUrl, {
    signal: abortController.signal,
  });
}

export async function getCategoryIndicator(id: string) {
  let apiUrl: string;
  if (id === "IDN") {
    apiUrl = `${restBaseUrl}/patientidentifiertype`;
  } else if (id === "PAT") {
    apiUrl = `${restBaseUrl}/personattributetype`;
  } else if (id === "CON") {
    apiUrl = `${restBaseUrl}/ugandaemrreports/concepts/conditions`;
  } else {
    apiUrl = `${restBaseUrl}/ugandaemrreports/concepts/encountertype?uuid=${id}`;
  }

  const { data } = await openmrsFetch(apiUrl);
  return data;
}

export function useGetEncounterType() {
  const apiUrl = `${restBaseUrl}/encountertype`;
  const { data, error, isLoading } = useSWR<{ data: { results: any } }, Error>(
    apiUrl,
    openmrsFetch
  );
  return {
    encounterTypes: data ? mapDataElements(data?.data["results"]) : [],
    isError: error,
    isLoadingEncounterTypes: isLoading,
  };
}

export async function saveReport(params: saveReportRequest) {
  const apiUrl = `${restBaseUrl}/dashboardReport`;
  const abortController = new AbortController();

  return openmrsFetch(apiUrl, {
    method: "POST",
    signal: abortController.signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      name: params.reportName,
      description: params?.reportDescription,
      type: params?.reportType,
      columns: params?.columns,
      rows: params?.rows,
      report_request_object: params.report_request_object,
    },
  });
}

export async function sendReportToDHIS2(report, dhis2Json) {
  const apiUrl = `${restBaseUrl}/sendreport?uuid=${report}`;
  const abortController = new AbortController();

  return openmrsFetch(apiUrl, {
    method: "POST",
    signal: abortController.signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      ...dhis2Json,
    },
  });
}

export async function getCohortCategory(type: string) {
  let apiUrl: string;
  if (type === "patientSearch") {
    apiUrl = `${restBaseUrl}/ugandaemrreports/patientsearch`;
  } else {
    apiUrl = `${restBaseUrl}/${type}?v=custom:(uuid,name)`;
  }
  const { data } = await openmrsFetch(apiUrl);
  return data;
}

export function createColumns(columns: Array<string>) {
  let dataColumn: Array<Record<string, string>> = [];
  columns.map((column: string, index) => {
    dataColumn.push({
      id: `${index++}`,
      key: column,
      header: column,
      accessor: column,
    });
  });
  return dataColumn;
}

export function mapDataElements(
  dataArray: Array<Record<string, string>>,
  type?: string,
  category?: string
) {
  let arrayToReturn: Array<Indicator> = [];
  if (dataArray) {
    if (category === "concepts") {
      dataArray.map((encounterType: Record<string, string>) => {
        arrayToReturn.push({
          id: encounterType.uuid,
          label: encounterType.conceptName,
          type: encounterType.type,
          modifier: 1,
          showModifierPanel: false,
          extras: [],
          attributes: [],
        });
      });
    } else {
      dataArray.map((encounterType: Record<string, string>) => {
        arrayToReturn.push({
          id: encounterType.uuid,
          label: encounterType.display,
          type: type ?? "",
          modifier: 1,
          showModifierPanel: false,
          extras: [],
          attributes: [],
        });
      });
    }
  }

  return arrayToReturn;
}

export function formatReportArray(selectedItems: Array<Indicator>) {
  let arrayToReturn: Array<ReportParamItem> = [];
  if (selectedItems) {
    selectedItems.map((item: Indicator) => {
      arrayToReturn.push({
        label: item.label,
        type: item.type,
        expression: item.id,
        modifier: item?.modifier,
        extras: item?.extras,
      });
    });
  }

  return arrayToReturn;
}

export function getDateRange(selectedPeriod: ReportingPeriod) {
  const currentDate = new Date();

  switch (selectedPeriod) {
    case "today":
      return {
        start: currentDate,
        end: currentDate,
      };
    case "week":
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

      return {
        start: startOfWeek,
        end: endOfWeek,
      };
    case "month":
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      return {
        start: startOfMonth,
        end: endOfMonth,
      };
    case "quarter":
      const quarter = Math.floor(currentDate.getMonth() / 3);
      const startOfQuarter = new Date(
        currentDate.getFullYear(),
        Math.floor(currentDate.getMonth() / 3) * 3,
        1
      );
      const endOfQuarter = new Date(
        currentDate.getFullYear(),
        (quarter + 1) * 3,
        0
      );
      return {
        start: startOfQuarter,
        end: endOfQuarter,
      };
    case "lastQuarter":
      const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
      let previousQuarter;
      let previousQuarterYear;

      if (currentQuarter === 1) {
        previousQuarter = 4;
        previousQuarterYear = currentDate.getFullYear() - 1;
      } else {
        previousQuarter = currentQuarter - 1;
        previousQuarterYear = currentDate.getFullYear();
      }

      const startOfPreviousQuarter = new Date(
        previousQuarterYear,
        (previousQuarter - 1) * 3,
        1
      );

      const endOfPreviousQuarter = new Date(
        previousQuarterYear,
        previousQuarter * 3,
        0
      );

      return {
        start: startOfPreviousQuarter,
        end: endOfPreviousQuarter,
      };
    default:
      return {
        start: null,
        end: null,
      };
  }
}

export function extractDate(timestamp: string): string {
  const dateObject = new Date(timestamp);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}
