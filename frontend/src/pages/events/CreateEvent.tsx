import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !eventDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate API call
    toast.success("Event created successfully");
    navigate("/events"); // Redirect after creation
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate("/events")}>
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </div>
  );
}
