import Avatar from "@mui/material/Avatar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import React from "react";
import { Button, Container, Grid2, Stack, Typography } from "@mui/material";
import avatar from "../../assets/1.png";
import { useTasksContext } from "../../pages/Store/TasksContext";
import { useUserContext } from "../../pages/Store/UserContext";

export default function RightSidebar() {
  const { userData } = useUserContext();
  const { setDate, date } = useTasksContext();
  if (userData === null || userData === "loading") return <></>;
  return (
    <Grid2
      size={{ sm: 3, md: 2 }}
      offset={0.8}
      my={2}
      pb={2}
      sx={{
        background: "#FFFFFF",
        display: { xs: "none", md: "flex" },
        borderRadius: "24px",
      }}
    >
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Stack sx={{ alignItems: "center", width: "100%" }} mt={12}>
          <Avatar
            alt={userData?.username}
            src={userData?.avatar || avatar}
            sx={{
              borderRadius: "10px",
              width: "90px",
              marginBottom: "9px",
              height: "90px",
            }}
          />
          <Typography
            variant="h6"
            color="#101C56"
            sx={{
              wordBreak: "break-word",
              whiteSpace: "normal",
              overflowWrap: "break-word",
            }}
          >
            {userData?.username}
          </Typography>
          <Typography
            variant="body2"
            color="#666666"
            sx={{
              wordBreak: "break-word",
              whiteSpace: "normal",
              overflowWrap: "break-word",
              marginBottom: 5,
            }}
          >
            {userData?.email}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              sx={{ background: "#F6F8FD", width: "100%" }}
              onChange={(value) => {
                setDate(value);
              }}
              value={date}
            />
          </LocalizationProvider>
        </Stack>
      </Container>
    </Grid2>
  );
}
