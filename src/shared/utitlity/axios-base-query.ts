import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

export const refreshToken = async () => {
  const session = await getSession();
  const refreshToken = session?.refreshToken;
  const config: AxiosRequestConfig = {
    url: `/auth/get-session`,
    method: "get",
    headers: {
      "x-refresh-token": refreshToken,
    },
  };
  try {
    const { data } = await axios(config);
    console.log("Data", data);
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 403 || err.response?.status === 401) {
      localStorage.clear();
      window.location.href = `${window.location.origin}`;
    }
  }
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      headers?: AxiosRequestConfig["headers"];
      params?: AxiosRequestConfig["params"];
      responseType?: AxiosRequestConfig["responseType"];
      permission?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, responseType }) => {
    try {
      const session = await getSession();
      const accessToken = session?.accessToken;
      const config: AxiosRequestConfig = {
        url: baseUrl + url,
        method: method,
        data: data,
        params: params,
        responseType: responseType,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const result = await axios(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response?.status === 401) {
        const session = await getSession();
        const refreshToken = session?.refreshToken;
        const result = await axios({
          ...err.config,
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        });
        return { data: result.data };
      }
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
