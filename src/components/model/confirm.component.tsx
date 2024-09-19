import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@carbon/react";

interface ConfirmPromptProps {
  close: void;
  submit: void;
  report: string;
}

const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({
  close,
  submit,
  report,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="cds--modal-header">
        <h3 className="cds--modal-header__heading">Send Report to DHIS2</h3>
      </div>

      <div className="cds--modal-content">
        Are you sure you want to send {`${report}`} to DHIS2?
      </div>

      <div className="cds--modal-footer">
        <Button kind="secondary" onClick={close}>
          {t("close", "Cancel")}
        </Button>
        <Button kind="primary" onClick={submit}>
          {t("close", "Submit Report")}
        </Button>
      </div>
    </>
  );
};

export default ConfirmPrompt;
