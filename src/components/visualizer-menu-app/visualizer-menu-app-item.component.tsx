import { ClickableTile } from "@carbon/react";
import React from "react";
import styles from "./visualizer-menu-app-item.scss";
import { Analytics } from "@carbon/react/icons";

const Item = () => {
  // items
  const openmrsSpaBase = window["getOpenmrsSpaBase"]();

  return (
    <ClickableTile
      className={styles.customTile}
      id="menu-item"
      href={`${openmrsSpaBase}home/data-visualizer`}
    >
      <div className="customTileTitle">{<Analytics size={24} />}</div>
      <div>Data Visualizer</div>
    </ClickableTile>
  );
};
export default Item;
