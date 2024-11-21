import "./App.css";
import Home from "./pages/Home";
import React from "react";
import { SignUp } from "./pages/SignUp";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { useUserContext } from "./pages/Store/UserContext";
import Overview from "./pages/Overview";
import ViewTasks from "./pages/ViewTasks";
import Workspace from "./pages/Workspace";
import { NotFound } from "./pages/NotFound";
import Settings from "./pages/Settings";
import Loading from "./pages/Loading";
import { useTasksContext } from "./pages/Store/TasksContext";
import TaskDetails from "./components/TaskDetails";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const { userData } = useUserContext();
  const { workspace } = useTasksContext();

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return userData === "loading" && workspace === "loading" ? (
      <Loading />
    ) : userData ? (
      <>{children}</>
    ) : (
      <Navigate to={"/login"} />
    );
  };

  return (
    <Routes>
      <Route
        path="signUp"
        element={userData ? <Navigate to={"/"} /> : <SignUp />}
      />
      <Route
        path="login"
        element={userData ? <Navigate to={"/"} /> : <Login />}
      />
      <Route path="createworkspace" element={<Workspace />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        >
          <Route
            path=":id"
            element={
              <ProtectedRoute>
                <TaskDetails />
              </ProtectedRoute>
            }
          ></Route>
        </Route>
        <Route
          path="tasks"
          element={
            <ProtectedRoute>
              <ViewTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
