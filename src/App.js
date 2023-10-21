
import { Box, Container, ThemeProvider, createTheme, Typography, Link } from "@mui/material";
import { createContext, useContext, useRef, useState } from "react";
import Header from "./views/Header";
import Home from "./views/home/home";

const ViewContext = createContext(null);
export const useViewContext = () => useContext(ViewContext);

function App() {
  const theme = createTheme({});
  const [view, setView] = useState('home');
  const data = useRef({
    numbers: []
  });

  return (
    <ThemeProvider theme={theme}>
      <ViewContext.Provider value={[{view, data}, {setView}]}>
        <Box
          display="flex"
          height="100vh"
          width="100vw"
          flex={1}
          overflow="auto"
          flexDirection="column"
          component={Container}
          bgcolor="white"
        >
          <Header/>
          <Box
            component="main"
            display="flex"
            flex={1}
          >
            {view === 'home' && <Home/> }
          </Box>
          <Typography 
            variant="caption"
            align="center"
            my={2}
            mt={5}
          >Merci de prendre votre temps!, <Link component="a" href="mailto:phalphie1@gmail.com">Contactez nous</Link>, &copy;2023</Typography>
        </Box>
      </ViewContext.Provider>
    </ThemeProvider>
  );
}

export default App;
