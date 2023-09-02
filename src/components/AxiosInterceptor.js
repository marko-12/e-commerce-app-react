import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

function AxiosInterceptor({ children }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    axios.interceptors.request.use(
      async (config) => {
        if (config.url !== "/api/products") {
          config.headers["Authorization"] = localStorage.getItem("token")
            ? `Bearer ${JSON.parse(localStorage.getItem("token")).access_token}`
            : null;
          config.headers["Accept"] = "application/json";
          config.headers["Content-Type"] = "application/json";
        } else {
          config.headers["Authorization"] = localStorage.getItem("token")
            ? `Bearer ${JSON.parse(localStorage.getItem("token")).access_token}`
            : null;
          config.headers["Accept"] = "application/json";
          config.headers["Content-Type"] = "multipart/form-data";
        }

        return config;
      },
      async (error) => {
        return Promise.reject(error);
      }
    );

    const refreshToken = async () => {
      try {
        const refresh_token = localStorage.getItem("token")
          ? JSON.parse(localStorage.getItem("token")).refresh_token
          : null;
        const token = await axios.post("/api/auth/refresh", {
          refresh_token: refresh_token,
        });
        ctxDispatch({ type: "USER_TOKEN", payload: token.data });
        localStorage.setItem("token", JSON.stringify(token.data));
        return token;
      } catch (err) {
        toast.error(getError(err));
      }
    };

    const signoutHandler = async () => {
      ctxDispatch({ type: "USER_SIGNOUT" });
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
      window.location.href = "/signin";
    };

    axios.interceptors.response.use(
      async (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 || error.response.status === 401) {
          // if (!originalRequest._retry) {
          //   originalRequest._retry = true;
          //   const { data } = await refreshToken();
          //   axios.defaults.headers.common[
          //     "Authorization"
          //   ] = `Bearer ${data.access_token}`;
          //   axios.defaults.headers.common["Accept"] = "application/json";
          //   axios.defaults.headers.common["Content-Type"] = "application/json";
          //   return axios(originalRequest);
          // }
          signoutHandler();
        }
        return Promise.reject(error);
      }
    );
  });

  //   const ref_token = localStorage.getItem("token").refresh_token
  //     ? JSON.parse(localStorage.getItem("token")).refresh_token
  //     : null;

  return children;
}

export default AxiosInterceptor;
