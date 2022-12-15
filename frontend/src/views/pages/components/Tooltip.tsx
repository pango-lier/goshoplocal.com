import React from "react";
import { UncontrolledTooltip } from "reactstrap";

export interface ITooltip {
  message: string;
  id: string;
}


export const Tooltip: React.FC<ITooltip> = (props) => {
  const { message, id } = props;
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (document.getElementById(id)) {
      setReady(true);
    }
  }, [document.getElementById(id)]);

  return (
    <>
      <div id={id}>{message}</div>
      {ready && (
        <UncontrolledTooltip placement="left" target={id}>
          {message}
        </UncontrolledTooltip>
      )}
    </>
  );
};
