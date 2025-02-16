import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/UseAuth";
import { AppRoutes } from "./routes/Index";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import PollDetails from "./pages/PollDetails";
import CreatePoll from "./pages/CreatePoll";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./contexts/AuthContext";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
