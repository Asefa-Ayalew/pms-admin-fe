import { appApi } from "@/src/store/app.api";
import { ROUTE_ENDPOINT } from "./file.endpoint";

const signedUrlQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignedUrl: builder.query<
      { link: string },
      { bucketName: string; name: string }
    >({
      query: (data: { bucketName: string; name: string }) => ({
        url: `${ROUTE_ENDPOINT.getSignedUrl}`,
        method: "get",
        params: data,
      }),
    }),
  }),
  overrideExisting: true,
});
export const { useLazyGetSignedUrlQuery } = signedUrlQuery;
