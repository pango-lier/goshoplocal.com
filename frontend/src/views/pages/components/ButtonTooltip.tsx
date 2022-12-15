import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";

export interface IButtonTooltip {
  message: string;
  id: string;
  onHandle: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.HTMLProps<HTMLButtonElement>;
  color: string;
}

export const ButtonTooltip: React.FC<IButtonTooltip> = (props) => {
  const { message, id, onHandle, icon, color } = props;
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (document.getElementById(id)) {
      setReady(true);
    }
  }, [document.getElementById(id)]);

  return (
    <>
      <Button
        id={id}
        size="sm"
        color={color}
        className="btn-icon ml-1"
        onClick={(e) => onHandle(e)}
      >
        {icon}
      </Button>
      {ready && (
        <UncontrolledTooltip placement="left" target={id}>
          {message}
        </UncontrolledTooltip>
      )}
    </>
  );
};
