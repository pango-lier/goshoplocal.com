import { toast, ToastPosition, TypeOptions } from "react-toastify";

export const notify = (msg, type: TypeOptions = "success") => {
  toast(msg, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    type,
  });
};

export const notifyError = (msg: any) => {
  let message = "Unknown Error";
  if (msg instanceof Error) message = msg.message;
  else message = String(msg);
  notify(message, "error");
};

export const notifySuccess = (
  msg: string,
  autoClose = 3000,
  position: ToastPosition = "bottom-right"
) => {
  toast(msg, {
    position,
    autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    type: "success",
  });
};
