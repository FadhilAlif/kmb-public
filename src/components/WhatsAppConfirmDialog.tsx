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
import { MessageCircle } from "lucide-react";

interface WhatsAppConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  message: string;
}

const WhatsAppConfirmDialog = ({
  open,
  onOpenChange,
  phoneNumber,
  message,
}: WhatsAppConfirmDialogProps) => {
  const formattedPhone = phoneNumber.replace(/^62/, "+62 ");
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  const handleConfirm = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-whatsapp" />
            Konfirmasi WhatsApp
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Anda akan diarahkan ke WhatsApp untuk mengirim pesan berikut:
              </p>
              
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Ke:</span>
                  <span className="font-medium text-foreground">{formattedPhone}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <span className="text-sm text-muted-foreground">Pesan:</span>
                  <p className="mt-1 text-foreground bg-background rounded-md p-3 border border-border text-sm">
                    "{message}"
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-whatsapp hover:bg-whatsapp-hover text-accent-foreground gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Kirim via WhatsApp
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WhatsAppConfirmDialog;
