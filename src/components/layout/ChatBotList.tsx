import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
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
} from "../ui/alert-dialog";
import type { ChatBot } from "../../types/interfaces";
import { Edit2, Trash2, Plus, Eye, FileText } from "lucide-react";

interface ChatBotListProps {
  chatBots: ChatBot[];
  onEdit: (counselor: ChatBot) => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: () => void;
  isLoading?: boolean;
}

export function ChatBotListForm({
  chatBots,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: ChatBotListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(
    new Set()
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const togglePromptExpanded = (counselorId: string) => {
    setExpandedPrompts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(counselorId)) {
        newSet.delete(counselorId);
      } else {
        newSet.add(counselorId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Counselor Management</h1>
          <p className="text-muted-foreground">
            Manage your counselor entities
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Counselor
        </Button>
      </div>

      {chatBots.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No counselors found</p>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Counselor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {chatBots.map((counselor) => (
            <Card key={counselor._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{counselor.avatar}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {counselor.name}
                        <Badge variant="secondary">{counselor.religion}</Badge>
                      </CardTitle>
                      <CardDescription>ID: {counselor.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(counselor)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={deletingId === counselor._id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Counselor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{counselor.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(counselor._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {counselor.description}
                </p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm">Greeting:</span>
                    <p className="text-sm bg-muted p-2 rounded mt-1">
                      "{counselor.greeting}"
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Prompt:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePromptExpanded(counselor._id)}
                        className="h-6 px-2 text-xs"
                      >
                        {expandedPrompts.has(counselor._id) ? (
                          <>
                            <FileText className="w-3 h-3 mr-1" />
                            Raw
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </>
                        )}
                      </Button>
                    </div>
                    {expandedPrompts.has(counselor._id) ? (
                      <div className="text-sm bg-muted rounded mt-1 overflow-hidden p-3"></div>
                    ) : (
                      <p className="text-sm bg-muted p-2 rounded mt-1 line-clamp-2">
                        {counselor.prompt.length > 100
                          ? `${counselor.prompt.substring(0, 100)}...`
                          : counselor.prompt}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
