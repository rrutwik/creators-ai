import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChatBotListForm } from "../../components/layout/ChatBotList";
import { ChatBotForm } from "../../components/layout/ChatBotForm";
import type {
  ChatBot,
  CreateChatBotRequest,
  UpdateChatBotRequest,
  User,
} from "../../types/interfaces";
import { listAllChatBots, editChatBot } from "../../services/api";
import { Toaster } from "../../components/ui/sonner";
import { useNavigate } from "react-router-dom";

type ViewMode = "list" | "create" | "edit";

export default function AdminChatBot({ user }: { user: User | null}) {
  const navigate = useNavigate();
  const [chatBots, setChatBots] = useState<ChatBot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingChatBot, setEditingChatBot] = useState<ChatBot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user === null || user === undefined || user?.email != "rutwik2808@gmail.com") {
      navigate("/");
    }
    loadChatBots();
  }, [navigate, user]);

  const loadChatBots = async () => {
    try {
      setIsLoading(true);
      const data = await listAllChatBots();
      setChatBots(data.records);
    } catch (error) {
      toast.error("Failed to load chatbots");
      console.error("Error loading chatbots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    // setEditingCounselor(null);
    // setViewMode('create');
  };

  const handleEdit = (chatBot: ChatBot) => {
    setEditingChatBot(chatBot);
    setViewMode("edit");
  };

  const handleSubmit = async (
    data: CreateChatBotRequest | UpdateChatBotRequest
  ) => {
    try {
      setIsSubmitting(true);

      if ("_id" in data) {
        // Update existing counselor
        await editChatBot(data);
        setChatBots((prev) =>
          prev.map((c) => (c._id === data._id ? { ...data } : c))
        );
        toast.success("ChatBot updated successfully");
      } else {
        throw new Error("Invalid counselor data");
        // Create new counselor
        // const newCounselor = await createCounselor(data);
        // setCounselors(prev => [...prev, newCounselor]);
        // toast.success('Counselor created successfully');
      }

      setViewMode("list");
      setEditingChatBot(null);
    } catch (error) {
      toast.error(
        viewMode === "edit"
          ? "Failed to update counselor"
          : "Failed to create counselor"
      );
      console.error("Error submitting counselor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // await deleteCounselor(id);
      // setCounselors(prev => prev.filter(c => c._id !== id));
      toast.success("Counselor deleted successfully");
    } catch (error) {
      toast.error("Failed to delete counselor");
      console.error("Error deleting counselor:", error);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingChatBot(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {viewMode === "list" ? (
          <ChatBotListForm
            chatBots={chatBots}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            isLoading={isLoading}
          />
        ) : (
          <ChatBotForm
            chatBot={editingChatBot}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}
