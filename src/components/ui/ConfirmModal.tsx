import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isLoading = false,
    isDestructive = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isDestructive ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        disabled={isLoading}
                        className="-mr-2 h-8 w-8"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </CardHeader>

                <CardContent className="pt-4">
                    <p className="text-muted-foreground">
                        {message}
                    </p>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={isDestructive ? "destructive" : "default"}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {confirmLabel}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
