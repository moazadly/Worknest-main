import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTasksContext } from "../../pages/Store/TasksContext";
import { useUserContext } from "../../pages/Store/UserContext";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
export default function LeftSidebar() {
  const [open, setOpen] = React.useState(false);
  const { workspaces, workspace, date, setDate } = useTasksContext();
  const { updateUser, userData } = useUserContext();
  const navigate = useNavigate();

  if (userData === null || userData === "loading") return <></>;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  function removeEmptyProperties(obj: any) {
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // Adjust conditions as needed
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List sx={{ my: 6 }}>
        {[
          {
            text: "Overview",
            icon: (
              <GridViewOutlinedIcon
                sx={{ color: "#3754DB", fontSize: "40px" }}
              />
            ),
          },
          {
            text: "Tasks",
            icon: (
              <TextSnippetIcon sx={{ color: "#3754DB" }} fontSize="large" />
            ),
          },
          {
            text: "Settings",
            icon: (
              <SettingsOutlinedIcon
                sx={{ color: "#3754DB" }}
                fontSize="large"
              />
            ),
          },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <Link
                to={item.text.toLowerCase()}
                style={{
                  textDecoration: "none",
                  color: "#3754DB",
                  display: "flex",
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ my: 2 }}>
        {workspaces !== "loading" ? (
          workspaces?.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton>
                <Link
                  to={"/"}
                  onClick={() => {
                    updateUser(
                      removeEmptyProperties({ currentWorkspace: `${item._id}` })
                    );
                  }}
                  style={{
                    textDecoration: "none",
                    color: "#3754DB",
                    display: "flex",
                  }}
                >
                  <ListItemIcon>
                    <WorkspacesIcon
                      sx={{ color: "#3754DB" }}
                      fontSize="large"
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </Link>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <></>
        )}
        <ListItem disablePadding>
          <ListItemButton>
            <Link
              to={"/createworkspace"}
              style={{
                textDecoration: "none",
                color: "#3754DB",
                display: "flex",
              }}
            >
              <ListItemIcon>
                <AddBoxIcon sx={{ color: "#3754DB" }} fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={"Create Workspace"} />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{ background: "#F6F8FD", width: "100%" }}
          onChange={(value) => {
            setDate(value);
          }}
          value={date}
        />
      </LocalizationProvider>
    </Box>
  );
  return (
    <>
      <Grid2
        size={{ md: 0.4 }}
        position={"fixed"}
        top={0}
        bottom={0}
        left={0}
        sx={{
          background: "#3754DB",
          zIndex: 4,
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            display: { xs: "none", md: "flex" },
          }}
          mt={10}
        >
          {workspaces !== "loading" ? (
            workspaces?.map((workspace) => (
              <IconButton
                title={`${workspace.title}`}
                key={workspace._id}
                onClick={() => {
                  navigate("/");
                  updateUser(
                    removeEmptyProperties({ currentWorkspace: workspace._id })
                  );
                }}
              >
                <WorkspacesIcon
                  style={{
                    color:
                      workspace._id === userData.currentWorkspace
                        ? "#ffffff"
                        : "#000000",
                  }}
                />
              </IconButton>
            ))
          ) : (
            <></>
          )}

          <IconButton
            title={`Create Workspace`}
            onClick={() => {
              navigate("/createworkspace");
            }}
          >
            <AddBoxIcon
              style={{
                color: "#ffffff",
              }}
            />
          </IconButton>
        </Stack>
      </Grid2>
      <Grid2
        size={{ xs: 1.1, md: 2 }}
        offset={{ md: 0.4 }}
        position={"fixed"}
        top={0}
        bottom={0}
        left={{ xs: 0 }}
        sx={{
          background: "#FFFFFF",
          zIndex: 3,
        }}
      >
        <Container sx={{ display: { xs: "none", md: "block" } }}>
          <Box mb={5} mt={10}>
            <Typography
              variant="h5"
              sx={{ color: "#101C56", fontWeight: "600" }}
            >
              My Space
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#666666" }}>
              {workspace
                ? workspace !== "loading"
                  ? workspace?.title
                  : "Loading...."
                : ""}
            </Typography>
          </Box>
          <Stack sx={{ width: "fit-content", alignItems: "start" }}>
            <Button
              variant="text"
              startIcon={
                <GridViewOutlinedIcon
                  sx={{ color: "#3754DB", fontSize: "40px" }}
                />
              }
              sx={{
                color: "#666666",
                fontSize: "1.2rem",
                textTransform: "capitalize",
              }}
            >
              <Link
                to={"overview"}
                style={{ textDecoration: "none", color: "#3754DB" }}
              >
                Overview
              </Link>
            </Button>
            <Button
              variant="text"
              startIcon={
                <TextSnippetIcon sx={{ color: "#3754DB", fontSize: "40px" }} />
              }
              sx={{
                color: "#666666",
                fontSize: "1.2rem",
                textTransform: "capitalize",
              }}
            >
              <Link
                to={"tasks"}
                style={{ textDecoration: "none", color: "#3754DB" }}
              >
                Tasks
              </Link>
            </Button>
            <Button
              variant="text"
              startIcon={
                <SettingsOutlinedIcon
                  sx={{ color: "#3754DB", fontSize: "40px" }}
                />
              }
              sx={{
                color: "#666666",
                fontSize: "1.2rem",
                textTransform: "capitalize",
              }}
            >
              <Link
                to={"settings"}
                style={{ textDecoration: "none", color: "#3754DB" }}
              >
                Settings
              </Link>
            </Button>
          </Stack>
        </Container>
        <Container sx={{ display: { xs: "block", md: "none" }, padding: "0" }}>
          <Stack mt={4.5}>
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </Stack>
        </Container>
      </Grid2>
    </>
  );
}
