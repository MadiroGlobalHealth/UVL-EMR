import React from "react";
import styles from "../../data-visualizer/data-visualizer.scss";
import { Add, Subtract } from "@carbon/react/icons";
import { Checkbox, CheckboxGroup } from "@carbon/react";
import { modifiers } from "../../constants";
type Props = {
  listItem: Indicator;
  onChangeMostRecent: (selectParameter: Indicator, type: string) => void;
  onChangeExtraValue: (selectParameter: Indicator, event) => void;
};
const ModifierComponent: React.FC<Props> = ({
  listItem,
  onChangeMostRecent,
  onChangeExtraValue,
}) => {
  return (
    <>
      <div className={styles.mostRecentContainer}>
        <div>
          {" "}
          Most Recent #:{" "}
          <span className={styles.modifierLeft}>{listItem?.modifier}</span>
        </div>
        <div>
          <Subtract
            className={`${styles.selectedListItemArrow} ${styles.modifier}`}
            onClick={() => onChangeMostRecent(listItem, "subtract")}
          />
          <Add
            className={styles.selectedListItemArrow}
            onClick={() => onChangeMostRecent(listItem, "add")}
          />
        </div>
      </div>
      <CheckboxGroup
        legendText={`Extra Values`}
        className={styles.extrasContainer}
        onChange={() => onChangeExtraValue(listItem, event)}
      >
        {modifiers.map((modifier) => {
          return (
            <Checkbox
              id={`checkbox-${modifier.id}-${listItem?.id}`}
              labelText={modifier.label}
              value={modifier.id}
            />
          );
        })}
      </CheckboxGroup>
    </>
  );
};

export default ModifierComponent;
