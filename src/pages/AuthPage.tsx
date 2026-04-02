import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Kiểm tra email của bạn để xác nhận đăng ký!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <Wallet size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
          FinWallet
        </h1>
      </div>

      <Card className="w-full max-w-md border-none shadow-xl bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? 'Nhập email và mật khẩu để bắt đầu quản lý tài chính' 
              : 'Chào mừng bạn quay trở lại với FinWallet'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="py-6"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="py-6"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full py-6 text-base font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                isSignUp ? 'Đăng ký' : 'Đăng nhập'
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-sm text-muted-foreground text-center max-w-xs">
        Bằng cách tiếp tục, bạn đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
      </p>
    </div>
  );
}
