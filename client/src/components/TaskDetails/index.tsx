import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskCard from "../TaskCard";
import { useTasksContext } from "../../pages/Store/TasksContext";
import Loading from "../../pages/Loading";
import { Grid } from "@mui/material";

export default function TaskDetails() {
  const { id } = useParams();
  const [taskId] = useState(id);
  const { tasks, updateTask, deleteTask } = useTasksContext();
  const navigate = useNavigate();
  if (tasks === "loading" || tasks === null) return <Loading />;
  if (!taskId || taskId === undefined) navigate("/");
  let [task] = tasks.filter((task) => task._id === taskId);

  const handleStatusChange = (id: string, value: string) => {
    updateTask(id, { status: value });
  };

  const handleUpdate = (id: string, updatedTask: object) => {
    updateTask(id, updatedTask);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    navigate("/");
  };

  return (
    <Grid mt={3} mx={{ md: 3 }} p={{ xs: 3 }}>
      <Grid sx={{ width: "100%" }}>
        <TaskCard
          id={task?._id}
          title={task?.title}
          description={task?.description}
          status={task?.status}
          duo={task?.duo}
          onStatusChange={(newStatus) =>
            handleStatusChange(task?._id, newStatus)
          }
          onDelete={() => handleDelete(task._id)}
          onUpdate={(updatedTask) => handleUpdate(task?._id, updatedTask)}
          key={task._id}
          isDetailed={true}
        />
      </Grid>
    </Grid>
  );
}
