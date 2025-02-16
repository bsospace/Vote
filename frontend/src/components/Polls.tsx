import { IPoll } from "@/interfaces/interfaces";
import { DateFormatFull, DateFormatFullTime } from "@/lib/DateFormat";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { CalendarCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// **Polls List Component**
export function Polls({ polls }: { readonly polls: IPoll[] }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
        ))}
        </div>
    );
}

// **Poll Card Component**
function PollCard({ poll }: { readonly poll: IPoll }) {
    const { user } = useAuth();

    // **Memoized Dates**
    const now = Date.now();
    const pollStartTime = new Date(poll.startVoteAt).getTime();
    const pollEndTime = new Date(poll.endVoteAt).getTime();
    const isPollActive = now < pollEndTime;
    const hasVoted = poll.votes?.some((vote) => vote.userId === user?.id);

    if (!isPollActive) return null; // Hide inactive polls

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="relative">
            <Badge className={`absolute top-4 left-4 ${pollStartTime > now ? "" : "bg-red-500 hover:bg-red-400"} text-white`}>
                {pollStartTime > now
                ? `เริ่มใน${DateFormatFullTime(poll.startVoteAt, "TH-th")}`
                : `สิ้นสุดใน${DateFormatFullTime(poll.endVoteAt, "TH-th")}`}
            </Badge>
            <img
                src={poll.banner ?? "https://placehold.co/600x400/EEE/31343C"}
                alt={poll.question}
                className="rounded-lg max-h-48 object-cover mb-2"
            />
            <h2 className="text-xl font-semibold line-clamp-1">{poll.question}</h2>
            <p className="text-gray-600 line-clamp-2">{poll.description}</p>
            </CardHeader>

            <CardContent>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                <CalendarClock className="w-4 h-4 mr-1" />
                <span>{DateFormatFull(poll.startVoteAt, "TH-th")}</span>
                </div>
                <div className="flex items-center">
                <CalendarCheck className="w-4 h-4 mr-1" />
                <span>{DateFormatFull(poll.endVoteAt, "TH-th")}</span>
                </div>
            </div>
            </CardContent>

            <CardFooter className="flex justify-between">
            <Button asChild className="w-full">
                <Link to={`/polls/${poll.id}`}>{hasVoted ? "แก้ไขคะแนน" : "ลงคะแนน"}</Link>
            </Button>
            {hasVoted && (
                <Button asChild className="w-1/3 ml-2" variant="outline">
                <Link to={`/polls/${poll.id}`}>ดูผล</Link>
                </Button>
            )}
            </CardFooter>
        </Card>
    );
}
