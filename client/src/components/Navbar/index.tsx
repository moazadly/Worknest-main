import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useTasksContext } from "../../pages/Store/TasksContext";
import { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  backgroundColor: "transparent",
  border: "1px solid #A8ABBD",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "30ch",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  color: "black",
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  right: 0,
}));

interface Task {
  // Task: {
  _id: string;
  title: string;
  description: string;
  status: string;
  created: number;
  duo: Dayjs | null;
  // };
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { tasks } = useTasksContext();
  const navigate = useNavigate();

  function NotificationRing() {
    const { tasksDueDate } = useTasksContext();
    return (
      <Box sx={{ display: { md: "flex" } }}>
        <IconButton
          size="large"
          aria-label={`show ${tasksDueDate?.length} new notifications`}
          color="inherit"
        >
          <Badge
            badgeContent={tasksDueDate !== "loading" && tasksDueDate?.length}
            color={tasksDueDate !== "loading" ? "error" : "default"}
          >
            <NotificationsIcon
              sx={{
                color: "#3754DB",
              }}
            />
          </Badge>
        </IconButton>
      </Box>
    );
  }

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await sleep(1e3); // For demo purposes.
      setLoading(false);
      if (tasks !== "loading" && tasks !== null) {
        setOptions([...tasks]);
      }
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ boxShadow: "none", background: "transparent" }}
      >
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
              open={open}
              onOpen={handleOpen}
              onClose={handleClose}
              isOptionEqualToValue={(option, value) =>
                option.title === value.title
              }
              getOptionLabel={(option) => option.title}
              options={options}
              loading={loading}
              popupIcon={null}
              onChange={(event, value) => {
                navigate(`/${value?._id}`);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Task"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <NotificationRing />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
