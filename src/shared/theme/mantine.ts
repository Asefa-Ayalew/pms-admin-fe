import { generateColors } from "@mantine/colors-generator";
import type { MantineTheme, MantineThemeOverride } from "@mantine/core";

export const theme: Partial<MantineThemeOverride> = {
  defaultRadius: "sm",
  primaryColor: "primary",
  primaryShade: 6,

  breakpoints: {
    xs: "36rem",
    sm: "48rem",
    md: "62rem",
    lg: "75rem",
    xl: "87.5rem",
  },

  colors: {
    primary: generateColors("#225ADD"),
    secondary: generateColors("#DDA522"),
    tertiary: generateColors("#71DCA6"),
    // 6adca0

    orange: [
      "#FFF4E6",
      "#FFE8CC",
      "#FFD8A8",
      "#FFC078",
      "#FFA94D",
      "#FF922B",
      "#FD7E14",
      "#F76707",
      "#E8590C",
      "#D9480F",
    ],
    blue: [
      "#E6F0FF",
      "#BFDBFE",
      "#93C5FD",
      "#60A5FA",
      "#3B82F6",
      "#2563EB",
      "#1D4ED8",
      "#1E40AF",
      "#1E3A8A",
      "#1E365E",
    ],
    gray: [
      "#f8f9fa",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
      "#000000",
    ],
    green: [
      "#EDFAF5",
      "#D2F0E0",
      "#A7E3C0",
      "#6CC291",
      "#42AD68",
      "#2FAA53",
      "#1E9C3D",
      "#128C29",
      "#0A7A1E",
      "#08661D",
    ],
    dark: [
      "#1E1E1E",
      "#2B2B2B",
      "#383838",
      "#444444",
      "#515151",
      "#5E5E5E",
      "#6B6B6B",
      "#7A7A7A",
      "#8A8A8A",
      "#999999",
    ],
    black: [
      "#000000",
      "#0d0d0d",
      "#1a1a1a",
      "#262626",
      "#333333",
      "#404040",
      "#4d4d4d",
      "#595959",
      "#666666",
      "#737373",
    ],
    white: [
      "#ffffff",
      "#f2f2f2",
      "#e6e6e6",
      "#d9d9d9",
      "#cccccc",
      "#bfbfbf",
      "#b3b3b3",
      "#a6a6a6",
      "#999999",
      "#8c8c8c",
    ],
    light: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
    lightDark: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
    darkLight: [
      "#1E1E1E",
      "#2B2B2B",
      "#383838",
      "#444444",
      "#515151",
      "#5E5E5E",
      "#6B6B6B",
      "#7A7A7A",
      "#8A8A8A",
      "#999999",
    ],
    darkDark: [
      "#1E1E1E",
      "#2B2B2B",
      "#383838",
      "#444444",
      "#515151",
      "#5E5E5E",
      "#6B6B6B",
      "#7A7A7A",
      "#8A8A8A",
      "#999999",
    ],
    darkGray: [
      "#1E1E1E",
      "#2B2B2B",
      "#383838",
      "#444444",
      "#515151",
      "#5E5E5E",
      "#6B6B6B",
      "#7A7A7A",
      "#8A8A8A",
      "#999999",
    ],
  },

  components: {
    Container: {
      defaultProps: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1320,
        },
      },
    },
    Button: {
      defaultProps: {
        size: "xs",
      },
      styles: {
        section: {
          marginRight: 4,
          marginLeft: 1,
        },
        root: (theme: MantineTheme) => ({
          backgroundColor: theme.colors.pink[6],

          color: theme.white,
          borderRadius: theme.radius.md,
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
          "&:hover": {
            backgroundColor: theme.primaryColor[5],
          },
        }),
      },
    },

    // Button: {
    //   defaultProps: {
    //     size: "xs",
    //   },
    //   styles: (theme: MantineTheme) => ({
    //     root: {
    //       backgroundColor: theme.primaryColor,
    //       color: theme.white,
    //       borderRadius: theme.radius.md,
    //       padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    //       "&:hover": {
    //         backgroundColor: theme.primaryColor[5],
    //       },
    //     },
    //     section: {
    //       marginRight: 4,
    //       marginLeft: 1,
    //     },
    //   }),
    // },

    Input: {
      defaultProps: {
        size: "sm",
      },
    },
    TextInput: {
      defaultProps: {
        size: "sm",
      },
    },
    NumberInput: {
      defaultProps: {
        size: "sm",
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
      },
    },
    PasswordInput: {
      defaultProps: {
        size: "sm",
      },
    },
    Breadcrumbs: {
      styles: {
        breadcrumb: {
          fontSize: "14px",
        },
      },
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: "#F3F4F6",
        },
        header: {
          height: 40,
        },
      },
    },
    // Table: {
    //   styles: {
    //     root: {
    //       "& th, & td": {
    //         color: "#171717",
    //       },
    //     },
    //     td: {
    //       color: "#171717",
    //     },
    //     th: {
    //       color: "#171717",
    //       fontWeight: 600,
    //     },
    //   },
    // },
  },
};
