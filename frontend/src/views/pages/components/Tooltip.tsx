import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import copyText from "utility/helper/copyText";

export interface ITooltip {
  message: string;
  id: string;
  fullMessage?: string;
}

export const Tooltip: React.FC<ITooltip> = (props) => {
  const { message, id, fullMessage } = props;
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (document.getElementById(id)) {
      setReady(true);
    }
  }, [document.getElementById(id)]);

  return (
    <>
      <div className="cursor-pointer" onClick={() => copyText(fullMessage ? fullMessage : message)} id={id}>
        {message}
      </div>
      {ready && (
        <UncontrolledTooltip placement="left" target={id}>
          {fullMessage ? fullMessage : message}
        </UncontrolledTooltip>
      )}
    </>
  );
};
