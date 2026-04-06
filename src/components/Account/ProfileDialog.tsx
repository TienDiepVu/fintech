import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Camera, Mail, Phone, Calendar, MapPin, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImageCropper } from "./ImageCropper";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { profile, user } = useAuth();
  const { uploadAvatar, loading } = useProfile();
  const [isHovering, setIsHovering] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    // Chuyển Blob thành File để tương thích với hook uploadAvatar
    const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
    await uploadAvatar(file);
    setTempImage(null); // Đóng chế độ cắt ảnh
  };

  const infoItems = [
    { label: "Họ và tên", value: profile?.full_name || "Chưa cập nhật", icon: User },
    { label: "Email", value: profile?.email || user?.email || "Chưa cập nhật", icon: Mail },
    { label: "Số điện thoại", value: profile?.phone || "Chưa cập nhật", icon: Phone },
    { label: "Ngày sinh", value: profile?.birthday || "Chưa cập nhật", icon: Calendar },
    { label: "Địa chỉ", value: profile?.address || "Chưa cập nhật", icon: MapPin },
  ];

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setTempImage(null); // Reset khi đóng dialog
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {tempImage && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={() => setTempImage(null)}
              >
                <ArrowLeft size={20} />
              </Button>
            )}
            <DialogTitle className="text-2xl font-bold flex-1 text-center pr-8">
              {tempImage ? "Cắt ảnh đại diện" : "Thông tin tài khoản"}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          {tempImage ? (
            <ImageCropper 
              image={tempImage} 
              onCropComplete={handleCropComplete} 
              onCancel={() => setTempImage(null)} 
            />
          ) : (
            <>
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Avatar 
                  src={profile?.avatar_url} 
                  name={profile?.full_name} 
                  size="xl" 
                  className="ring-4 ring-primary/10 transition-all group-hover:opacity-75 shadow-lg"
                />
                <div className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                  <Camera size={24} />
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <input 
                  id="avatar-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </div>

              <div className="w-full space-y-4">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shrink-0 border border-border">
                      <item.icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-xl py-6 font-semibold"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
