import React from "react";
import { UncontrolledTooltip } from "reactstrap";

function Tooltip(prop) {
  const { message, id } = prop;
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
}
export default Tooltip;
