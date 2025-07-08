"use client";
import {
  Box,
  Button,
  Card,
  Collapse,
  Group,
  Table,
  Text,
  TypographyStylesProvider,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronRight,
  IconListDetails,
  IconStarFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { JSX } from "react";
import EmptyIcon from "../../icons/empty-icon";
import DetailsPageSkeleton from "./details-page-skeleton.component";

interface DataType {
  key: string;
  label: string;
  value?: any;
  level?: number;
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
  children?: React.ReactNode;
}

interface DetailsConfig {
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
  additionalActions?: React.ReactNode;
  isLoading: boolean;
  hideEdit?: boolean;
}

export default function DetailsPage(props: Props): React.JSX.Element {
  const {
    dataSource,
    profileData,
    description,
    additionalActions,
    config,
    isLoading,
    hideEdit = false,
  } = props;

  const {
    isProfile,
    editUrl = "",
    widthClass = "max-w-3xl",
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
    <div className={`p-6 mx-auto font-roboto ${widthClass} bg-white shadow rounded-lg`}>
      {!hideEdit &&
        (isProfile && profileData ? (
          <ProfileHeader
            profile={profileData}
            editUrl={editUrl}
            hideEditButton={hideEditButton}
          >
            {additionalActions}
          </ProfileHeader>
        ) : (
          <div className="flex justify-between items-center p-2 gap-2">
            {!hideEditButton && <EditButton editUrl={editUrl} />}
            {additionalActions}
          </div>
        ))}

      {dataSource.map(({ title, source }) => (
        <Box key={title} className="mb-6 p-4">
          <Text fw={600} size="lg" mb="md" className="text-blue-700">
            {title}
          </Text>

          <Table className="w-full">
            <Table.Tbody>
              {source.map((item) => (
                <CollapsibleRow key={item.key} item={item} depth={0} />
              ))}
            </Table.Tbody>
          </Table>

          {description && (
            <Card shadow="xs" padding="lg" radius="md" mt="lg" withBorder>
              <Text fw={500} mb="sm">Description:</Text>
              <TypographyStylesProvider>
                <div dangerouslySetInnerHTML={{ __html: description ?? "" }} />
              </TypographyStylesProvider>
            </Card>
          )}
        </Box>
      ))}
    </div>
  );
}

function CollapsibleRow({
  item,
  depth,
}: {
  item: DataType;
  depth: number;
}): React.JSX.Element {
  const [opened, { toggle }] = useDisclosure(false);
  const hasChildren = item.children && item.children.length > 0;

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      // Flat array of primitives
      return value.map((val: string | number | boolean, index: number) => (
        <Badge key={index} variant="light" color="blue" mr={5}>
          {String(val)}
        </Badge>
      ));
    } else if (typeof value === "string" && value.includes(",")) {
      // Comma-separated string
      return value.split(",").map((val: string, index: number) => (
        <Badge key={index} variant="light" color="blue" mr={5}>
          {val.trim()} 
        </Badge>
      ));
    } else {
      return value ?? "—";
    }
  };

  return (
    <>
      <Table.Tr className="transition hover:bg-gray-50">
        <Table.Td
          style={{ paddingLeft: `${depth * 40}px` }}
          fw={800}
          className="pl-3 bg-gray-100 w-1/4"
        >
          <Group gap="xs" className="pl-2">
            {hasChildren && (
              <button onClick={toggle} className="p-0 m-0 border-0 bg-transparent">
                {opened ? (
                  <IconChevronDown size={16} className="text-gray-600" />
                ) : (
                  <IconChevronRight size={16} className="text-gray-600" />
                )}
              </button>
            )}
            <span className="text-black p-1">{item.label}</span>
          </Group>
        </Table.Td>
        <Table.Td>{renderValue(item.value)}</Table.Td>
      </Table.Tr>

      {hasChildren &&
        opened &&
        item.children?.map((child) => (
          <CollapsibleRow key={child.key} item={child} depth={depth + 1} />
        ))}
    </>
  );
}

function ProfileHeader(props: ProfileHeaderProps): JSX.Element {
  const { profile, editUrl, children = null, hideEditButton } = props;
  const { image, name, type, address, phone, email, isVerified } = profile;

  return (
    <section
      id="profile-header"
      className="flex gap-4 bg-gray-50 p-6 rounded-md border mb-6"
    >
      {image !== false && (
        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
      )}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {name}
          {isVerified && <IconStarFilled className="text-yellow-500" />}
        </h1>
        <h2 className="text-lg text-gray-700">{type}</h2>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
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
      leftSection={<IconListDetails size={14} />}
      variant="filled"
      radius="xl"
      size="sm"
      className="w-max ml-auto bg-blue-600 hover:bg-blue-700 text-white"
      onClick={() => router.push(editUrl)}
    >
      Edit
    </Button>
  );
}
