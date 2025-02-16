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
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  confirmVariant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
  variant = "outline",
  confirmVariant = "destructive",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogCancel asChild>
            <Button variant={variant} onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={confirmVariant} onClick={onConfirm}>
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
