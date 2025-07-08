"use client";

import { useEffect, useState } from "react";

import { User } from "@/src/models/user.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { useParams } from "next/navigation";
import { useLazyGetUsersQuery } from "./_store/user.query";

export default function UserListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  //Component states
  const [check, setCheck] = useState(false);
  const [selectedUser, setSelectedType] = useState<User>();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  //Rtk hooks
  const [getUser, users] = useLazyGetUsersQuery();

  useEffect(() => {
    getUser(collection);
  }, [collection]);

  useEffect(() => {
    setSelectedType(
      users?.data?.data?.find((user) => user?.id === `${params?.id}`)
    );
  });

  useEffect(() => {
    if (params?.id !== undefined) {
      setViewMode("detail");
    } else {
      setViewMode("list");
    }
  }, [setViewMode, params]);

  const config: EntityConfig<User> = {
    primaryColumn: {
      key: "User Name",
      name: "User Name",
      render: (data: User) =>
        `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
          data?.lastName ?? ""
        }`,
    },
    rootUrl: "/user",
    identity: "id",
    visibleColumn: [
      {
        key: "name",
        name: "User Name",
        render: (data: User) =>
          `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
            data?.lastName ?? ""
          }`,
      },
      {
        key: "isEmployee",
        name: "Employee",
      },
      {
        key: "gender",
        name: "Gender",
        render: (value) => {
          return <span className="capitalize">{value?.gender}</span>;
        },
      },
      { key: "employeeNumber", name: "User Employee Number" },
      { key: "phone", name: "Phone Number" },
      { key: "startDate", name: "Employment Date", isDate: true },
      { key: "tin", name: "TIN" },
      {
        key: "createdAt",
        name: "Regisration Date",
        isDate: true,
      },
    ],
  };

  const data = users?.data?.data;
  return (
    <div className="flex w-full">
      <EntityList
        parentStyle="w-full"
        viewMode={viewMode}
        check={check}
        detail={children}
        showArchived={false}
        showSelector={true}
        tableKey="users"
        title={"User Names"}
        detailTitle={`${selectedUser?.firstName ?? ""} ${selectedUser?.middleName ?? ""} ${
          selectedUser?.lastName ?? ""
        }`}
        newButtonText="New"
        total={users?.data?.count || 0}
        collectionQuery={collection}
        itemsLoading={users?.isLoading || users?.isFetching}
        config={config}
        items={data}
        initialPage={1}
        defaultPageSize={collection.top}
        onShowSelector={(e) => setCheck(e)}
        onPaginationChange={(skip: number, top: number) => {
          const after = (skip - 1) * top;
          setCollection({ ...collection, skip: after, top: top });
        }}
        onSearch={(data: string | undefined) => {
          if (data === "") {
            setCollection({
              ...collection,
              search: "",
              searchFrom: [],
            });
          } else {
            setCollection({
              ...collection,
              search: data,
              searchFrom: [
                "firstName",
                "middleName",
                "lastName",
                "phone",
                "employeeNumber",
                "userType",
                "tin",
                "gender",
              ],
            });
          }
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
