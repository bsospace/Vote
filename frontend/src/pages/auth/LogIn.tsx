import React, { useState } from "react";
import FlipCard from "@/components/animata/card/flip-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import { FaGoogle } from "react-icons/fa";
import QRScanner from "@/components/qrcode/QrcodeScanner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
export function LoginPage() {
  const [flip, setFlip] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { oauthLogin } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-96 h-96">
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <Card>
            <QRScanner />
          </Card>
        </AlertDialogContent>
      </AlertDialog>
      {/* Tabs */}
      <div className="flex flex-col items-center">
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setFlip(false)}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
              !flip
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Sign in with Google
          </button>
          <button
            onClick={() => setFlip(true)}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
              flip
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Continue as Guest
          </button>
        </div>

        <FlipCard
          flip={flip}
          frontContent={
            <Card className="p-8 h-96 w-full shadow-xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome Back
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Sign in with your Google account
                  </p>
                </div>

                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaGoogle className="w-8 h-8 text-red-500" />
                </div>

                <div className="space-y-4 w-full">
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2"
                    onClick={() => oauthLogin("google")}
                  >
                    <FaGoogle className="w-5 h-5" />
                    <span>Sign in with Google</span>
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </Card>
          }
          backContent={
            <Card className="p-8 h-96 w-full shadow-xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Guest Access
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Continue without an account
                  </p>
                </div>

                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-500" />
                </div>

                <div className="space-y-4 w-full">
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2"
                    onClick={() => console.log("Guest login")}
                  >
                    <User className="w-5 h-5" />
                    <span>Continue as Guest</span>
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">Want full access?</p>
                  <button
                    onClick={() => setFlip(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Sign in with Google instead
                  </button>
                </div>
              </div>
            </Card>
          }
        />
      </div>
    </div>
  );
}

export default LoginPage;
