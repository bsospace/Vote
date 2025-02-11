import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { mockPolls } from "../lib/mockData";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Home() {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Active Polls</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll, index) => {
          const isPollActive = new Date() > new Date(poll.start_time);

          return (
            <>
              {(isAdmin || isPollActive) && (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: index * 0.2,
                  }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">{poll.title}</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2 min-h-16">
                    {poll.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                      {new Date(poll.end_time).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                      {new Date(poll.end_time).toLocaleTimeString()}
                      </span>
                    </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                    <Link to={`/polls/${poll.id}`}>View Poll</Link>
                    </Button>
                  </CardFooter>
                  </Card>
                </motion.div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
