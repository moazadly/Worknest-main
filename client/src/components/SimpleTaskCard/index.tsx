import React from "react";
import { Card, CardContent, Typography, Chip, Grid2 } from "@mui/material";
import { Dayjs } from "dayjs";
import { Link } from "react-router-dom";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  duo: Dayjs | null;
}

export default function TaskCard({
  id,
  title,
  description,
  status,
  duo,
}: TaskCardProps) {
  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
      <Card
        sx={{
          maxWidth: 400,
          mx: "auto",
          p: 2,
          position: "relative",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>

          <Chip
            label={status}
            color={
              status === "completed"
                ? "success"
                : status === "pending"
                ? "default"
                : "primary"
            }
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Link
            to={`${id}`}
            style={{
              textDecoration: "none",
              color: "#3754DB",
              display: "flex",
              fontWeight: "bolder",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            View Task{" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: 4, marginTop: 1 }}
            >
              <path
                d="M9.03046 10.3006L9.02919 10.0055C9.02919 8.77914 9.10101 7.6611 9.20919 6.93226L9.30396 6.47903C9.35669 6.23898 9.42601 5.96567 9.49828 5.82614C9.76282 5.31577 10.2801 5 10.8337 5H10.8819C11.2428 5.01193 12.001 5.32862 12.001 5.33964C13.221 5.85153 15.5746 7.39643 16.6617 8.49782L16.9776 8.82849C17.0603 8.91811 17.1532 9.02417 17.2109 9.10685C17.4036 9.36203 17.5 9.6778 17.5 9.99357C17.5 10.3461 17.3918 10.6738 17.1873 10.9418L16.8627 11.2921L16.79 11.3668C15.8037 12.4362 13.2282 14.1849 11.881 14.72L11.6776 14.798C11.4328 14.8857 11.0899 14.9904 10.8819 15C10.6174 15 10.3646 14.9385 10.1237 14.8173C9.82282 14.6475 9.58282 14.3795 9.4501 14.0637C9.36555 13.8452 9.23283 13.1889 9.23283 13.177C9.11115 12.5152 9.0406 11.471 9.03046 10.3006ZM2.5 9.99963C2.5 9.30108 3.0609 8.73472 3.75271 8.73472L6.8354 9.00734C7.37812 9.00734 7.81812 9.45162 7.81812 9.99963C7.81812 10.5486 7.37812 10.9919 6.8354 10.9919L3.75271 11.2645C3.0609 11.2645 2.5 10.6982 2.5 9.99963Z"
                fill="#6684FF"
              />
            </svg>
          </Link>
        </CardContent>
      </Card>
    </Grid2>
  );
}
