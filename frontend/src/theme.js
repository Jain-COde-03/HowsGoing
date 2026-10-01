import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  colors: {
    whatsapp: {
      50: "#e7fce3",
      100: "#d9fdd3",
      200: "#b4f8a8",
      300: "#80f26f",
      400: "#4deb36",
      500: "#25d366", // WhatsApp bright green
      600: "#00a884", // WhatsApp Web emerald green
      700: "#008069", // WhatsApp primary teal
      800: "#075e54", // WhatsApp dark teal
      900: "#05463e",
    },
    waBg: {
      panel: "#f0f2f5",
      panelHover: "#f5f6f6",
      chat: "#efeae2",
      window: "#d1d7db",
      bubbleIn: "#ffffff",
      bubbleOut: "#d9fdd3",
    },
    waText: {
      primary: "#111b21",
      secondary: "#667781",
      muted: "#8696a0",
      green: "#008069",
      blue: "#53bdeb",
    },
    waBorder: {
      default: "#e9edef",
      light: "#f0f2f5",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#d1d7db",
        color: "#111b21",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      },
      "::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#c1c7cb",
        borderRadius: "3px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#a0a6aa",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "8px",
      },
      variants: {
        whatsapp: {
          bg: "#008069",
          color: "white",
          _hover: {
            bg: "#00a884",
          },
          _active: {
            bg: "#075e54",
          },
        },
        whatsappOutline: {
          border: "1px solid",
          borderColor: "#008069",
          color: "#008069",
          bg: "#f0fdf4",
          _hover: {
            bg: "#e7fce3",
          },
        },
      },
    },
    Input: {
      variants: {
        whatsapp: {
          field: {
            bg: "#f0f2f5",
            border: "1px solid transparent",
            borderRadius: "8px",
            color: "#111b21",
            _placeholder: { color: "#8696a0" },
            _hover: { bg: "#e9edef" },
            _focus: {
              borderColor: "#00a884",
              bg: "#ffffff",
              boxShadow: "0 0 0 1px #00a884",
            },
          },
        },
      },
      defaultProps: {
        variant: "whatsapp",
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 17px 50px 0 rgba(11,20,26,.19), 0 12px 15px 0 rgba(11,20,26,.24)",
        },
        header: {
          bg: "#008069",
          color: "white",
          fontSize: "18px",
          fontWeight: "600",
          py: 4,
        },
        closeButton: {
          color: "white",
          top: "14px",
          right: "14px",
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        textTransform: "none",
        fontWeight: "600",
      },
    },
  },
});

export default theme;
