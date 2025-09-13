import { API_BASE_URL } from "@/constants";
import axios, {AxiosResponse} from "axios";
import Cookies from "js-cookie";

export async function auth_get<T = unknown>(path: string): Promise <AxiosResponse<T>>{
    const token = Cookies.get("token")

    return await axios.get(API_BASE_URL+path, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export async function auth_post<TResponse = unknown, TBody = unknown>(
    path: string,
    body: TBody
  ): Promise<AxiosResponse<TResponse>> {
    const token = Cookies.get("token")
  
    return axios.post<TResponse>(`${API_BASE_URL}${path}`, body, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }
  