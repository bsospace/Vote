import { useEffect, useState } from "react";
import { 
  Loader2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { axiosInstance } from "@/lib/Utils";
import { IPoll } from "@/interfaces/Interfaces";
import { Polls } from "@/components/Polls";

export default function Home() {
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/polls");
      setPolls(response.data.data.polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setIsLoading(false);  
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <Accordion type="multiple" defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="text-3xl font-bold mb-8">Poll สำหรับคุณ</h1>
          </AccordionTrigger>
          <AccordionContent>
            <Polls polls={polls} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" >
          <AccordionTrigger>
            <h1 className="text-3xl font-bold mb-8">Poll สาธารณะ</h1>
          </AccordionTrigger>
          <AccordionContent>
            <Polls polls={polls} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
