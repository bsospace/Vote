import { Link } from "react-router-dom";
import { Vote, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import { NavUser } from "./NavUser";
import { IUser } from "@/interfaces/interfaces";
import { config } from "@/config/Config";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-semibold">{config.appName}</span>
          </Link>

          <div className="flex items-center space-x-4">
            {
              user && (
                <NavUser user={user} logout={logout} />
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
}
