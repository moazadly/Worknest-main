import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import Joi from "joi"; // Use the regular Joi library
import { Alert } from "@mui/material";
import { useAuthContext } from "../Store/AuthContext";
import { useUserContext } from "../Store/UserContext";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState<string>("");

  const getData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let navigate = useNavigate();

  function validation() {
    const schema = Joi.object({
      username: Joi.string().trim().min(3).max(200).required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .min(5)
        .max(200)
        .required(),
      password: Joi.string().trim().min(5).max(200).required(),
    });
    return schema.validate(formData, { abortEarly: false });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = validation();
    if (error) {
      setErrMsg(error.details.map((err) => err.message).join(", "));
      return;
    }
    axios
      .post(
        "https://worknest-server-eight.vercel.app/api/auth/register",
        formData
      )
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.response.data.error);
      });
  }

  return (
    <>
      <Grid container spacing={2}>
        <Container maxWidth="lg">
          <Grid item xs={12}>
            {/* <Button
              sx={{
                mt: "40px",
                px: "40px",
                borderWidth: "3px",
                borderRadius: "7px",
                backgroundColor: "#3754DB",
                color: "white",
              }}
              component={RouterLink}
              to="/login"
              variant="contained"
            >
              Log In
            </Button> */}
          </Grid>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Typography variant={"h2"} sx={{ textAlign: "center" }}>
              Create an Account
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {errMsg && (
              <Alert severity="error" sx={{ width: "60%", mt: "40px" }}>
                {errMsg}
              </Alert>
            )}
          </Grid>
          <form onSubmit={handleSubmit}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                name="username"
                variant={"outlined"}
                label={"User Name"}
                type="text"
                onChange={getData}
                sx={{ width: "60%", mt: "40px" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                name="email"
                variant={"outlined"}
                label={"Email Address"}
                type="email"
                onChange={getData}
                sx={{ width: "60%", mt: "40px" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                name="password"
                variant={"outlined"}
                label={"Enter A Password"}
                type="password"
                onChange={getData}
                sx={{ width: "60%", mt: "40px", color: "#3754DB" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              Already have an account?
              <Link to="/login" style={{ marginLeft: "12px" }}>
                Log in
              </Link>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "60%",
                  mt: "25px",
                  backgroundColor: "#3754DB",
                  color: "white",
                  py: "13px",
                  borderRadius: "9px",
                }}
                type="submit"
              >
                Create an Account
              </Button>
            </Grid>
          </form>
        </Container>
      </Grid>
    </>
  );
}
