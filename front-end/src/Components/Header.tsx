import React, { useCallback, useState } from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { MenuItem } from "@mui/material";

import Menu from "@mui/material/Menu";
import "./Styles/style.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth-context";
import { IoPowerSharp } from "react-icons/io5";

const AmeerTheme = createTheme({
  palette: {
    primary: {
      main: "#880e4f",
    },
  },
});
const settings = ["Logout"];

export interface HeaderProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header() {
  const { logout, auth } = useAuth();

  // The material UI
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = React.useCallback((e: any) => {
    setAnchorElUser(e.currentTarget);
  }, []);

  const handleUserMenuClick = useCallback(() => {
    setAnchorElUser(null);
  }, []);
  const navigate = useNavigate();
  const travelTo = (dest: string) => {
    navigate("/" + dest);
  };

  return (
    <div className="header">
      <ThemeProvider theme={AmeerTheme}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  mr: 2,
                  cursor: "pointer",
                }}
              >
                <h2>
                  <span>Shopping</span>{" "}
                  <span>
                    <IoPowerSharp />
                    nline
                  </span>
                </h2>{" "}
              </Typography>

              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              ></Typography>

              <Box
                sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
              ></Box>
              <Box sx={{ flexGrow: 0 }}>
                {auth.isLoggedIn ? `Hello ${auth.user.firstName}` : null}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                    <Avatar alt="Uemy Sharp" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleUserMenuClick}
                >
                  {auth.isLoggedIn ? (
                    settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => {
                          handleUserMenuClick();
                          if (setting === "Logout") {
                            logout();
                          } else {
                            travelTo(setting);
                          }
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))
                  ) : (
                    <div>
                      <MenuItem onClick={handleUserMenuClick}>
                        <Typography onClick={() => navigate("/login")}>
                          Login
                        </Typography>
                      </MenuItem>

                      {
                        <MenuItem onClick={handleUserMenuClick}>
                          <Typography onClick={() => navigate("/signup")}>
                            Signup
                          </Typography>
                        </MenuItem>
                      }
                    </div>
                  )}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </div>
  );
}
