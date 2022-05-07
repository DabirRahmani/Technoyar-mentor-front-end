import axios from "axios";
import BackendAdress from "./adress";

const MainAxios = () => axios.create({ baseURL: BackendAdress });

export default MainAxios;
