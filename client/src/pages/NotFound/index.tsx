import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFound() {
  return (
    <>
      <Grid container spacing={2}>
        <Container maxWidth="lg">
          <Grid item xs={12}>
            <Stack spacing={2}></Stack>
          </Grid>
          <br />
          <br />
          <br />
          <br />
          <Grid item xs={12}>
            <Stack spacing={2}>
              <Typography
                variant="h1"
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  color: "#3754DB",
                }}
              >
                404
              </Typography>
            </Stack>
          </Grid>
          <br />
          <br />
          <Grid item xs={12}>
            <Stack spacing={2}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  mt: "80px",
                }}
              >
                Sorry, Page Not Found
              </Typography>
              <br />
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  mt: "80px",
                }}
              >
                The Page You Requested Could Not Be Found
              </Typography>
            </Stack>
          </Grid>
          <br />
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              component={RouterLink}
              to="/overview"
              variant="contained"
              sx={{ mt: "20px" }}
            >
              Overview
            </Button>
          </Grid>
        </Container>
      </Grid>
    </>
  );
}
