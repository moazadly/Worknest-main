import { Badge, Box, Grid2, Stack, Tab, Typography } from "@mui/material";
import React, { SyntheticEvent, useState } from "react";
import { useUserContext } from "../Store/UserContext";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import cover from "../../assets/kobu.jpeg";
import { useTasksContext } from "../Store/TasksContext";
import SimpleTaskCard from "../../components/SimpleTaskCard";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Outlet, useParams } from "react-router-dom";

export default function Overview() {
  const { userData } = useUserContext();
  const [value, setValue] = useState("1");
  const { tasksDueDate } = useTasksContext();
  const { id } = useParams();

  if (userData === null || userData === "loading") return <></>;

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  function Tasks() {
    return (
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            width: "100%",
          }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label="Tasks"
              className="Tab"
              value="1"
              icon={
                <Badge
                  badgeContent={
                    tasksDueDate !== "loading" && tasksDueDate?.length
                  }
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    paddingX: "10px",
                  }}
                  color={tasksDueDate !== "loading" ? "info" : "default"}
                />
              }
              iconPosition="end"
              sx={{
                paddingLeft: "2px",
                paddingRight: "20px",
                fontSize: 15,
                textTransform: "capitalize",
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ paddingX: 0, width: "100%" }}>
          <Grid2
            container
            display={"flex"}
            flexDirection={"row"}
            spacing={4}
            flexWrap={"wrap"}
          >
            {tasksDueDate?.length === 0 ? (
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{
                  width: "100%",
                  mt: 2,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                You have no tasks yet. Start adding tasks to organize your
                workflow!
              </Typography>
            ) : tasksDueDate !== "loading" ? (
              tasksDueDate?.map((task) => (
                <SimpleTaskCard
                  id={task._id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  duo={task.duo}
                  key={task._id}
                />
              ))
            ) : (
              <></>
            )}
          </Grid2>
        </TabPanel>
      </TabContext>
    );
  }

  if (!userData) return <p>Loading user data...</p>;
  return id ? (
    <Outlet />
  ) : (
    <Grid2 container mt={3} mx={3}>
      <Grid2 sx={{ width: "100%" }}>
        <Stack>
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <WavingHandIcon
              sx={{
                rotate: "290deg",
                color: "yellow",
                alignItems: "center",
                fontSize: "50px",
                mr: "10px",
              }}
            />
            <Stack>
              <Typography
                variant="h4"
                mb={1}
                fontWeight={"bold"}
                color="#101C56"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                Hi {userData.username}
              </Typography>
              <Typography variant="body1" color="#666666">
                Welcome to Worknest Task Management
              </Typography>
            </Stack>
          </Stack>
          <Stack
            sx={{
              backgroundImage: `url(${cover})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "burn",
              width: "100%",
              borderRadius: "20px",
              my: 3,
            }}
          >
            <Stack sx={{ width: "70%" }}>
              <Typography variant="body1" color="#FFFFFF" mt={5} ml={4}>
                Success is not final; failure is not fatal: It is the courage to
                continue that counts.
              </Typography>
              <Typography variant="body1" color="#FFFFFF" mt={1} mb={5} ml={4}>
                -Winston S. Churchill
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="h6" fontWeight={"bold"} color="#101C56" mt={1}>
            Tasks within 3 days
          </Typography>
          <Tasks></Tasks>
        </Stack>
      </Grid2>
    </Grid2>
  );
}
