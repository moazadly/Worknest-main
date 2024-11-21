import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Switch,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { useUserContext } from "../Store/UserContext";
import { useAuthContext } from "../Store/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Settings() {
  const [open, setOpen] = useState(false);
  const { userData, updateUser, setUserData } = useUserContext();
  const { logout } = useAuthContext();
  const [formData, setFormData] = useState({
    username: userData !== "loading" ? userData?.username : "username",
    email: userData !== "loading" ? userData?.email : "username@gmail.com",
    password: "",
    currentWorkspace: "",
  });
  const navigate = useNavigate();
  if (userData === null || userData === "loading") return <></>;

  function removeEmptyProperties(obj: any) {
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // Adjust conditions as needed
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  // Handle input changes for all fields
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the field by its name
    });
  };

  // Handle form submission (e.g., save button click)
  const handleSave = () => {
    updateUser(removeEmptyProperties(formData));
    // Here you can send the formData object to your API or handle it as needed
    handleClose(); // Close the modal after submission
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, stay logged in",
      customClass: {
        confirmButton: "btn btn-danger me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false, // Use custom Bootstrap styles
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout logic here
        logout();
        setUserData(null);
        console.log("User logged out"); // Replace with actual logout functionality
      }
      // Do nothing if the user cancels
    });
  };
  return (
    <>
      <Stack>
        <Typography sx={{ fontWeight: "bold", mt: 3, ml: 3 }} variant="h5">
          Settings
        </Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{
            backgroundColor: "#B80020",
            borderRadius: 3,
            alignSelf: "flex-end",
            px: 3,
            py: 1,
          }}
          onClick={handleLogout}
        >
          Log Out
        </Button>

        <Container style={{ marginBottom: 40 }}>
          <Typography variant="h6">Account Settings</Typography>
          <Grid
            container
            spacing={2}
            sx={{
              borderRadius: 5,
              mt: 2,
              backgroundColor: "white",
              py: 5,
            }}
          >
            <Grid item xs={11} sx={{ mx: "auto" }}>
              <Box
                sx={{
                  border: "solid 0.1px #b8b8b8",
                  borderRadius: 3,
                  px: 5,
                  py: 2,
                  display: "flex",
                }}
              >
                <PersonIcon sx={{ fontSize: 50, mr: 3, color: "#3754DB" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px" }} variant="h6">
                    Fullname
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "19px",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}
                  >
                    {userData?.username}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={11} sx={{ mx: "auto" }}>
              <Box
                sx={{
                  border: "solid 0.2px #b8b8b8",
                  borderRadius: 3,
                  px: 5,
                  py: 2,
                  display: "flex",
                }}
              >
                <EmailIcon sx={{ fontSize: 50, mr: 3, color: "#3754DB" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontSize: "12px" }}>
                    Email Address
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "19px",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}
                  >
                    {userData?.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={11} sx={{ mx: "auto" }}>
              <Box
                sx={{
                  border: "solid 0.2px #b8b8b8",
                  borderRadius: 3,
                  px: 5,
                  py: 2,
                  display: "flex",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "12px" }} variant="h6">
                    Password
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "19px" }}>
                    {"*".repeat(8)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Stack sx={{ ml: "auto" }}>
              <Button
                onClick={handleOpen}
                variant="contained"
                size="medium"
                sx={{
                  backgroundColor: "#3754DB",
                  borderRadius: 3,
                  alignSelf: "flex-end",
                  px: 4,
                  py: 1.5,
                  mr: 4.85,
                  mt: 4,
                }}
              >
                Edit
              </Button>
            </Stack>
          </Grid>
        </Container>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="edit-user-modal"
          aria-describedby="edit-user-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              py: 7,
              px: 4,
            }}
          >
            <Typography id="edit-user-modal" variant="h6" component="h2">
              Edit User Information
            </Typography>

            <TextField
              label="Fullname"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              sx={{ mt: 3 }}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ mt: 3 }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              sx={{ mt: 3 }}
            />

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "#3754DB", color: "#fff" }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{ backgroundColor: "#3754DB", color: "#fff" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Stack>
    </>
  );
}
