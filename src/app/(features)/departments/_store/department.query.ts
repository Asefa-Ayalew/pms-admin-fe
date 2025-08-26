import { Department } from "@/src/models/department.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { notifications } from "@mantine/notifications";
import { DEPARTMENT_ENDPOINT } from "./department.endpoint";
import { AppError } from "@/src/models/app-interfaces";

let departmentCollection: CollectionQuery;

export const departmentQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartment: builder.query<Department, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${DEPARTMENT_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getDepartments: builder.query<Collection<Department>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: DEPARTMENT_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Departments"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            departmentCollection = param;
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

      getArchivedDepartments: builder.query<Collection<Department>, CollectionQuery>(
          {
            query: (data: CollectionQuery) => ({
              url: DEPARTMENT_ENDPOINT.listArchivedDepartments,
              method: "GET",
              params: collectionQueryBuilder(data),
            }),
            providesTags: ["Departments"],
            async onQueryStarted(param, { queryFulfilled }) {
              try {
                const { data } = await queryFulfilled;
                if (data) {
                  departmentCollection = param;
                }
              } catch (error: unknown) {
                notifications.show({
                  title: "Error",
                  message:
                    (error as AppError)?.error?.data?.message || "Error, try again",
                  color: "red",
                });
              }
            },
          }
        ),

    createDepartment: builder.mutation<Department, Department>({
      query: (newData: Department) => ({
        url: `${DEPARTMENT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Departments"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            notifications.show({
              title: "Success",
              message: "Successfully created",
              color: "green",
            });

            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data.push(data);
                    draft.count += 1;
                  }
                }
              )
            );
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    updateDepartment: builder.mutation<Department, Department>({
      query: (newData: Department) => ({
        url: `${DEPARTMENT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["Departments"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((item) =>
                      item.id === data.id ? data : item
                    );
                  }
                }
              )
            );

            notifications.show({
              title: "Success",
              message: "Successfully updated",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
    archiveDepartment: builder.mutation<Department, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${DEPARTMENT_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((department) => {
                      if (department.id === data.id) return data;
                      else {
                        return department;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartment",
                param,
                (draft) => {
                  if (data) {
                    draft.archivedAt = data?.archivedAt;
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully archived",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    restoreDepartment: builder.mutation<Department, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${DEPARTMENT_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((department) => {
                      if (department.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return department;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartment",
                param,
                (draft) => {
                  if (data) {
                    draft.archivedAt = "";
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully restored",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    deleteDepartment: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${DEPARTMENT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.filter(
                      (item) => item.id?.toString() !== id
                    );
                    draft.count -= 1;
                  }
                }
              )
            );

            notifications.show({
              title: "Success",
              message: "Successfully deleted",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useLazyGetDepartmentQuery,
  useLazyGetArchivedDepartmentsQuery,
  useArchiveDepartmentMutation,
  useGetDepartmentQuery,
  useRestoreDepartmentMutation,
  useLazyGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentQuery;
