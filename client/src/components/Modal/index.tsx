import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import Joi from "joi";
import { useTasksContext } from "../../pages/Store/TasksContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Modal() {
  const [open, setOpen] = useState<boolean>(false);

  const [formValues, setFormValues] = useState<{
    title: string;
    status: string;
    description: string;
    duo: Dayjs | null;
  }>({
    title: "",
    status: "",
    description: "",
    duo: null,
  });

  const { addTask } = useTasksContext();

  const [errors, setErrors] = useState<{
    title: string;
    status: string;
    description: string;
    duo: string;
  }>({
    title: "",
    status: "",
    description: "",
    duo: "",
  });

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const validateForm = () => {
    const schema = Joi.object({
      title: Joi.string()
        .min(5)
        .regex(/^[a-zA-Z].*/)
        .required()
        .messages({
          "string.base": "Title must be a string",
          "string.empty": "Title is required",
          "string.min": "Title must be at least 5 characters long",
          "string.pattern.base": "Title must start with a letter",
        }),
      status: Joi.string()
        .valid("in progress", "pending", "completed")
        .required()
        .messages({
          "any.required": "Status is required",
        }),
      description: Joi.string()
        .min(5)
        .regex(/^[a-zA-Z].*/)
        .required()
        .messages({
          "string.base": "Description must be a string",
          "string.empty": "Description is required",
          "string.min": "Description must be at least 5 characters long",
          "string.pattern.base": "Description must start with a letter",
        }),
      duo: Joi.any().required(),
    });

    const { error } = schema.validate(formValues, { abortEarly: false });

    const newErrors: {
      title: string;
      status: string;
      description: string;
      duo: string;
    } = {
      title: "",
      status: "",
      description: "",
      duo: "",
    };

    if (error) {
      error.details.forEach((detail) => {
        const key = detail.path[0] as keyof typeof newErrors;
        newErrors[key] = detail.message;
      });
    }

    setErrors(newErrors);
    return !error;
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setFormValues({
      ...formValues,
      duo: newDate,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormValues({
      ...formValues,
      status: event.target.value,
    });
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      const newTask = {
        title: formValues.title,
        status: formValues.status,
        description: formValues.description,
        duo: formValues.duo,
      };

      addTask(newTask);

      setFormValues({ title: "", status: "", description: "", duo: null });
      setErrors({ title: "", status: "", description: "", duo: "" });
      closeModal();
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={openModal}>
        Create Task
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth>
        <DialogTitle>Create A Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your task details here
          </DialogContentText>
          <FormControl fullWidth margin="dense" variant="outlined">
            <Stack spacing={2} margin={2}>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                name="title"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.title}
                onChange={handleTextFieldChange}
                error={!!errors.title}
              />
              {errors.title && (
                <span style={{ color: "red" }}>{errors.title}</span>
              )}

              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formValues.status}
                  onChange={handleSelectChange}
                  label="Status"
                  error={!!errors.status}
                >
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              {errors.status && (
                <span style={{ color: "red" }}>{errors.status}</span>
              )}

              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.description}
                onChange={handleTextFieldChange}
                error={!!errors.description}
              />
              {errors.description && (
                <span style={{ color: "red" }}>{errors.description}</span>
              )}

              <FormControl fullWidth margin="dense" variant="outlined">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Duo"
                    name="Duo"
                    onChange={handleDateChange}
                    value={formValues.duo}
                  />
                </LocalizationProvider>
              </FormControl>
              {errors.duo && <span style={{ color: "red" }}>{errors.duo}</span>}
            </Stack>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeModal} color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="info">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
