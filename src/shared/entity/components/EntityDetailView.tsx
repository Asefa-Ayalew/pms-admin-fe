import { Button, MantineColor, Paper, Title } from "@mantine/core";
import { IconArrowLeft, IconMaximize, IconMinimize } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement } from "react";

interface EntityDetailViewProps {
  detailTitle?: string | ReactElement<any>;
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
  // secondaryColor,
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
        <div className="flex space-x-0 w-full">
            {showBackButton && (
            <Button
              leftSection={<IconArrowLeft size={16} />}
              variant="subtle"
              color={primaryColor}
              size="sm"
              onClick={handleBack}
            >
            </Button>
          )}
          <Title order={4} className="text-gray-700 ml-4 w-full">
            {detailTitle || title}
          </Title>
        </div>
          {showExpandButton && setFullScreen && (
            <Button
              variant="subtle"
              color={primaryColor}
              size="sm"
              onClick={() => setFullScreen(!fullScreen)}
              leftSection={
                fullScreen ? (
                  <IconMinimize size={18} />
                ) : (
                  <IconMaximize size={18} />
                )
              }
            >
              {fullScreen}
            </Button>
          )}
        </div>
      </Paper>
      <div className="flex-grow overflow-auto">{detail}</div>
    </div>
  );
};
