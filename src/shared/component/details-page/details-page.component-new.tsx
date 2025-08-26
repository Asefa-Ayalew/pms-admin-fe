import DetailsPageSkeleton from "./details-page-skeleton.component";
import dateFormat from "dateformat";
import { IconStarFilled } from "@tabler/icons-react";
import EmptyIcon from "../../icons/empty-icon";
import { Button, Divider, Image, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { JSX, ReactNode } from "react";

export interface DataType {
  key: string;
  label: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
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
  profileData?: ProfileHeaderDataType;
  additionalActions?: ReactNode;
  isLoading: boolean;
}

export default function DetailsPageNew(props: Props): JSX.Element {
  const { dataSource, profileData, additionalActions, config, isLoading } =
    props;
  const {
    isProfile,
    title,
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
          <Title order={4} className="mb-0">
            {title}
          </Title>
          {!hideEditButton && <EditButton editUrl={editUrl} />}
          {additionalActions}
        </div>
      )}

      <Divider />

      {dataSource.map(({ title, source }) => (
        <section
          className="mb-8 flex flex-col space-y-4 mt-8 last:mb-0"
          key={title}
        >
          <Title order={4}>{title}</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {source.map((data) => (
              <div
                key={data.key}
                className="flex flex-col md:flex-row items-center mb-2"
              >
                <Text className="font-semibold text-lg md:w-1/3">
                  {data.label}:
                </Text>
                <div className="flex items-center md:w-2/3">
                  <Text className="text-gray-600 text-lg">
                    {formatData(data)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProfileHeader(props: ProfileHeaderProps): JSX.Element {
  const { profile, editUrl, children = null, hideEditButton } = props;
  const { image, name, type, address, phone, email, isVerified } = profile;

  return (
    <section className="bg-gray-100 p-4 rounded-sm">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        {image !== false && (
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image src={image} alt="Profile" />
          </div>
        )}
        <div className="flex flex-col md:flex-grow">
          <Title order={4} className="mb-0">
            {name}
            {isVerified && <IconStarFilled />}
          </Title>
          <Text className="text-lg">{type}</Text>
          <Text className="mt-2">{address}</Text>
          <Text>{phone}</Text>
          <Text>{email}</Text>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!hideEditButton && <EditButton editUrl={editUrl} />}
          {children}
        </div>
      </div>
    </section>
  );
}

function EditButton({ editUrl }: { editUrl: string }): JSX.Element {
  const router = useRouter();

  return (
    <Button
      variant="filled"
      radius="xl"
      className="bg-primary-500 text-white"
      bg={"primary.4"}
      onClick={() => {
        router.push(editUrl);
      }}
    >
      Edit
    </Button>
  );
}

function formatData(data: DataType): string {
  if (data.type === "date") {
    return dateFormat(data.value, "mmmm dS, yyyy");
  }
  return String(data.value);
}
