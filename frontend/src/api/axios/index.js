import axios from "axios";
import { envConfig } from "configs";

axios.defaults.baseURL = `${envConfig[process.env.NODE_ENV].appApiUrl}/`

export default axios;