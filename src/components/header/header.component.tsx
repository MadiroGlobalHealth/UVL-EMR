import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Location } from "@carbon/react/icons";
import { formatDate, useSession } from "@openmrs/esm-framework";
import styles from "./header.scss";

const Header: React.FC<{
  title?: string;
  illustrationComponent: JSX.Element;
}> = ({ title, illustrationComponent }) => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;

  return (
    <>
      <div className={styles.header}>
        <div className={styles["left-justified-items"]}>
          {illustrationComponent}
          <div className={styles["page-labels"]}>
            <p>{t("home", "Home")}</p>
            <p className={styles["page-name"]}>
              {title ?? t("dataVisualizer", "Data visualizer")}
            </p>
          </div>
        </div>
        <div className={styles["right-justified-items"]}>
          <div className={styles["date-and-location"]}>
            <Location size={16} />
            <span className={styles.value}>{userLocation}</span>
            <span className={styles.middot}>&middot;</span>
            <Calendar size={16} />
            <span className={styles.value}>
              {formatDate(new Date(), { mode: "standard" })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
