"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Department } from "@/src/models/department.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { useLazyGetUsersQuery } from "../user/_store/user.query";
import { useLazyGetDepartmentsQuery } from "./_store/department.query";

export default function DepartmentListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  // Component states
  const [check, setCheck] = useState(false);
  const [selectedDepartment, setSelectedType] = useState<Department>();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [userCollection] = useState<CollectionQuery>({
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  // RTK hooks
  const [getDepartment, departments] = useLazyGetDepartmentsQuery();
  const [getUsers, users] = useLazyGetUsersQuery();

  useEffect(() => {
    getDepartment(collection);
  }, [collection, getDepartment]);

  useEffect(() => {
    getUsers(userCollection);
  }, [userCollection, getUsers]);

  useEffect(() => {
    setSelectedType(
      departments?.data?.data?.find((item) => item?.id === `${params?.id}`)
    );
  }, [params?.id, departments?.data?.data]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config: EntityConfig<Department> = {
    primaryColumn: {
      key: "name",
      name: "Department Name",
      render: (data: Department) => `${data?.name ?? ""}`,
    },
    rootUrl: "/departments",
    identity: "id",
    visibleColumn: [
      {
        key: "name",
        name: "Department Name",
        render: (data: Department) => `${data?.name ?? ""}`,
      },
      // {
      //   key: "users",
      //   name: "# of Users",
      //   render: (data: Department) =>
      //     users?.data?.data?.filter((user: User) => user.departmentId === data.id).length ?? 0,
      // },
      {
        key: "createdAt",
        name: "Registration Date",
        isDate: true,
      },
    ],
  };
  console.log(users);
  const data = departments?.data?.data;

  return (
    <div className="flex w-full">
      <EntityList
        parentStyle="w-full"
        viewMode={viewMode}
        check={check}
        detail={children}
        showArchived={false}
        showSelector={true}
        tableKey="departments"
        title="Departments"
        detailTitle={`${selectedDepartment?.name ?? ""}`}
        newButtonText="New"
        total={departments?.data?.count || 0}
        collectionQuery={collection}
        itemsLoading={departments?.isLoading || departments?.isFetching}
        config={config}
        items={data}
        initialPage={1}
        defaultPageSize={collection.top}
        pageSize={[20, 30, 50, 100]}
        onShowSelector={(e) => setCheck(e)}
        onPaginationChange={(skip: number, top: number) => {
          const after = (skip - 1) * top;
          setCollection({ ...collection, skip: after, top: top });
        }}
        onSearch={(data: string | undefined) => {
          setCollection({
            ...collection,
            search: data || "",
            searchFrom: data ? ["name"] : [],
          });
        }}
        onFilterChange={(
          data: { field: string; value: string | number | boolean }[]
        ) => {
          if (collection?.filter || data.length > 0) {
            // setCollection({ ...collection, filter: data });
          }
        }}
        onOrder={(data: Order) =>
          setCollection({ ...collection, orderBy: [data] })
        }
      />
    </div>
  );
}
