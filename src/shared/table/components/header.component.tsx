"use client";

import {
  ActionIcon,
  Drawer,
  Group,
  Paper,
  Title,
  Tooltip,
  Box,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconX,
  IconHelpCircle,
  IconLogs,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useState } from "react";

interface HeaderComponentProps<T = React.ReactNode> {
  detailTitle?: string | React.ReactElement;
  title?: string;
  rootUrl?: string;
  detail?: T;
  fullScreen?: boolean;
  setFullScreen?: (fullScreen: boolean) => void;
  className?: string;
  showBackButton?: boolean;
  showExpandButton?: boolean;
  customBackUrl?: string;
  onBack?: () => void;
  headerContents?: {
    help?: ReactElement;
    activity?: ReactElement;
  };
}

export const HeaderComponent: FC<HeaderComponentProps> = ({
  detailTitle,
  title,
  rootUrl,
  detail,
  fullScreen,
  setFullScreen,
  className = "",
  showBackButton = false,
  showExpandButton = true,
  customBackUrl,
  onBack,
  headerContents,
}) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"help" | "activity" | undefined>(
    undefined
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(customBackUrl || `${rootUrl}`);
    }
  };

  const toggleDrawer = (type: "help" | "activity") => {
    if (drawerOpen && drawerType === type) {
      setDrawerOpen(false);
      setDrawerType(undefined);
    } else {
      setDrawerOpen(true);
      setDrawerType(type);
    }
  };

  return (
    <Box className={`h-full w-full flex flex-col ${className}`}>
      <Paper
        shadow="xs"
        radius="md"
        className="mb-4 px-4 py-3 flex items-center justify-between bg-white"
      >
        <div className="flex justify-between">
          <Group gap="xs" align="center" className="flex-1 overflow-hidden">
            {showBackButton && (
              <Tooltip label="Go back">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  size="md"
                  onClick={handleBack}
                >
                  <IconArrowLeft size={16} />
                </ActionIcon>
              </Tooltip>
            )}

            <Title
              order={4}
              className="text-gray-800 font-semibold truncate w-[92%]"
            >
              {detailTitle || title}
            </Title>
          </Group>

          <div className="flex-shrink-0">
            {showExpandButton && setFullScreen && (
              <Tooltip label={fullScreen ? "Exit full screen" : "Full screen"}>
                <ActionIcon
                  variant={fullScreen ? "filled" : "subtle"}
                  size="md"
                  onClick={() => setFullScreen(!fullScreen)}
                >
                  {fullScreen ? (
                    <IconArrowsMinimize size={16} />
                  ) : (
                    <IconArrowsMaximize size={16} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip label="Quick Help">
              <ActionIcon
                variant={drawerType === "help" ? "filled" : "subtle"}
                size="md"
                onClick={() => toggleDrawer("help")}
              >
                <IconHelpCircle size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Activity Log">
              <ActionIcon
                variant={drawerType === "activity" ? "filled" : "subtle"}
                size="md"
                onClick={() => toggleDrawer("activity")}
              >
                <IconLogs size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Close">
              <ActionIcon
                variant="subtle"
                size="md"
                onClick={handleBack}
              >
                <IconX size={16} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      </Paper>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerType === "help" ? "Help" : "Activity Log"}
        position="right"
        padding="md"
        size="md"
      >
        {drawerType === "help" &&
          (headerContents?.help ? (
            headerContents.help
          ) : (
            <p className="text-gray-500 italic">No quick help found.</p>
          ))}

        {drawerType === "activity" &&
          (headerContents?.activity ? (
            headerContents.activity
          ) : (
            <p className="text-gray-500 italic">No activities found.</p>
          ))}
      </Drawer>

      <Box className="flex-1 overflow-auto bg-white">{detail}</Box>
    </Box>
  );
};
