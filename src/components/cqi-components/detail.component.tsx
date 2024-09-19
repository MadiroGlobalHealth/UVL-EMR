import React, { useState } from "react";
import styles from "./detail.scss";
import { ContentSwitcher, Switch } from "@carbon/react";
import {
  ClientStatusElements,
  DemographicsElements,
  OtherElements,
  PartnerTestingElements,
  RegimenDetailsElements,
  SiblingsTestingElements,
  VlCdElements,
} from "./cqi-elements";
interface RowDetailProps {
  reportItem: any;
}

type TabType =
  | "client_demographics"
  | "siblings_testing"
  | "partner_testing"
  | "client_status"
  | "regimen_details"
  | "vl_cd4"
  | "other_details";

const RowDetail: React.FC<RowDetailProps> = ({ reportItem }) => {
  const [tabType, setTabType] = useState<TabType>("client_demographics");

  const handleTabTypeChange = ({ name }) => {
    setTabType(name);
  };

  const createReportDetail = (item) => {
    return (
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>{item.label}:</span>
        <span className={styles.detailValue}>
          {reportItem?.[`${item.key}`]}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className={styles.detailContentSwitchContainer}>
        <ContentSwitcher onChange={handleTabTypeChange}>
          <Switch name="client_demographics">
            <div className={styles.switch}>
              <span>Client Demographics</span>
            </div>
          </Switch>
          <Switch name="siblings_testing">
            <div className={styles.switch}>
              <span>Index Testing of Siblings</span>
            </div>
          </Switch>
          <Switch name="partner_testing">
            <div className={styles.switch}>
              <span>Index Testing of Sexual Partners</span>
            </div>
          </Switch>
          <Switch name="client_status">
            <div className={styles.switch}>
              <span>Client Status at Facility</span>
            </div>
          </Switch>
          <Switch name="regimen_details">
            <div className={styles.switch}>
              <span>Current Regimen details</span>
            </div>
          </Switch>
          <Switch name="vl_cd4">
            <div className={styles.switch}>
              <span>Viral load & CD4</span>
            </div>
          </Switch>
          <Switch name="other_details">
            <div className={styles.switch}>
              <span>Other details</span>
            </div>
          </Switch>
        </ContentSwitcher>
      </div>

      <div className={styles.detailContainer}>
        {tabType === "client_demographics" &&
          DemographicsElements.map((item) => createReportDetail(item))}
        {tabType === "siblings_testing" &&
          SiblingsTestingElements.map((item) => createReportDetail(item))}
        {tabType === "partner_testing" &&
          PartnerTestingElements.map((item) => createReportDetail(item))}
        {tabType === "client_status" &&
          ClientStatusElements.map((item) => createReportDetail(item))}
        {tabType === "regimen_details" &&
          RegimenDetailsElements.map((item) => createReportDetail(item))}
        {tabType === "vl_cd4" &&
          VlCdElements.map((item) => createReportDetail(item))}
        {tabType === "other_details" &&
          OtherElements.map((item) => createReportDetail(item))}
      </div>
    </>
  );
};

export default RowDetail;
