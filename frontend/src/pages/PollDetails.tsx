import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, Clock, Users, Star, Check, Plus, Minus } from "lucide-react";
import { useAuth } from "../hooks/UseAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { axiosInstance } from "@/lib/Utils";
import { IPoll } from "@/interfaces/interfaces";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const PollDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [poll, setPoll] = useState<IPoll>();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const [userPoint, setUserPoint] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [votingPoint, setVotingPoint] = useState<number>(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchPollData();
  }, [id]);

  const fetchPollData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/polls/${id}`);
      setPoll(response.data.data);

      const userWhitelist = response.data.data.event.whitelist.find(
        (item: { userId: string }) => item.userId === user?.id
      );
      setUserPoint(userWhitelist?.point || 0);
    } catch (error) {
      toast.error("Failed to load poll data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !user) return;

    console.log(
      "pollId: " + poll?.id,
      "optionId: " + selectedOption,
      "userId: " + user.id,
      "point: " + userPoint
    );

    // try {
    //   await axiosInstance.post(`/polls/${id}/vote`, {
    //     pollId: poll?.id,
    //     optionId: selectedOption,
    //     userId: user.id,
    //     point: userPoint,
    //   });

    //   toast.success("Vote cast successfully!");
    //   setIsVoteDialogOpen(false);
    //   fetchPollData();
    // } catch (error) {
    //   toast.error("Failed to cast vote");
    // }
  };

  const isActive =
    poll &&
    new Date() >= new Date(poll.startVoteAt) &&
    new Date() <= new Date(poll.endVoteAt);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!poll) return null;

  const selectedOptionData = poll.options?.find(
    (opt) => opt.id === selectedOption
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{poll.question}</h1>
                <p className="text-gray-600 mt-2">{poll.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Start: {new Date(poll.startVoteAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                End: {new Date(poll.endVoteAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {poll.voteCount} votes
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {poll?.options?.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={isActive ? { scale: 1.01 } : {}}
                  className={`relative ${
                    isActive ? "cursor-pointer" : "opacity-80"
                  }`}
                  onClick={() => {
                    if (isActive && userPoint > 0) {
                      setSelectedOption(option.id);
                      setIsVoteDialogOpen(true);
                    }
                  }}
                >
                  <Card
                    className={`p-4 ${
                      selectedOption === option.id ? "border-primary" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{option.text}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {!isActive && (
            <div className="mt-6 text-center text-gray-500">
              {new Date() < new Date(poll.startVoteAt)
                ? "This poll has not started yet"
                : "This poll has ended"}
            </div>
          )}

          {isActive && userPoint === 0 && (
            <div className="mt-6 text-center text-amber-600">
              You are not eligible to vote in this poll
            </div>
          )}
        </Card>

        <div className="mt-6">
          <Button asChild>
            <Link to="/">Back to Polls</Link>
          </Button>
        </div>
      </motion.div>

      <Sheet open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
        <SheetContent side="bottom" className="h-3/4 rounded-t-2xl shadow-lg">
          <div className="h-full flex flex-col p-4">
            {/* <SheetHeader className="text-left">
              <div className="relative p-6 rounded-lg flex flex-col items-center">
                <div className="w-20 h-20 flex justify-center items-center">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg rounded-full overflow-hidden">
                    <AvatarImage
                      src={selectedOptionData?.banner}
                      alt="Poll Image"
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                </div>
              </div>
            </SheetHeader> */}

            <div className="flex-grow space-y-6 overflow-auto py-6">
              {/* Event Points */}
              <div className="bg-white border rounded-lg shadow-md p-6">
                <h3 className="font-medium text-gray-700 mb-2">
                  Event Points Available
                </h3>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-xl">{userPoint} points</span>
                </div>
              </div>

              {/* Selected Option */}
              <div className="bg-white border rounded-lg shadow-md p-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Selected Option
                </h3>
                <div className="h-20 flex items-center">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg rounded-full overflow-hidden me-5">
                    <AvatarImage
                      src={selectedOptionData?.banner}
                      alt="Poll Image"
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                  <span>{selectedOptionData?.text}</span>
                </div>
              </div>

              {/* Adjust Voting Power */}
              <div className="bg-white border rounded-lg shadow-md p-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Adjust Voting Power
                </h3>
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded-md">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shadow"
                    onClick={() => setVotingPoint(votingPoint - 1)}
                    disabled={votingPoint <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-blue-600" />
                    <span className="text-2xl font-bold">{votingPoint}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="shadow"
                    onClick={() => setVotingPoint(votingPoint + 1)}
                    disabled={votingPoint >= userPoint}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="flex w-full gap-4">
                <Button
                  variant="outline"
                  className="flex-1 shadow-md"
                  onClick={() => setIsVoteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 shadow-md bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => setIsConfirmDialogOpen(true)}
                >
                  Continue
                </Button>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Selected Option:</p>
                  <p className="text-lg mt-1">{selectedOptionData?.text}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <p className="font-medium">
                    Voting with {votingPoint} points
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVote}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PollDetails;
