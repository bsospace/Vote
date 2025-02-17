import React, { useState } from "react";
import FlipCard from "@/components/animata/card/flip-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import { FaGoogle } from "react-icons/fa";
import QRScanner from "@/components/qrcode/QrcodeScanner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  const [flip, setFlip] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const { oauthLogin, loginGuest } = useAuth();

  interface QRCodeResult {
    text: string;
  }

  const handleQRCodeScanned = (result: QRCodeResult | null) => {
    if (result) {
      setShowScanner(false);
      setAccessKey(result.text);
    }
  };

  const handleGuestAccess = () => {
    if (!accessKey) {
      return;
    }

    loginGuest(accessKey, "/");

    console.log("Guest access with key:", accessKey);

  };

  // Implement guest access logic here


return (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="flex flex-col items-center">
      <div className="mb-8 flex space-x-4">
        <Button
          onClick={() => setFlip(false)}
          className={`px-6 py-2 rounded-lg transition-all duration-300 ${!flip
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          Sign in with Google
        </Button>
        <Button
          onClick={() => setFlip(true)}
          className={`px-6 py-2 rounded-lg transition-all duration-300 ${flip
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          Continue as Guest
        </Button>
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

              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2"
                onClick={() => oauthLogin("google")}
              >
                <FaGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </Button>

              <p className="text-sm text-gray-500">
                By continuing, you agree to our {" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </Card>
        }
        backContent={
          <Card className="p-8 h-96 w-full shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Guest Access
                </h1>
                <p className="text-gray-500 mt-2">
                  Scan QR code or enter access key
                </p>
              </div>

              <AlertDialog open={showScanner} onOpenChange={setShowScanner}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Scan QR Code
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Scan QR Code</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="mt-2">
                    <QRScanner onResult={handleQRCodeScanned} />
                  </div>
                  <AlertDialogCancel className="mt-4">Cancel</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>

              <div className="w-full space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter access key"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="pr-10"
                  />
                  <Key className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleGuestAccess}
                  disabled={!accessKey}
                >
                  Continue as Guest
                </Button>
              </div>

              <p className="text-sm text-gray-500">Want full access?</p>
              <Button
                variant="link"
                onClick={() => setFlip(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Sign in with Google instead
              </Button>
            </div>
          </Card>
        }
      />
    </div>
  </div>
);
}

export default LoginPage;
