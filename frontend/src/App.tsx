import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/polls/:id"
                element={
                  <RequireAuth>
                    <PollDetails />
                  </RequireAuth>
                }
              />
              <Route
                path="/create-poll"
                element={
                  <RequireAuth requireAdmin>
                    <CreatePoll />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
