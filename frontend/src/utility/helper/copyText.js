import { notifySuccess } from "utility/notify";

const copyText = (text) => {
  navigator.clipboard.writeText(text);
  notifySuccess(`Copy ${text.substr(0,80)} ... successful !`);
};

export default copyText;
