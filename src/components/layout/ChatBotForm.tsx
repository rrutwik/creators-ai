import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type {
  ChatBot,
  CreateChatBotRequest,
  UpdateChatBotRequest,
} from "../../types/interfaces";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";

interface ChatBotFormProps {
  chatBot?: ChatBot | null;
  onSubmit: (
    data: CreateChatBotRequest | UpdateChatBotRequest
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ChatBotForm({
  chatBot,
  onSubmit,
  onCancel,
  isLoading = false,
}: ChatBotFormProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<UpdateChatBotRequest>({
    _id: chatBot?._id || "",
    id: chatBot?.id || "",
    name: chatBot?.name || "",
    religion: chatBot?.religion || "",
    description: chatBot?.description || "",
    avatar: chatBot?.avatar || "",
    greeting: chatBot?.greeting || "",
    prompt: chatBot?.prompt || "",
  });

  const [prompt, setPrompt] = useState<string>(formData.prompt);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) newErrors.id = "ID is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.religion.trim()) newErrors.religion = "Religion is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.avatar.trim()) newErrors.avatar = "Avatar is required";
    if (!formData.greeting.trim()) newErrors.greeting = "Greeting is required";
    if (!prompt.trim()) newErrors.prompt = "Prompt is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = chatBot
      ? { ...formData, prompt }
      : { ...formData, prompt };

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>{chatBot ? "Edit ChatBot" : "Create New ChatBot"}</CardTitle>
        <CardDescription>
          {chatBot
            ? "Update the chatbot information below."
            : "Fill in the details to create a new chatbot."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => handleChange("id", e.target.value)}
                placeholder="e.g., christian"
                className={errors.id ? "border-destructive" : ""}
              />
              {errors.id && (
                <p className="text-sm text-destructive">{errors.id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Divine Counselor"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) => handleChange("religion", e.target.value)}
                placeholder="e.g., Christianity"
                className={errors.religion ? "border-destructive" : ""}
              />
              {errors.religion && (
                <p className="text-sm text-destructive">{errors.religion}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleChange("avatar", e.target.value)}
                placeholder="e.g., ✝️"
                className={errors.avatar ? "border-destructive" : ""}
              />
              {errors.avatar && (
                <p className="text-sm text-destructive">{errors.avatar}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Biblical wisdom and guidance"
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting</Label>
            <Textarea
              id="greeting"
              value={formData.greeting}
              onChange={(e) => handleChange("greeting", e.target.value)}
              placeholder="e.g., Peace be with you. How may I guide you with biblical wisdom today?"
              rows={3}
              className={errors.greeting ? "border-destructive" : ""}
            />
            {errors.greeting && (
              <p className="text-sm text-destructive">{errors.greeting}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt (Markdown supported)</Label>
            <div className="w-full" data-color-mode={theme}>
              <MDEditor
                value={prompt}
                onChange={(value: string | undefined) => setPrompt(value || "")}
                height={400}
                className="w-full rounded-md border border-input"
              />
              <MDEditor.Markdown source={prompt} />
            </div>
            {errors.prompt && (
              <p className="text-sm text-destructive mt-1">{errors.prompt}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : chatBot
                ? "Update ChatBot"
                : "Create ChatBot"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
