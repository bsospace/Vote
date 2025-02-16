import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import { mockPolls } from "../lib/mockData";
import { useAuth } from "@/hooks/UseAuth";
// import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/AlertDialog";
import { axiosInstance } from "@/lib/Utils";

export default function HomePage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState(mockPolls);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, [user]);

  const fetchPolls = async () => {
    try {
      const response = await axiosInstance.get("/poll");
      setPolls(response.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  // Function to handle opening the delete confirmation dialog
  const handleDeletePoll = (pollId: string) => {
    setSelectedPollId(pollId);
    setIsConfirming(true); // Opens dialog immediately
  };

  // Function to confirm the deletion
  const confirmDelete = () => {
    if (!selectedPollId) return;
    console.log(`Deleted Poll ID: ${selectedPollId}`);
    setIsConfirming(false); // Close the dialog
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Active Polls</h1>

      {/* Confirm Dialog is rendered outside of the map */}
      <ConfirmDialog
        open={isConfirming}
        onOpenChange={setIsConfirming}
        title="Are you sure you want to delete this poll?"
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll, index) => {
          const isPollActive = new Date() > new Date(poll.start_time);

          return (
            <React.Fragment key={poll.id}>
              {( isPollActive) && (
                <motion.div
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
                      <h2 className="text-xl font-semibold line-clamp-1">
                        {poll.title}
                      </h2>
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
                    <CardFooter className="flex justify-between">
                      <Button asChild>
                        <Link to={`/polls/${poll.id}`}>View Poll</Link>
                      </Button>
                      {/* {( */}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/polls/${poll.id}/edit`)
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents dropdown from closing
                                handleDeletePoll(poll.id); // Show dialog
                              }}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      {/* )} */}
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
