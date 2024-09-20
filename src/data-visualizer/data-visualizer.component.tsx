import React, { useCallback, useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Illustration from "./data-visualizer-illustration.component";
import {
  ArrowLeft,
  ArrowRight,
  Catalog,
  ChevronDown,
  ChevronUp,
  CrossTab,
  Intersect,
  ImageService,
  SendAlt,
  DocumentDownload,
  Save,
} from "@carbon/react/icons";
import {
  Accordion,
  AccordionItem,
  Button,
  ComboBox,
  ContentSwitcher,
  DataTableSkeleton,
  DatePicker,
  DatePickerInput,
  Form,
  FormGroup,
  FormLabel,
  Layer,
  Modal,
  RadioButton,
  RadioButtonGroup,
  Stack,
  Switch,
  TextInput,
  TextArea,
  Tile,
  ButtonSet,
  InlineLoading,
} from "@carbon/react";
import ReportingHomeHeader from "../components/header/header.component";
import {
  CQIReportHeaders,
  cqiReports,
  donorReports,
  facilityReports,
  integrationDataExports,
  nationalReports,
  reportIndicators,
  reportTypes,
  reportPeriod,
  dynamicReportOptions,
  personNames,
  Address,
  Demographics,
  AppointmentIndicators,
} from "../constants";
import DataList from "../components/data-table/data-table.component";
import CQIDataList from "../components/cqi-components/cqi-data-table.component";
import EmptyStateIllustration from "../components/empty-state/empty-state-illustration.component";
import Panel from "../components/panel/panel.component";
import pivotTableStyles from "!!raw-loader!react-pivottable/pivottable.css";
import styles from "./data-visualizer.scss";
import {
  createColumns,
  downloadReport,
  extractDate,
  formatDate,
  getCategoryIndicator,
  getCohortCategory,
  getDateRange,
  getReport,
  mapDataElements,
  saveReport,
  sendReportToDHIS2,
  useGetEncounterType,
} from "./data-visualizer.resource";
import dayjs from "dayjs";
import { showModal, showNotification, showToast } from "@openmrs/esm-framework";
import ModifierComponent from "../components/popover/modifier-panel";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
type ChartType = "list" | "pivot" | "aggregate";
type ReportingDuration = "fixed" | "relative";
export type CQIReportingCohort =
  | "Patients with encounters"
  | "Patients on appointment";
type DynamicReportType =
  | "program"
  | "cohort"
  | "patientSearch"
  | "reportDefinition";
const DataVisualizer: React.FC = () => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [pivotTableData, setPivotTableData] = useState(data);
  const [chartType, setChartType] = useState<ChartType>("list");
  const [reportType, setReportType] = useState<ReportType>("fixed");
  const [reportCategory, setReportCategory] = useState<{
    category: ReportCategory;
    renderType?: RenderType;
  }>({ category: "facility", renderType: "list" });
  const [reportingDuration, setReportingDuration] =
    useState<ReportingDuration>("fixed");
  const [reportingPeriod, setReportingPeriod] = useState<Item>(reportPeriod[0]);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator>(null);
  const [selectedReport, setSelectedReport] = useState<Item>(
    facilityReports.reports[0]
  );
  const [cqiReportingCohort, setCQIReportingCohort] =
    useState<CQIReportingCohort>("Patients with encounters");

  useEffect(() => {
    let initialSelectedReport;

    if (reportType === "fixed") {
      switch (reportCategory.category) {
        case "facility":
          initialSelectedReport = facilityReports.reports[0];
          break;
        case "donor":
          initialSelectedReport = donorReports.reports[0];
          break;
        case "national":
          initialSelectedReport = nationalReports.reports[0];
          break;
        case "cqi":
          initialSelectedReport = cqiReports.reports[0];
          break;
        case "integration":
          initialSelectedReport = integrationDataExports.reports[0];
          break;
        default:
          initialSelectedReport = facilityReports.reports[0];
      }
    } else {
      initialSelectedReport = facilityReports.reports[0];
      setChartType("list");
    }

    setSelectedReport(initialSelectedReport);
  }, [reportCategory, reportType]);

  const handleSelectedReport = ({ selectedItem }) => {
    setSelectedReport(selectedItem);
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showLineList, setShowLineList] = useState(false);
  const [availableParameters, setAvailableParameters] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState<
    Array<Indicator>
  >([]);
  const [showFilters, setShowFilters] = useState(true);
  const [reportName, setReportName] = useState("Patient List");
  const { encounterTypes } = useGetEncounterType();
  const [saveReportModal, setSaveReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [htmlContent, setHTML] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [dhisJson, setDhisJson] = useState({});
  const [selectedDynamicReportType, setSelectedDynamicReportType] = useState(
    dynamicReportOptions[3]
  );
  const [dynamicReportTypes, setDynamicReportTypes] = useState(
    facilityReports.reports
  );

  const handleChartTypeChange = ({ name }) => {
    setChartType(name);
  };

  const handleReportTypeChange = ({ name }) => {
    setReportType(name);
  };

  const handleReportingDurationChange = (period) => {
    setReportingDuration(period);
  };

  const handleCohortChange = (cohort) => {
    setCQIReportingCohort(cohort);
  };

  const showSaveReportModal = () => {
    setSaveReportModal(true);
  };

  const closeReportModal = () => {
    setSaveReportModal(false);
  };

  const confirmSendReport = () => {
    const dispose = showModal("confirm-modal", {
      close: () => dispose(),
      submit: () => {
        handleSendToDHIS2();
        dispose();
      },
      report: selectedReport.label,
    });
  };

  const handleSendToDHIS2 = useCallback(() => {
    setIsSendingReport(true);

    sendReportToDHIS2(selectedReport.id, dhisJson).then(
      (response) => {
        if (response.status === 200) {
          showToast({
            critical: true,
            title: "Sending Report To DHIS2",
            kind: "success",
            description: `Report ${selectedReport.label} sent Successfully`,
          });
        }
        {
          showNotification({
            title: "Error sending report to DHIS2",
            kind: "error",
            critical: true,
            description: `Failed with error code ${response.status}, Contact System Administrator`,
          });
        }
        setIsSendingReport(false);
      },
      (error) => {
        showNotification({
          title: "Error sending report to DHIS2",
          kind: "error",
          critical: true,
          description: error?.message,
        });
        setIsSendingReport(false);
      }
    );
  }, [selectedReport, dhisJson]);

  const handleDownloadReport = useCallback(() => {
    setIsDownloading(true);

    downloadReport({
      uuid: selectedReport.id,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      reportCategory: reportCategory.category,
      reportingCohort: cqiReportingCohort,
    }).then(
      async (response) => {
        try {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const filename = response?.headers
            ?.get("Content-Disposition")
            ?.match(/filename=(.+)/)[1];
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(response?.url);
        } catch (error) {
          showNotification({
            title: "Error downloading Report",
            kind: "error",
            critical: true,
            description: `Error downloading file: ${error?.message}`,
          });
        }
        setIsDownloading(false);
      },
      (error) => {
        showNotification({
          title: "Error downloading Report",
          kind: "error",
          critical: true,
          description: error?.message,
        });
        setIsDownloading(false);
      }
    );
  }, [startDate, endDate, selectedReport, reportCategory, cqiReportingCohort]);

  const handleSaveReport = useCallback(() => {
    saveReport({
      reportName: reportTitle,
      reportDescription: reportDescription,
      reportType: pivotTableData?.["rendererName"],
      columns: "",
      rows: "",
      report_request_object: JSON.stringify(pivotTableData),
    }).then(
      (response) => {
        if (response.status === 201) {
          showToast({
            critical: true,
            title: "Saving Report",
            kind: "success",
            description: `Report ${reportTitle} saved Successfully`,
          });
          setSaveReportModal(false);
        }
      },
      (error) => {
        showNotification({
          title: "Error saving report",
          kind: "error",
          critical: true,
          description: error?.message,
        });
      }
    );
  }, [reportDescription, pivotTableData, reportTitle]);

  const handleReportTitleChange = (event) => {
    setReportTitle(event.target.value);
  };

  const handleReportDescChange = (event) => {
    setReportDescription(event.target.value);
  };

  const moveAllFromLeftToRight = (selectedParameter) => {
    const updatedAvailableParameters = availableParameters.filter(
      (parameter) => parameter !== selectedParameter
    );
    setAvailableParameters(updatedAvailableParameters);

    setSelectedParameters([...selectedParameters, selectedParameter]);
  };

  const moveAllFromRightToLeft = (selectedParameter) => {
    const updatedSelectedParameters = selectedParameters.filter(
      (parameter) => parameter !== selectedParameter
    );
    setSelectedParameters(updatedSelectedParameters);

    let updatedAvailableParameters = [...availableParameters];

    selectedIndicators.attributes.filter((parameter) => {
      if (parameter === selectedParameter) {
        updatedAvailableParameters = [
          ...updatedAvailableParameters,
          selectedParameter,
        ];
      }
    });
    setAvailableParameters(updatedAvailableParameters);
  };

  const moveAllParametersLeft = () => {
    setAvailableParameters(selectedIndicators.attributes);
    setSelectedParameters([]);
  };

  const moveAllParametersRight = () => {
    setSelectedParameters([...availableParameters, ...selectedParameters]);
    setAvailableParameters([]);
  };

  const handleIndicatorChange = useCallback(
    ({ selectedItem }) => {
      const indicator = selectedItem;
      getCategoryIndicator(selectedItem?.id).then(
        (response) => {
          let results;
          switch (selectedItem.type) {
            case "PersonName":
              results = personNames;
              break;
            case "Demographics":
              results = Demographics;
              break;
            case "Address":
              results = Address;
              break;
            case "Appointment":
              results = AppointmentIndicators;
              break;
            case "Condition":
              results = mapDataElements(response, null, "concepts");
              break;
            case "":
              results = mapDataElements(response, null, "concepts");
              break;
            default:
              results = mapDataElements(response?.results, selectedItem.type);
              break;
          }

          setSelectedIndicators(indicator);
          const filteredArray = results?.filter(
            (resultParameter) =>
              !selectedParameters?.some(
                (parameter) => parameter.id === resultParameter.id
              )
          );
          indicator.attributes = filteredArray;
          setAvailableParameters(indicator.attributes ?? []);
        },
        (error) => {
          showNotification({
            title: "Error fetching Indicators",
            kind: "error",
            critical: true,
            description: error?.message,
          });
        }
      );
    },
    [selectedParameters]
  );

  const handleSelectedReportDefinition = ({ selectedItem }) => {
    setSelectedReport(selectedItem);
  };

  const handleSelectedDynamicReportType = ({ selectedItem }) => {
    let reports = [];

    if (selectedItem.id === "reportDefinition") {
      setDynamicReportTypes(facilityReports.reports);
      setSelectedReport(facilityReports.reports[0]);
    } else {
      getCohortCategory(selectedItem.id).then((response) => {
        const responseResults =
          selectedItem.id === "patientSearch" ? response : response?.results;
        responseResults?.map((responseItem) => {
          reports.push({
            id: responseItem?.uuid,
            label: responseItem?.name,
          });
        });
        setDynamicReportTypes(reports);
        setSelectedReport(reports[0] ?? null);
      });
    }

    setSelectedDynamicReportType(selectedItem);
  };

  const handleFiltersToggle = () => {
    showFilters === true ? setShowFilters(false) : setShowFilters(true);
  };

  const handleStartDateChange = (selectedDate) => {
    setStartDate(selectedDate[0]);
  };

  const handleEndDateChange = (selectedDate) => {
    setEndDate(selectedDate[0]);
  };

  const handleReportCategoryChange = (selectedItem) => {
    const typeOfReport = selectedItem.selectedItem.id;
    if (typeOfReport === "national") {
      setReportCategory({
        category: "national",
        renderType: "html",
      });
      setChartType("aggregate");
    } else if (typeOfReport === "cqi") {
      setReportCategory({ category: "cqi" });
      setChartType("list");
    } else if (typeOfReport === "donor") {
      setReportCategory({
        category: "donor",
        renderType: "html",
      });
      setChartType("aggregate");
    } else if (typeOfReport === "integration") {
      setReportCategory({ category: "integration" });
      setChartType("list");
    } else {
      setReportCategory({ category: "facility" });
      setChartType("list");
    }
  };

  const handleReportingPeriod = (selectedPeriod) => {
    setReportingPeriod(selectedPeriod?.selectedItem);
    const dateRange = getDateRange(selectedPeriod?.selectedItem?.id);
    setStartDate(dateRange.start);
    setEndDate(dateRange.end);
  };

  const changeModifier = (selectedParameter, type) => {
    setSelectedParameters((selectedParameters) =>
      selectedParameters.map((parameter) =>
        parameter.id === selectedParameter.id
          ? {
              ...parameter,
              modifier: addORSubtract(selectedParameter?.modifier, type),
            }
          : parameter
      )
    );
  };

  const addORSubtract = (value, type) => {
    if (type === "add") {
      return value + 1;
    } else if (type === "subtract" && value > 1) {
      return value - 1;
    } else {
      return value;
    }
  };

  const showModifierPanel = (selectedParameter: Indicator) => {
    setSelectedParameters((selectedParameters) =>
      selectedParameters.map((parameter) =>
        parameter.id === selectedParameter.id
          ? {
              ...parameter,
              showModifierPanel: !selectedParameter?.showModifierPanel,
            }
          : parameter
      )
    );
  };

  const handleOnChnageExtras = (selectedParameter, event) => {
    if (event?.target?.checked) {
      setSelectedParameters((selectedParameters) =>
        selectedParameters.map((parameter) =>
          parameter.id === selectedParameter.id
            ? {
                ...parameter,
                extras: [...parameter?.extras, event?.target?.value],
              }
            : parameter
        )
      );
    } else {
      setSelectedParameters((selectedParameters) =>
        selectedParameters.map((parameter) =>
          parameter.id === selectedParameter.id
            ? {
                ...parameter,
                extras: parameter?.extras.filter(
                  (modifier) => modifier !== event?.target?.value
                ),
              }
            : parameter
        )
      );
    }
  };

  const handleUpdateReport = useCallback(() => {
    setHTML("");
    setShowLineList(true);
    setLoading(true);
    setShowFilters(false);

    getReport({
      uuid: selectedReport.id,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      reportCategory: reportCategory,
      reportIndicators: selectedParameters,
      reportType: reportType,
      reportingCohort: cqiReportingCohort,
      type: selectedDynamicReportType?.label,
    }).then(
      (response) => {
        if (response.status === 200) {
          let headers = [];
          let dataForReport: any = [];
          const reportData = response?.data;
          if (reportType === "fixed") {
            if (reportCategory.category === "cqi") {
              dataForReport = response?.data?.A;
              headers = CQIReportHeaders;
            } else {
              if (reportCategory.renderType === "html") {
                setHTML(reportData?.html ?? "");
                setDhisJson(reportData?.json ?? {});
              } else {
                const responseReportName = Object.keys(reportData)[0];
                if (
                  reportData[responseReportName] &&
                  reportData[responseReportName][0]
                ) {
                  let columnNames = Object.keys(
                    reportData[responseReportName][0]
                  );
                  if (
                    selectedReport.id === "bf79f017-8591-4eaf-88c9-1cde33226517"
                  ) {
                    columnNames = columnNames
                      .reverse()
                      .filter(
                        (column) => column !== "EDD" && column !== "Names"
                      );
                    headers = createColumns(columnNames);
                    dataForReport = reportData[responseReportName]
                      .filter((row) => row.PhoneNumber)
                      .map((row) => {
                        const formattedDate = extractDate(row.LastVisitDate);
                        if (
                          row.PhoneNumber &&
                          row.PhoneNumber.startsWith("0")
                        ) {
                          return {
                            ...row,
                            PhoneNumber: "256" + row.PhoneNumber.substring(1),
                            LastVisitDate: formattedDate,
                          };
                        }
                        return row;
                      });
                  } else {
                    headers = createColumns(columnNames);
                    dataForReport = reportData[responseReportName];
                  }
                } else {
                  setShowLineList(false);
                }
              }
            }
          } else {
            if (reportData[0]) {
              const columnNames = Object.keys(reportData[0]);
              headers = createColumns(columnNames);
              dataForReport = reportData;
            } else {
              setShowLineList(false);
            }
          }

          setLoading(false);
          setShowFilters(false);
          setTableHeaders(headers);
          setData(dataForReport);
          setPivotTableData(dataForReport);
          setReportName(selectedReport?.label);
        }
      },
      (error) => {
        setLoading(false);
        setShowFilters(false);
        showNotification({
          title: "Error fetching report",
          kind: "error",
          critical: true,
          description: error?.message,
        });
      }
    );
  }, [
    cqiReportingCohort,
    endDate,
    reportCategory,
    reportType,
    selectedParameters,
    selectedReport,
    startDate,
    selectedDynamicReportType?.label,
  ]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `${pivotTableStyles}`;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <ReportingHomeHeader illustrationComponent={<Illustration />} />

      <div className={styles.container}>
        <Accordion className={styles.accordion}>
          <AccordionItem
            className={styles.heading}
            title="Report filters"
            open={showFilters}
            onHeadingClick={handleFiltersToggle}
          >
            <div className={styles.formContainer}>
              <div className={`${styles.form} ${styles.formFirst}`}>
                <Form>
                  <Stack gap={2}>
                    <FormGroup>
                      <FormLabel className={styles.label}>
                        Type of report
                      </FormLabel>
                      <ContentSwitcher
                        size="sm"
                        onChange={handleReportTypeChange}
                      >
                        <Switch name="fixed" text="Fixed" />
                        <Switch name="dynamic" text="Dynamic" />
                      </ContentSwitcher>
                    </FormGroup>

                    {reportType === "fixed" && (
                      <>
                        <FormGroup>
                          <FormLabel className={styles.label}>
                            Which kind of report do you want to show?
                          </FormLabel>
                          <ComboBox
                            ariaLabel="Select Report Type"
                            id="ReportTypeCombobox"
                            items={reportTypes}
                            hideLabel
                            onChange={handleReportCategoryChange}
                            selectedItem={
                              reportTypes.filter(
                                (item) => item.id === reportCategory.category
                              )[0]
                            }
                          />
                        </FormGroup>

                        {reportCategory.category === "facility" && (
                          <FormGroup>
                            <FormLabel className={styles.label}>
                              Facility Reports
                            </FormLabel>
                            <ComboBox
                              ariaLabel="Select facility report"
                              id="facilityReportsCombobox"
                              items={facilityReports.reports}
                              hideLabel
                              onChange={handleSelectedReport}
                              selectedItem={selectedReport}
                            />
                          </FormGroup>
                        )}

                        {reportCategory.category === "national" && (
                          <FormGroup>
                            <FormLabel className={styles.label}>
                              National Reports
                            </FormLabel>
                            <ComboBox
                              ariaLabel="Select national report"
                              id="nationalReportsCombobox"
                              items={nationalReports.reports}
                              hideLabel
                              onChange={handleSelectedReport}
                              selectedItem={selectedReport}
                            />
                          </FormGroup>
                        )}

                        {reportCategory.category === "donor" && (
                          <FormGroup>
                            <FormLabel className={styles.label}>
                              Donor Reports
                            </FormLabel>
                            <ComboBox
                              ariaLabel="Select donor report"
                              id="donorReportsCombobox"
                              items={donorReports.reports}
                              hideLabel
                              onChange={handleSelectedReport}
                              selectedItem={selectedReport}
                            />
                          </FormGroup>
                        )}

                        {reportCategory.category === "cqi" && (
                          <FormGroup>
                            <FormLabel className={styles.label}>
                              CQI Reports
                            </FormLabel>
                            <ComboBox
                              ariaLabel="Select CQI report"
                              id="CQIReportsCombobox"
                              items={cqiReports.reports}
                              hideLabel
                              onChange={handleSelectedReport}
                              selectedItem={selectedReport}
                            />
                          </FormGroup>
                        )}

                        {reportCategory.category === "integration" && (
                          <FormGroup>
                            <FormLabel className={styles.label}>
                              Integration Data Exports
                            </FormLabel>
                            <ComboBox
                              ariaLabel="Select Integration Data Exports"
                              id="integrationDataExportCombobox"
                              items={integrationDataExports.reports}
                              hideLabel
                              onChange={handleSelectedReport}
                              selectedItem={selectedReport}
                            />
                          </FormGroup>
                        )}

                        {reportCategory.category === "cqi" && (
                          <FormGroup>
                            <FormLabel className={styles.label}>
                              Select your cohort of interest
                            </FormLabel>
                            <RadioButtonGroup
                              legendText=""
                              name="patientCohort"
                              onChange={handleCohortChange}
                              defaultSelected="Patients with encounters"
                            >
                              <RadioButton
                                id="patient_with_encounters"
                                labelText="Patient with encounters"
                                value="Patients with encounters"
                              />
                              <RadioButton
                                id="patients_on_appointment"
                                labelText="Patients on appointment"
                                value="Patients on appointment"
                              />
                            </RadioButtonGroup>
                          </FormGroup>
                        )}
                      </>
                    )}

                    {reportType === "dynamic" && (
                      <Stack gap={2}>
                        <FormGroup>
                          <FormLabel className={styles.label}>
                            Which kind of dynamic report type do you want to
                            base on?
                          </FormLabel>
                          <ComboBox
                            ariaLabel="Select dynamic report type"
                            id="dynamicReportOptions"
                            items={dynamicReportOptions}
                            hideLabel
                            onChange={handleSelectedDynamicReportType}
                            selectedItem={selectedDynamicReportType}
                          />
                        </FormGroup>

                        <FormGroup>
                          <FormLabel className={styles.label}>
                            {selectedDynamicReportType?.label}
                          </FormLabel>

                          <ComboBox
                            ariaLabel="Select report type"
                            id="reportTypeCombobox"
                            items={dynamicReportTypes}
                            onChange={handleSelectedReportDefinition}
                            selectedItem={selectedReport}
                          />
                        </FormGroup>
                      </Stack>
                    )}
                  </Stack>
                </Form>
              </div>
              <div className={`${styles.form} ${styles.formRight}`}>
                <Form>
                  <Stack gap={3}>
                    <FormGroup>
                      <FormLabel className={styles.label}>
                        Do you want your report to cover a fixed reporting
                        period or a relative one?
                      </FormLabel>
                      <RadioButtonGroup
                        legendText=""
                        name="reportingDuration"
                        onChange={handleReportingDurationChange}
                        defaultSelected="fixed"
                      >
                        <RadioButton
                          id="fixedPeriod"
                          labelText="Fixed period"
                          value="fixed"
                        />
                        <RadioButton
                          id="relativePeriod"
                          labelText="Relative period"
                          value="relative"
                        />
                      </RadioButtonGroup>
                    </FormGroup>
                    {reportingDuration === "fixed" && (
                      <FormGroup className={styles.dateForm}>
                        <DatePicker
                          datePickerType="single"
                          onChange={handleStartDateChange}
                          dateFormat={"d/m/Y"}
                          value={startDate}
                        >
                          <DatePickerInput
                            id="date-picker-input-id-start"
                            placeholder="dd/mm/yyyy"
                            labelText="Start Date"
                          />
                        </DatePicker>
                        <br />
                        <DatePicker
                          datePickerType="single"
                          onChange={handleEndDateChange}
                          dateFormat={"d/m/Y"}
                          value={endDate}
                        >
                          <DatePickerInput
                            id="date-picker-input-id-end"
                            placeholder="dd/mm/yyyy"
                            labelText="End Date"
                          />
                        </DatePicker>
                      </FormGroup>
                    )}
                    {reportingDuration === "relative" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          Select your desired reporting period
                        </FormLabel>

                        <ComboBox
                          ariaLabel="Select reporting period"
                          id="reportingPeriodCombobox"
                          items={reportPeriod}
                          placeholder="Choose the reporting period"
                          onChange={handleReportingPeriod}
                          selectedItem={reportingPeriod}
                        />
                      </FormGroup>
                    )}
                  </Stack>
                </Form>
              </div>
            </div>
            <div>
              <Form>
                {reportType === "dynamic" && (
                  <Stack gap={2}>
                    <FormGroup>
                      <FormLabel className={styles.label}>Indicators</FormLabel>

                      <ComboBox
                        ariaLabel="Select indicators"
                        id="indicatorCombobox"
                        items={[...reportIndicators, ...encounterTypes]}
                        placeholder="Choose the indicators"
                        onChange={handleIndicatorChange}
                        selectedItem={selectedIndicators}
                      />
                    </FormGroup>

                    <div className={styles.panelContainer}>
                      <Panel heading="Available parameters">
                        <ul className={styles.list}>
                          {availableParameters.map((parameter) => (
                            <li
                              role="menuitem"
                              className={styles.leftListItem}
                              key={parameter.label}
                              onClick={() => moveAllFromLeftToRight(parameter)}
                            >
                              {parameter.label}
                            </li>
                          ))}
                        </ul>
                      </Panel>
                      <div className={styles.paramsControlContainer}>
                        <Button
                          iconDescription="Move all parameters to the right"
                          kind="tertiary"
                          hasIconOnly
                          renderIcon={ArrowRight}
                          onClick={moveAllParametersRight}
                          role="button"
                          size="md"
                          disabled={availableParameters.length < 1}
                        />
                        <Button
                          iconDescription="Move all parameters to the left"
                          kind="tertiary"
                          hasIconOnly
                          renderIcon={ArrowLeft}
                          onClick={moveAllParametersLeft}
                          role="button"
                          size="md"
                          disabled={selectedParameters.length < 1}
                        />
                      </div>
                      <Panel heading="Selected parameters">
                        <ul className={styles.list}>
                          {selectedParameters.map((parameter) => (
                            <>
                              <li
                                className={`${styles.rightListItem} ${
                                  parameter?.showModifierPanel
                                    ? styles.openRightListItem
                                    : ""
                                } `}
                                key={parameter.label}
                                role="menuitem"
                              >
                                <div className={styles.selectedListItem}>
                                  <div>
                                    <ArrowLeft
                                      className={styles.itemChevronUpDown}
                                      onClick={() =>
                                        moveAllFromRightToLeft(parameter)
                                      }
                                    />
                                  </div>
                                  {parameter.label}
                                  {![
                                    "PatientIdentifier",
                                    "PersonAttribute",
                                    "PersonName",
                                    "Demographics",
                                    "Address",
                                    "Condition",
                                    "Appointment",
                                  ].includes(parameter?.type) ? (
                                    <div className={styles.modifierContainer}>
                                      <div>
                                        {parameter?.showModifierPanel ? (
                                          <ChevronUp
                                            className={styles.itemChevronUpDown}
                                            onClick={() =>
                                              showModifierPanel(parameter)
                                            }
                                          />
                                        ) : (
                                          <ChevronDown
                                            className={styles.itemChevronUpDown}
                                            onClick={() =>
                                              showModifierPanel(parameter)
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </li>
                              <div
                                className={`${styles.fadeModifierContainer} ${
                                  parameter?.showModifierPanel
                                    ? styles.show
                                    : styles.hide
                                }`}
                              >
                                <ModifierComponent
                                  listItem={parameter}
                                  onChangeMostRecent={changeModifier}
                                  onChangeExtraValue={handleOnChnageExtras}
                                />
                              </div>
                            </>
                          ))}
                        </ul>
                      </Panel>
                    </div>
                  </Stack>
                )}
              </Form>
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <section className={styles.section}>
        <div className={styles.contentSwitchContainer}>
          <ContentSwitcher onChange={handleChartTypeChange}>
            <Switch name="list" disabled={chartType === "aggregate"}>
              <div className={styles.switch}>
                <Catalog />
                <span>Patient list</span>
              </div>
            </Switch>
            <Switch name="pivot" disabled={chartType === "aggregate"}>
              <div className={styles.switch}>
                <CrossTab />
                <span>Pivot table</span>
              </div>
            </Switch>
            <Switch name="aggregate" disabled={chartType !== "aggregate"}>
              <div className={styles.switch}>
                <ImageService />
                <span>Aggregate Report</span>
              </div>
            </Switch>
          </ContentSwitcher>
        </div>
        <div className={styles.actionButtonContainer}>
          <ButtonSet>
            <Button
              size="md"
              kind="primary"
              onClick={handleUpdateReport}
              className={styles.actionButton}
            >
              <Intersect />
              <span>View Report</span>
            </Button>
            {data.length > 0 || htmlContent != "" ? (
              <>
                {chartType === "pivot" ? (
                  <Button
                    size="md"
                    kind="secondary"
                    iconDescription="Save Report"
                    onClick={showSaveReportModal}
                    className={styles.dsReportBtn}
                    renderIcon={Save}
                    hasIconOnly
                  />
                ) : null}

                {reportType === "fixed" ? (
                  isDownloading ? (
                    <InlineLoading />
                  ) : (
                    <Button
                      size="md"
                      kind="tertiary"
                      iconDescription="Download Report"
                      tooltipAlignment="end"
                      onClick={handleDownloadReport}
                      className={styles.dsReportBtn}
                      renderIcon={DocumentDownload}
                      hasIconOnly
                    />
                  )
                ) : null}

                {chartType === "aggregate" ? (
                  isSendingReport ? (
                    <InlineLoading />
                  ) : (
                    <Button
                      size="md"
                      kind="secondary"
                      iconDescription="Send Report to DHIS2"
                      tooltipAlignment="end"
                      onClick={confirmSendReport}
                      className={styles.dsReportBtn}
                      renderIcon={SendAlt}
                      hasIconOnly
                    />
                  )
                ) : null}
              </>
            ) : null}
          </ButtonSet>
        </div>
      </section>

      {showLineList ? (
        <>
          {loading && <DataTableSkeleton role="progressbar" />}

          {chartType === "list" && !loading && (
            <div className={styles.reportContainer}>
              <h3 className={styles.listHeading}>
                {reportName} ({dayjs(startDate).format("DD/MM/YYYY")} -{" "}
                {dayjs(endDate).format("DD/MM/YYYY")})
              </h3>
              <div className={styles.reportDataTable}>
                {reportCategory.category === "cqi" ? (
                  <CQIDataList columns={tableHeaders} data={data} />
                ) : (
                  <DataList
                    columns={tableHeaders}
                    data={data}
                    report={{ type: reportType, name: selectedReport.label }}
                  />
                )}
              </div>
            </div>
          )}

          {chartType === "list" &&
            !loading &&
            selectedReport.id === "bf79f017-8591-4eaf-88c9-1cde33226517" && (
              <>
                <div className={styles.sendReportBtn}>
                  <Button
                    size="md"
                    kind="primary"
                    className={styles.actionButton}
                  >
                    <SendAlt />
                    <span>Send Report to Family Connect</span>
                  </Button>
                </div>
              </>
            )}

          {chartType === "pivot" && (
            <div className={styles.reportContainer}>
              <h3>Pivot Table</h3>
              <PivotTableUI
                data={pivotTableData}
                onChange={(s) => setPivotTableData(s)}
                renderers={{ ...TableRenderers, ...PlotlyRenderers }}
                {...pivotTableData}
              />
            </div>
          )}

          {chartType === "aggregate" && !loading && (
            <div className={styles.reportTableContainer}>
              <section className={styles.reportOptions}>
                <h3 className={styles.listHeading}>
                  {reportName} ({dayjs(startDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(endDate).format("DD/MM/YYYY")})
                </h3>
              </section>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          )}

          {saveReportModal && (
            <Modal
              open
              size="sm"
              preventCloseOnClickOutside={true}
              hasScrollingContent={true}
              modalHeading="ENTER REPORT DETAILS"
              secondaryButtonText="Cancel"
              primaryButtonText="Save Report"
              onRequestClose={closeReportModal}
              onRequestSubmit={handleSaveReport}
            >
              <div>
                <TextInput
                  id="title"
                  labelText={`Report Title`}
                  onChange={handleReportTitleChange}
                  maxCount={50}
                  placeholder="Enter report title"
                />
                <TextArea
                  id="description"
                  className={styles.reportDescription}
                  labelText={`Report Description`}
                  onChange={handleReportDescChange}
                  rows={2}
                  placeholder="Enter report description"
                />
              </div>
            </Modal>
          )}
        </>
      ) : (
        <Layer className={styles.layer}>
          <Tile className={styles.tile}>
            <EmptyStateIllustration />
            <p className={styles.content}>No data to display</p>
            <p className={styles.explainer}>
              Use the report filters above to build your reports
            </p>
          </Tile>
        </Layer>
      )}
    </>
  );
};

export default DataVisualizer;
