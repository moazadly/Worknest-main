import {
  Alert,
  Button,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useAuthContext } from "../Store/AuthContext";
import { useUserContext } from "../Store/UserContext";
import { useNavigate } from "react-router-dom";
interface FormData {
  title: string;
}
export default function Workspace() {
  const { token } = useAuthContext();
  const { userData, setUserData, setUserWorkspace } = useUserContext();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Joi.ValidationErrorItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
  });
  let navigate = useNavigate();
  if (userData === null || userData === "loading") return <></>;

  const getData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validation = () => {
    const schema = Joi.object({
      title: Joi.string().required(),
    });

    return schema.validate(formData, { abortEarly: false });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = validation();
    if (error) {
      setErrors(error.details);
      return;
    } else {
      setErrors([]);
    }

    try {
      const res = await axios.post(
        "https://worknest-server-eight.vercel.app/api/workspace",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const currentWorkspace = res.data._id;
      const { username, email, avatar } = userData;
      setUserData({ username, email, avatar, currentWorkspace });
      setUserWorkspace(currentWorkspace);
      console.log("login userData", userData);
      setErrorMessage("");
      navigate("/");
    } catch (err: any) {
      console.log(err);
      setErrorMessage(err.response?.data.error || "An error occurred");
    }
  };
  return (
    <Grid2 container mt={3} mx={3}>
      <Grid2 sx={{ width: "100%", height: "80vh" }}>
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ height: "80%" }}
        >
          <form
            onSubmit={submitHandler}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Stack sx={{ width: "60%" }} alignItems={"center"}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {errors.length > 0 && (
                <Alert severity="error">
                  {errors.map((err) => (
                    <div key={err.message}>{err.message}</div>
                  ))}
                </Alert>
              )}
              <Stack
                flexDirection={"row"}
                flexWrap={"wrap"}
                justifyContent={"center"}
              >
                <Typography variant="h3">Create A </Typography>
                <Typography variant="h3" sx={{ color: "#3754DB", ml: 1 }}>
                  Workspace
                </Typography>
              </Stack>
              <TextField
                variant={"outlined"}
                label={"Workspace Title"}
                type="text"
                name="title"
                onChange={getData}
                sx={{ width: { xs: "100%", sm: "60%", md: "40%" }, mt: "40px" }}
              />
              <Button
                sx={{
                  width: "20%",
                  mt: "40px",
                  backgroundColor: "#3754DB",
                  color: "white",
                  py: "13px",
                  borderRadius: "9px",
                }}
                type="submit"
                variant="contained"
              >
                Next
              </Button>
            </Stack>
          </form>
        </Stack>
      </Grid2>
    </Grid2>
  );
}
