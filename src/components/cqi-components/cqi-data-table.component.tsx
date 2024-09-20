import {
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableExpandRow,
  TableToolbar,
  TableExpandedRow,
  TableToolbarContent,
  TableToolbarSearch,
  Tile,
  TableExpandHeader,
} from "@carbon/react";
import {
  isDesktop,
  useLayoutType,
  usePagination,
} from "@openmrs/esm-framework";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../data-table/data-tables.scss";
import RowDetail from "./detail.component";

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
}

const CQIDataList: React.FC<ListProps> = ({ columns, data }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = useLayoutType() === "tablet";
  const responsiveSize = isTablet ? "lg" : "sm";
  const [allRows, setAllRows] = useState([]);
  // const [list] = useState(data);
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
      {({
        rows,
        headers,
        getHeaderProps,
        getTableProps,
        onInputChange,
        getRowProps,
        getExpandHeaderProps,
      }) => (
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
                </TableToolbarContent>
              </TableToolbar>
            </div>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader
                    enableToggle={true}
                    {...getExpandHeaderProps()}
                  />
                  {headers.map((header) => (
                    <TableHeader
                      className={`${styles.tableHeaderStyle} ${
                        header.isFlag ? styles.tableHeaderFlag : null
                      }`}
                      {...getHeaderProps({ header })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map((cell) =>
                        cell.value === "Y" ? (
                          <TableCell
                            key={cell.id}
                            className={`${styles.greenCell} ${styles.cellStyling}`}
                          ></TableCell>
                        ) : cell.value === "N" ? (
                          <TableCell
                            key={cell.id}
                            className={`${styles.redCell} ${styles.cellStyling}`}
                          ></TableCell>
                        ) : cell.value === "NA" ? (
                          <TableCell
                            key={cell.id}
                            className={`${styles.grayCell} ${styles.cellStyling}`}
                          ></TableCell>
                        ) : cell.value === "ON" ? (
                          <TableCell
                            key={cell.id}
                            className={`${styles.yellowCell} ${styles.cellStyling}`}
                          ></TableCell>
                        ) : (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        )
                      )}
                    </TableExpandRow>
                    {row.isExpanded ? (
                      <TableExpandedRow
                        className={styles.expandedActiveVisitRow}
                        colSpan={headers.length + 1}
                      >
                        <RowDetail
                          reportItem={
                            data.filter(
                              (item) =>
                                item.art_number ===
                                row.cells.find(
                                  (cell) => cell.id === row.id + ":art_number"
                                )?.value
                            )[0]
                          }
                        />
                      </TableExpandedRow>
                    ) : (
                      <TableExpandedRow
                        className={styles.hiddenRow}
                        colSpan={headers.length + 1}
                      />
                    )}
                  </React.Fragment>
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

export default CQIDataList;
