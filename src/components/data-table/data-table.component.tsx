import {
  Button,
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
  Tile,
} from "@carbon/react";
import {
  isDesktop,
  useLayoutType,
  usePagination,
} from "@openmrs/esm-framework";
import { DocumentDownload } from "@carbon/react/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./data-tables.scss";
import { saveAs } from "file-saver";

type FilterProps = {
  rowIds: Array<string>;
  headers: any;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
};

interface ListProps {
  columns: any;
  data: any;
  report: {
    type: ReportType;
    name: string;
  };
}

type DocumentType = "csv" | "pdf" | "json";

const DataList: React.FC<ListProps> = ({ columns, data, report }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = useLayoutType() === "tablet";
  const responsiveSize = isTablet ? "lg" : "sm";
  const [allRows, setAllRows] = useState([]);
  const [list] = useState(data);
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const {
    goTo,
    results: paginatedList,
    currentPage,
  } = usePagination(data, currentPageSize);

  const handleFilter = ({
    rowIds,
    headers,
    cellsById,
    inputValue,
    getCellId,
  }: FilterProps): Array<string> => {
    return rowIds.filter((rowId) =>
      headers.some(({ key }) => {
        const cellId = getCellId(rowId, key);
        const filterableValue = cellsById[cellId].value;
        const filterTerm = inputValue.toLowerCase();

        if (typeof filterableValue === "boolean") {
          return false;
        }

        return ("" + filterableValue).toLowerCase().includes(filterTerm);
      })
    );
  };

  useEffect(() => {
    let rows: Array<Record<string, string>> = [];

    paginatedList.map((item: any, index) => {
      return rows.push({ ...item, id: index++ });
    });
    setAllRows(rows);
  }, [paginatedList, allRows]);

  const handleReportDownload = (documentType: string) => {
    const currentDate = new Date();
    const filename = `${report.name}_${currentDate
      .toISOString()
      .replace(/:/g, "-")}`;
    const csvString = convertToCSV(list, columns);

    if (documentType === "csv") {
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `${filename}.csv`);
    } else if (documentType === "json") {
      const jsonBlob = new Blob([csvString], { type: "application/json" });
      saveAs(jsonBlob, `${filename}.json`);
    }
  };

  const convertToCSV = (data, columns) => {
    const header = columns.map((col) => col.header).join(",");
    const rows = data.map((row) =>
      columns.map((col) => JSON.stringify(row[col.key])).join(",")
    );
    return [header, ...rows].join("\n");
  };

  return (
    <DataTable
      data-floating-menu-container
      rows={allRows}
      headers={columns}
      filterRows={handleFilter}
      overflowMenuOnHover={isDesktop(layout)}
      size={isTablet ? "lg" : "sm"}
      useZebraStyles
    >
      {({ rows, headers, getHeaderProps, getTableProps, onInputChange }) => (
        <div>
          <TableContainer className={styles.tableContainer}>
            <div className={styles.toolbarWrapper}>
              <TableToolbar size={responsiveSize}>
                <TableToolbarContent className={styles.toolbarContent}>
                  <TableToolbarSearch
                    className={styles.searchbox}
                    expanded
                    onChange={onInputChange}
                    placeholder={t("searchThisList", "Search this list")}
                    size={responsiveSize}
                  />
                  {report.type === "dynamic" ? (
                    <Button
                      size="sm"
                      kind="tertiary"
                      onClick={() => handleReportDownload("csv")}
                      className={styles.actionButton}
                    >
                      <DocumentDownload />
                      <span>Download Report</span>
                    </Button>
                  ) : null}
                </TableToolbarContent>
              </TableToolbar>
            </div>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length === 0 ? (
              <div className={styles.tileContainer}>
                <Tile className={styles.tile}>
                  <div className={styles.tileContent}>
                    <p className={styles.content}>
                      {t("No data", "No data to display")}
                    </p>
                  </div>
                </Tile>
              </div>
            ) : null}
            <Pagination
              forwardText="Next page"
              backwardText="Previous page"
              page={currentPage}
              pageSize={currentPageSize}
              pageSizes={pageSizes}
              totalItems={data?.length}
              className={styles.pagination}
              onChange={({ pageSize, page }) => {
                if (pageSize !== currentPageSize) {
                  setPageSize(pageSize);
                }
                if (page !== currentPage) {
                  goTo(page);
                }
              }}
            />
          </TableContainer>
        </div>
      )}
    </DataTable>
  );
};

export default DataList;
