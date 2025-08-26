import { axiosBaseQuery } from "@/src/shared/utitlity/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Users",
    "UserInfo",
    "Properties",
    "Tenants",
    "Rooms",
    "BankAccounts",
    "FAQs",
    "Feedbacks",
    "Testimonials",
    "Services",
    "Departments",
    "Leases",
    "Gallery",
    "EmergencyContacts"
  ],
  endpoints: () => ({}),
});
