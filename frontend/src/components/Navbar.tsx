import { Link } from "react-router-dom";
import { Vote } from "lucide-react";
import { NavUser } from "@/components/NavUser";

export default function Navbar() {
  const user = {
    firstName: "John",
    lastName: "Doe",
    avatar: "https://randomuser.me/api/portraits",
    email: "John@bsospace.com",
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-semibold">{appName}</span>
          </Link>

          <div className="flex items-center space-x-4">
            <NavUser user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
