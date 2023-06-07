const colors = {
  background: "#000",
  fileEntry: {
    background: "var(--F_Background)",
    backgroundFocused: "var(--F_Surface)",
    backgroundFocusedHover: "var(--F_Surface_1)",
    border: "none",
    borderFocused: "hsla(207, 60%, 72%, 35%)",
    borderFocusedHover: "hsla(207, 90%, 72%, 40%)",
    text: "#FFF",
    textShadow: `none`,
  },
  highlight: "var(--F_Surface_1)",
  highlightBackground: "var(--F_Primary)",
  progress: "hsla(113, 78%, 56%, 90%)",
  progressBackground: "hsla(104, 22%, 45%, 70%)",
  startButton: "#FFF",
  taskbar: {
    active: "var(--F_Surface)",
    activeForeground: "hsla(0, 0%, 40%, 70%)",
    background: "var(--F_Background)",
    foreground: "hsla(0, 0%, 35%, 70%)",
    foregroundHover: "hsla(0, 0%, 45%, 70%)",
    foregroundProgress: "hsla(104, 22%, 45%, 30%)",
    hover: "hsla(0, 0%, 25%, 70%)",
    peekBorder: "hsla(0, 0%, 50%, 50%)",
  },
  text: "var(--F_Font_Color)",
  titleBar: {
    background: "rgb(0, 0, 0)",
    backgroundHover: "rgb(26, 26, 26)",
    backgroundInactive: "rgb(43, 43, 43)",
    buttonInactive: "rgb(128, 128, 128)",
    closeHover: "rgb(232, 17, 35)",
    text: "rgb(255, 255, 255)",
    textInactive: "rgb(170, 170, 170)",
  },
  window: {
    background: "var(--F_Background)",
    outline: "hsla(0, 0%, 25%, 75%)",
    outlineInactive: "hsla(0, 0%, 30%, 100%)",
    shadow: "0 0 12px 0 rgba(0, 0, 0, 50%)",
    shadowInactive: "0 0 8px 0 rgba(0, 0, 0, 50%)",
  },
};

export default colors;