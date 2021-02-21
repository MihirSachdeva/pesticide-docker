const themes = {
  solarizedDark: {
    type: "dark",
    primary: { main: "#002b36", contrastText: "#eee8d5" },
    secondary: { main: "#eee8d5", contrastText: "#0e2a35" },
    background: { default: "#09232c", paper: "#002b36" },
  },
  solarizedLight: {
    type: "light",
    primary: { main: "#fff7dd", contrastText: "#002b36" },
    secondary: { main: "#002b36", contrastText: "#eee8d5" },
    background: { default: "#eee8d5", paper: "#fff7dd" },
  },
  palpatine: {
    type: "dark",
    primary: { main: "#1a1a1a", contrastText: "#ffffff" },
    secondary: { main: "#e04035", contrastText: "#ffffff" },
    background: { default: "#101010", paper: "#1b1b1b" },
  },
  default: {
    type: "light",
    primary: { main: "#ffffff", contrastText: "#000000" },
    secondary: { main: "#356fff", contrastText: "#ffffff" },
    background: { default: "#f0f2f5", paper: "#ffffff" },
  },
  dark: {
    type: "dark",
    primary: { main: "#282828", contrastText: "#ffffff" },
    secondary: { main: "#356fff", contrastText: "#ffffff" },
    background: { default: "#18191a", paper: "#242526" },
  },
  dracula: {
    type: "dark",
    primary: { main: "#44475a", contrastText: "#bd93f9" },
    secondary: { main: "#bd93f9", contrastText: "#f8f8f2" },
    background: { default: "#20222c", paper: "#282a36" },
  },
};

export default themes;
