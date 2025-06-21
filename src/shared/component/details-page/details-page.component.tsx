import type { JSX, ReactNode } from "react";

// import { Button, Divider, Empty, Image, Table, Typography } from "antd";

import {
  Badge,
  Button,
  Card,
  Table,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconListDetails, IconStarFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import EmptyIcon from "../../icons/empty-icon";
import DetailsPageSkeleton from "./details-page-skeleton.component";
export interface DataType {
  key: string;
  label: string;
  value: any;
  children?: DataType[];
  type?: "string" | "date" | "number" | "boolean";
}

interface ProfileHeaderDataType {
  image: string | false;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  isVerified: boolean;
}

interface ProfileHeaderProps {
  profile: ProfileHeaderDataType;
  editUrl: string;
  hideEditButton: boolean;
  children?: ReactNode;
}

export interface DetailsConfig {
  isProfile: boolean;
  title: string;
  editUrl?: string;
  widthClass?: string;
  hideEditButton?: boolean;
}

interface Props {
  dataSource: Array<{
    title: string;
    source: DataType[];
  }>;
  config: DetailsConfig;
  description?: string;
  profileData?: ProfileHeaderDataType;
  additionalActions?: ReactNode;
  isLoading: boolean;
}

export default function DetailsPage(props: Props): JSX.Element {
  const {
    dataSource,
    profileData,
    description,
    additionalActions,
    config,
    isLoading,
  } = props;

  const {
    isProfile,
    editUrl = "",
    widthClass = "max-w-2xl",
    hideEditButton = false,
  } = config;

  if (isLoading) {
    return (
      <DetailsPageSkeleton showProfile={isProfile} widthClass={widthClass} />
    );
  }

  if (!isLoading && dataSource.length === 0) {
    return <EmptyIcon />;
  }
  return (
    <div className={`p-4 mx-auto font-roboto ${widthClass}`}>
      {isProfile && profileData !== undefined ? (
        <ProfileHeader
          profile={profileData}
          editUrl={editUrl}
          hideEditButton={hideEditButton}
        >
          {additionalActions}
        </ProfileHeader>
      ) : (
        <div className="flex justify-between items-center p-2 gap-2">
          {/* <Title order={4} className="mb-0">
            {title}
          </Title> */}
          {!hideEditButton && <EditButton editUrl={editUrl} />}
          {additionalActions}
        </div>
      )}

      {dataSource.map(({ title, source }) => {
        return (
          <section
            className="mb-8 flex flex-col space-y-4 mt-8 last:mb-0 font-sans"
            key={title}
          >
            <Table>
              <Table.Tbody>
                {(() => {
                  const hasChildren = source.some(
                    (item) => item.children?.length ?? 0 > 0
                  );

                  return source.flatMap((data, index) => {
                    if (data.children && data.children.length > 0) {
                      return [
                        <Table.Tr
                          key={data.key}
                          className="border border-dashed border-gray-200"
                        >
                          <Table.Td
                            className="p-2 bg-gray-100 text-gray-900 border-r border-gray-200 align-center"
                            rowSpan={data.children.length}
                          >
                            {data.label}
                          </Table.Td>
                          <Table.Td className=" bg-gray-100 p-2 border-r text-gray-800">
                            {data.children[0].label}
                          </Table.Td>
                          <Table.Td className="p-2 w-3/4">
                            {Array.isArray(data.children[0].value)
                              ? data.children[0].value.map((value, i) => (
                                  <Badge
                                    color="primary"
                                    variant="light"
                                    mx={1}
                                    key={i}
                                  >
                                    {value}
                                  </Badge>
                                ))
                              : data.children[0].value}
                          </Table.Td>
                        </Table.Tr>,
                        ...data.children.slice(1).map((child) => (
                          <Table.Tr
                            key={child.key}
                            className="border border-gray-200 border-dashed"
                          >
                            <Table.Td className=" bg-gray-100 p-2 border-r text-gray-800">
                              {child.label}
                            </Table.Td>
                            <Table.Td className="p-2 w-3/4">
                              {Array.isArray(child.value)
                                ? child.value.map((value, i) => (
                                    <Badge
                                      color="primary"
                                      variant="light"
                                      mx={1}
                                      key={i}
                                    >
                                      {value}
                                    </Badge>
                                  ))
                                : child.value}
                            </Table.Td>
                          </Table.Tr>
                        )),
                      ];
                    }
                    return (
                      <Table.Tr
                        key={data.key}
                        className={`border border-gray-200 border-dashed ${
                          index === 0 ? "border-t" : ""
                        }`}
                      >
                        <Table.Td
                          className="p-2 bg-gray-100 text-gray-900 border-r"
                          colSpan={hasChildren ? 2 : 1}
                        >
                          {data.label}
                        </Table.Td>
                        <Table.Td className="p-2 w-3/4">
                          {Array.isArray(data.value)
                            ? data.value.map((value, i) => (
                                <Badge
                                  color="primary"
                                  variant="light"
                                  mx={1}
                                  key={i}
                                >
                                  {value}
                                </Badge>
                              ))
                            : data.value}
                        </Table.Td>
                      </Table.Tr>
                    );
                  });
                })()}
              </Table.Tbody>
            </Table>

            {description ? (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={500} mb="sm">
                  Description:
                </Text>
                <TypographyStylesProvider>
                  <div
                    dangerouslySetInnerHTML={{ __html: description ?? "" }}
                  />
                </TypographyStylesProvider>
              </Card>
            ) : (
              ""
            )}
          </section>
        );
      })}
    </div>
  );
}

function ProfileHeader(props: ProfileHeaderProps): JSX.Element {
  const { profile, editUrl, children = null, hideEditButton } = props;
  const { image, name, type, address, phone, email, isVerified } = profile;

  return (
    <section
      id="profile-header"
      className="flex gap-2 bg-gray-100 p-4 rounded-sm"
    >
      {image !== false && (
        // <div className="w-24 h-24 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded-full">
        //   <Image className="rounded-full" src={image} />
        // </div>
        <div className=""></div>
      )}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-0.5">
          {name}
          {isVerified && <IconStarFilled />}
        </h1>
        <h2 className="text-xl">{type}</h2>

        <div className="mt-3">
          <Text className="block">{address}</Text>
          <Text className="block">{phone}</Text>
          <Text className="block">{email}</Text>
        </div>
      </div>

      <div className="ml-auto self-start flex items-center gap-2">
        {!hideEditButton && <EditButton editUrl={editUrl} />}
        {children}
      </div>
    </section>
  );
}

function EditButton({ editUrl }: { editUrl: string }): JSX.Element {
  const router = useRouter();

  return (
    <Button
      leftSection={<IconListDetails size={12} />}
      variant="filled"
      radius={"xl"}
      className="w-max ml-auto  flex items-center gap-0.5 bg-primary-500 text-white"
      onClick={() => {
        router.push(editUrl);
      }}
    >
      Edit
    </Button>
  );
}
