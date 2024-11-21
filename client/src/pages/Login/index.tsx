import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, Link as RouterLink, Link } from "react-router-dom";
import { useState } from "react";
import Joi from "joi";
import axios from "axios";
import { useAuthContext } from "../Store/AuthContext";
import { useUserContext } from "../Store/UserContext";

interface FormData {
  email: string;
  password: string;
}

export function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const { setToken } = useAuthContext();
  const { setUserData } = useUserContext();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Joi.ValidationErrorItem[]>([]);
  let navigate = useNavigate();

  const getData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validation = () => {
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string().required(),
    });

    return schema.validate(formData, { abortEarly: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        "https://worknest-server-eight.vercel.app/api/auth/login",
        formData
      );
      localStorage.setItem("Token", res.data.token);
      setToken(res.data.token);
      const { username, email, avatar, currentWorkspace } = res.data;
      setUserData({ username, email, avatar, currentWorkspace });
      setErrorMessage("");
      if (currentWorkspace) navigate("/");
      else navigate("/createworkspace");
    } catch (err: any) {
      console.log(err);
      setErrorMessage(err.response?.data.error || "An error occurred");
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Container maxWidth="lg">
          <Grid item xs={12}>
            <Typography variant={"h2"} sx={{ textAlign: "center", mt: "70px" }}>
              Welcome Back.
            </Typography>
          </Grid>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {errors.length > 0 && (
            <Alert severity="error">
              {errors.map((err) => (
                <div key={err.message}>{err.message}</div>
              ))}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                variant={"outlined"}
                label={"Email Address"}
                type="email"
                name="email"
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
                variant={"outlined"}
                label={"Enter A Password"}
                type="password"
                name="password"
                onChange={getData}
                sx={{ width: "60%", mt: "40px" }}
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
              Don't have an account?
              <Link to="/signup" style={{ marginLeft: "12px" }}>
                signup
              </Link>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                sx={{
                  width: "60%",
                  mt: "25px",
                  backgroundColor: "#3754DB",
                  color: "white",
                  py: "13px",
                  borderRadius: "9px",
                }}
                type="submit"
                variant="contained"
              >
                Log In
              </Button>
            </Grid>
          </form>
        </Container>
      </Grid>
    </>
  );
}
