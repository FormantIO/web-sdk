import * as React from "react";
import Button from "@mui/material/Button";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {
  AppBar,
  Box,
  Card,
  Container,
  createTheme,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { createRoot } from "react-dom/client";
import { defaultTheme } from "../../../packages/formant-theme-material-ui/src/main";
import MenuIcon from "@mui/icons-material/Menu";
import formantLogo from "./formant.svg";

const theme = createTheme(defaultTheme);

function App() {
  return (
    <div>
      <AppBar
        position="static"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar variant="regular">
          <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{
              height: 30,
            }}
            alt="The house from the offer."
            src={formantLogo}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 4 }}>
        <Container maxWidth="sm">
          <Stack direction="row" spacing={2}>
            <Button variant="text">Text</Button>
            <Button variant="contained">Contained</Button>
            <Button variant="contained" color="secondary">
              Contained
            </Button>
            <Button variant="contained" color="error">
              Contained
            </Button>
            <Button variant="outlined">Outlined</Button>
          </Stack>
          <Grid sx={{ pt: 4, pb: 4 }}>
            <Card sx={{ borderRadius: 0.5 }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1">
                  Something important goes here
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                  />
                  <TextField
                    id="filled-basic"
                    label="Filled"
                    variant="filled"
                    sx={{ borderRadius: 0.1 }}
                  />
                  <TextField
                    id="standard-basic"
                    label="Standard"
                    variant="standard"
                    sx={{ borderRadius: 0.1 }}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}