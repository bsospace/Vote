import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, Clock, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { mockPolls, mockPollOptions, mockVotes } from "../lib/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function PollDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [votes, setVotes] = useState(mockVotes);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const poll = mockPolls.find((p) => p.id === id);
  const options = mockPollOptions[id || ""] || [];

  if (!poll) {
    return <div>Poll not found</div>;
  }

  const handleVote = (optionId: string) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    if (userVote) {
      return;
    }

    setSelectedOption(optionId);
    setIsConfirming(true);
  };

  const confirmVote = async () => {
    if (!selectedOption) return;

    if (!user) {
      toast.error("User not found");
      return;
    }

    const newVote = {
      id: crypto.randomUUID(),
      poll_id: poll.id,
      option_id: selectedOption,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    setVotes([...votes, newVote]);
    setUserVote(selectedOption);
    setIsConfirming(false);
    toast.success("Vote cast successfully");
  };

  const isActive =
    new Date() >= new Date(poll.start_time) &&
    new Date() <= new Date(poll.end_time);
  const totalVotes = votes.length;

  return (
    <motion.div
      key={poll.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      }}
    >
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white p-6 mb-6 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{poll.title}</h2>
            <h4 className="text-gray-600 mb-6">{poll.description}</h4>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  Ends: {new Date(poll.end_time).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(poll.end_time).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{totalVotes} votes</span>
              </div>
            </div>

            <div className="space-y-4">
              {options.map((option) => {
                const voteCount = votes.filter(
                  (v) => v.option_id === option.id
                ).length;
                const percentage =
                  totalVotes > 0
                    ? Math.round((voteCount / totalVotes) * 100)
                    : 0;
                const isSelected = userVote === option.id;

                return (
                  <AlertDialogTrigger asChild key={option.id}>
                    <Card
                      className={`relative ${
                        isActive && !userVote
                          ? "cursor-pointer hover:bg-gray-50"
                          : ""
                      } border rounded-lg p-4`}
                      onClick={() =>
                        isActive && !userVote && handleVote(option.id)
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{option.title}</span>
                      </div>

                      {option.description && (
                        <span className="mt-2 text-sm text-gray-500">
                          {option.description}
                        </span>
                      )}

                      {isSelected && (
                        <Badge className="absolute top-4 right-4">
                          Your vote
                        </Badge>
                      )}
                    </Card>
                  </AlertDialogTrigger>
                );
              })}
            </div>

            {!isActive && (
              <span className="mt-6 text-center text-gray-500">
                This poll has{" "}
                {new Date() < new Date(poll.start_time)
                  ? "not started yet"
                  : "ended"}
              </span>
            )}
          </Card>
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.5,
            }}
          >
            <Button asChild>
              <Link to={"/"}>Back</Link>
            </Button>
          </motion.div>
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will cast your vote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirming(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmVote}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
