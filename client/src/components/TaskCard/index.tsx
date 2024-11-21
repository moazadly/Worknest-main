import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Grid2,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import UpdateModal from "./../UpdateModal/index";
import { Dayjs } from "dayjs";
import Swal from "sweetalert2";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  duo: Dayjs | null;
  isDetailed: boolean;
  onStatusChange: (newStatus: string) => void;
  onDelete: () => void;
  onUpdate: (updatedTask: {
    title: string;
    status: string;
    description: string;
    duo: Dayjs | null;
  }) => void; // Prop for updating
}

export default function TaskCard({
  id,
  title,
  description,
  status,
  duo,
  onStatusChange,
  onDelete,
  onUpdate,
  isDetailed,
}: TaskCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleMarkAsDone = () => {
    onStatusChange("completed");
  };
  const handleDelete = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-success me-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          onDelete();
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your task is safe",
            icon: "error",
          });
        }
      });
  };

  return (
    <Grid2 size={!isDetailed ? { xs: 12, sm: 12, lg: 6 } : 12}>
      <Card
        sx={{
          // maxWidth: 400,
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

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            {status !== "completed" && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                sx={{ textTransform: "none" }}
                onClick={handleMarkAsDone}
              >
                Mark As Done
              </Button>
            )}
            <div style={{ display: "flex" }}>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="edit"
                color="primary"
                onClick={() => setModalOpen(true)}
              >
                <EditIcon />
              </IconButton>
              <UpdateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                task={{ id, title, status, description, duo }}
                onUpdate={(updatedTask) => {
                  onUpdate(updatedTask);
                  setModalOpen(false);
                }}
              />
            </div>
          </Box>
        </CardContent>
      </Card>
    </Grid2>
  );
}
