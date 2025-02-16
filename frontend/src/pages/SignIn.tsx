import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const appName = import.meta.env.VITE_APP_NAME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-[min(100%,30rem)]">
          <CardHeader>
            <CardTitle className="font-semibold text-xl text-center">
              Sign in to {appName}
            </CardTitle>
            <CardDescription>
              Demo Accounts:
              <br />
              Admin: admin@example.com / admin123
              <br />
              User: user@example.com / user123
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="w-full flex items-center gap-2">
                <Separator orientation="horizontal" className="flex-1" />
                <span>or</span>
                <Separator orientation="horizontal" className="flex-1" />
              </div>
              <Button
                type="button"
                className="w-full bg-white text-black flex items-center justify-center gap-2"
                disabled={loading}
                onClick={() => {
                  // Implement Google OAuth sign-in logic here
                  // Example: window.location.href = "your-google-oauth-url";
                }}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <i className="fa-brands fa-google"></i>
                    Sign in with Google
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
