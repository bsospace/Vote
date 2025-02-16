import { Link } from "react-router-dom";
import { Vote, LogOut, LogIn } from "lucide-react";
// import { useAuth } from "../hook/AuthContext";
import { useAuth } from "@/hooks/UseAuth";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user } = useAuth();
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold">{appName}</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* {user ? (
              <>
                {isAdmin && (
                  <Button asChild>
                    <Link to="/create-poll">Create Poll</Link>
                  </Button>
                )}
                <Button variant={'destructive'} onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Button asChild className={!user ? 'hidden' : ''}>
                <Link
                  to="/signin"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  );
}
