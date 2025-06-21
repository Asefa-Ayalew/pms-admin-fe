import { Button, MantineColor, Paper, Title } from "@mantine/core";
import { IconArrowLeft, IconMaximize, IconMinimize } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface EntityDetailViewProps {
  detailTitle?: string;
  title?: string;
  rootUrl?: string;
  detail?: any;
  fullScreen?: boolean;
  setFullScreen?: (fullScreen: boolean) => void;
  primaryColor?: MantineColor;
  secondaryColor?: MantineColor;
  className?: string;
  showBackButton?: boolean;
  showExpandButton?: boolean;
  customBackUrl?: string;
  onBack?: () => void;
}

export const EntityDetailView: FC<EntityDetailViewProps> = ({
  detailTitle,
  title,
  rootUrl,
  detail,
  fullScreen,
  setFullScreen,
  primaryColor = "blue",
  secondaryColor,
  className = "",
  showBackButton = true,
  showExpandButton = true,
  customBackUrl,
  onBack,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(customBackUrl || `${rootUrl}`);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Paper className="mb-4 p-4 w-full bg-amber-200  flex justify-between items-center">
        <div className="flex justify-between w-full">
          {showBackButton && (
            <Button
              leftSection={<IconArrowLeft size={16} />}
              variant="subtle"
              color={primaryColor}
              size="sm"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Title order={3} className="text-gray-700 ml-4">
            {detailTitle || title}
          </Title>
          {showExpandButton && setFullScreen && (
            <Button
              variant="subtle"
              color={primaryColor}
              size="sm"
              onClick={() => setFullScreen(!fullScreen)}
              leftSection={
                fullScreen ? (
                  <IconMinimize size={16} />
                ) : (
                  <IconMaximize size={16} />
                )
              }
            >
              {fullScreen ? "Normal" : "Expand"}
            </Button>
          )}
        </div>
      </Paper>
      <div className="flex-grow overflow-auto">{detail}</div>
    </div>
  );
};
