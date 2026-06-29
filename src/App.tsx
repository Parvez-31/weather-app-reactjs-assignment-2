

import { ThemeProvider } from "@emotion/react";
import WeatherApp from "./components/WeatherApp";
import theme from "./theme/theme";
import { CssBaseline } from "@mui/material";



const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <WeatherApp />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default App;
