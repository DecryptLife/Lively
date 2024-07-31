import axios from "axios";
import { BASE_URL } from "../config";
export const getUser = async () => {
    return await axios
        .get(`${BASE_URL}/userDetails`, {
          headers: { "Content-Type": "application/json" },
        })
        .then(res => res.data)
        .catch((err) => console.log(err));
}



