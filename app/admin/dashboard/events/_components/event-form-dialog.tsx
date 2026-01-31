"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent, updateEvent, type EventFormData } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil } from "lucide-react";

type Event = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  max_score: number;
  date: string | null;
  location: string | null;
  image_url: string | null;
  max_participants: number | null;
  is_active: boolean;
};

interface EventFormDialogProps {
  event?: Event;
  mode: "create" | "edit";
  trigger?: React.ReactNode;
}

const categories = ["technical", "management", "marketing", "design", "other"];

export function EventFormDialog({
  event,
  mode,
  trigger,
}: EventFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<EventFormData>({
    name: event?.name || "",
    category: event?.category || "",
    description: event?.description || "",
    max_score: event?.max_score || 100,
    date: event?.date || "",
    location: event?.location || "",
    image_url: event?.image_url || "",
    max_participants: event?.max_participants || null,
    is_active: event?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result =
        mode === "create"
          ? await createEvent(formData)
          : await updateEvent(event!.id, formData);

      if (result.success) {
        toast({
          title: mode === "create" ? "Event created" : "Event updated",
          description: `Event "${formData.name}" has been ${mode === "create" ? "created" : "updated"} successfully.`,
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {mode === "create" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new event to the system"
              : "Update event details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="max_score">Maximum Score</Label>
              <Input
                id="max_score"
                type="number"
                value={formData.max_score}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_score: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="100"
                required
                min="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date & Time (Optional)</Label>
              <Input
                id="date"
                type="datetime-local"
                value={
                  formData.date
                    ? new Date(formData.date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter event location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="max_participants">
                Max Participants (Optional)
              </Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_participants: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="Enter maximum number of participants"
                min="1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Event is Active (Users can register)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Event" : "Update Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
