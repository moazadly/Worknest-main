import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";
import axios from "axios";
import { useUserContext } from "./UserContext";
import dayjs, { Dayjs } from "dayjs";

interface Task {
  // Task: {
  _id: string;
  title: string;
  description: string;
  status: string;
  created: number;
  duo: Dayjs | null;
  // };
}

interface Workspace {
  _id: string;
  title: string;
  image: string;
}

interface TaskState {
  tasks: Task[] | "loading" | null;
  tasksDueDate: Task[] | "loading" | null;
  workspace: Workspace | "loading" | null;
  workspaces: Workspace[] | "loading" | null;
  date: Dayjs | null;
  setTasks: (tasks: Task[]) => void;
  setWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspace: Workspace[]) => void;
  setDate: (date: Dayjs) => void;
  addTask: (task: Omit<Task, "_id" | "created">) => Promise<void>; // Create
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>; // Update
  deleteTask: (id: string) => Promise<void>; // Delete
}

export let tasksContext = createContext<TaskState | undefined>(undefined);

export const useTasksContext = () => {
  const context = useContext(tasksContext);
  if (!context) {
    throw new Error(
      "useTasksContext must be used within an UserContextProvider"
    );
  }
  return context;
};

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksContextProvider: React.FC<TasksProviderProps> = ({
  children,
}) => {
  const { token } = useAuthContext();
  const { userWorkspace } = useUserContext();
  const [tasks, setTasks] = useState<Task[] | "loading" | null>(
    token ? "loading" : null
  );
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [tasksDueDate, setTasksDueDate] = useState<Task[] | "loading" | null>(
    token ? "loading" : null
  );
  const [workspace, setWorkspace] = useState<Workspace | "loading" | null>(
    token ? "loading" : null
  );
  const [workspaces, setWorkspaces] = useState<Workspace[] | "loading" | null>(
    token ? "loading" : null
  );

  useEffect(() => {
    const fetchTasks = async () => {
      setTasks("loading");
      try {
        const response = await axios.get(
          `https://worknest-server-eight.vercel.app/api/workspace/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const tasksData = response.data;
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks(null);
      }
    };

    const fetchWorkspace = async () => {
      setWorkspace("loading");
      try {
        const response = await axios.get(
          `https://worknest-server-eight.vercel.app/api/workspace`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const workspace = response.data;
        setWorkspace(workspace);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setWorkspace(null);
      }
    };

    const fetchWorkspaces = async () => {
      setWorkspaces("loading");
      try {
        const response = await axios.get(
          `https://worknest-server-eight.vercel.app/api/user/workspaces`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const workspaces = response.data;
        setWorkspaces(workspaces);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setWorkspace(null);
      }
    };
    console.log(userWorkspace);
    if (token && userWorkspace) {
      fetchWorkspaces().then(fetchWorkspace).then(fetchTasks);
    }
  }, [token, userWorkspace]);

  useEffect(() => {
    const nearDuoDate = (tasks: Task[]) => {
      const today = dayjs(date);
      const threeDaysFromNow = today.add(3, "day");

      return tasks.filter((task) => {
        const taskDueDate = dayjs(task.duo);
        return (
          (taskDueDate.isSame(today) || taskDueDate.isAfter(today)) &&
          taskDueDate.isBefore(threeDaysFromNow) &&
          task.status !== "completed"
        );
      });
    };
    if (tasks !== "loading" && tasks !== null) {
      setTasksDueDate(nearDuoDate(tasks));
    }
  }, [date, tasks]);

  const addTask = async (newTask: Omit<Task, "_id" | "created">) => {
    try {
      const response = await axios.post(
        `https://worknest-server-eight.vercel.app/api/task`,
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks && prevTasks !== "loading"
          ? [...prevTasks, response.data]
          : [response.data]
      );
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put(
        `https://worknest-server-eight.vercel.app/api/task?id=${id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks && prevTasks !== "loading"
          ? prevTasks.map((task) => (task._id === id ? response.data : task))
          : prevTasks
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(
        `https://worknest-server-eight.vercel.app/api/task?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks && prevTasks !== "loading"
          ? prevTasks.filter((task) => task._id !== id)
          : prevTasks
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <tasksContext.Provider
      value={{
        tasks,
        tasksDueDate,
        workspace,
        workspaces,
        date,
        setTasks,
        setWorkspace,
        setWorkspaces,
        setDate,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </tasksContext.Provider>
  );
};
