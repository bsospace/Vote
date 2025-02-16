import FlipCard from "@/components/animata/card/flip-card";
import { useState } from "react";

export function LoginPage() {
  const [flip, setFlip] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Tabs */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFlip(false)}
          className={`px-4 py-2 rounded-lg ${
            !flip ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Login with Google
        </button>
        <button
          onClick={() => setFlip(true)}
          className={`px-4 py-2 rounded-lg ${
            flip ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Login as Guest
        </button>
      </div>

      {/* Flip Card */}
      <FlipCard
        flip={flip}
        frontContent={
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold">Sign in with Google</h1>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Google Login</button>
          </div>
        }
        backContent={
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold">Login as Guest</h1>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">Continue as Guest</button>
          </div>
        }
      />
    </div>
  );
}
