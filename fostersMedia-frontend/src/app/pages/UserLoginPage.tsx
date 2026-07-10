import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Lock, Mail, Loader2, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().default(true)
});

type LoginFields = z.infer<typeof loginSchema>;

export function UserLoginPage() {
  const { loginAsync, isLoggingIn } = useUserAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true
    }
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      await loginAsync({
        email: data.email,
        password: data.password,
        remember: data.remember
      });
      navigate("/");
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] flex items-center justify-center relative overflow-hidden px-6 bg-mesh-grid text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-glow-radial rounded-full blur-[120px] opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] items-center justify-center shadow-lg shadow-[#FF6A88]/20 mx-auto">
            <span className="font-extrabold text-white text-2xl">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Fosters Media</h1>
            <p className="text-xs text-white/50 uppercase tracking-widest font-mono font-medium mt-1">
              User Portal Login
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 border-white/5 shadow-2xl relative overflow-hidden bg-[#0E1015]/80 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A88]/5 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`pl-10 bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50 ${
                    errors.email ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-10 bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50 ${
                    errors.password ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-white/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="rounded border-white/10 bg-white/5 text-[#FF6A88] focus:ring-0 focus:ring-offset-0 w-4 h-4"
                />
                <span>Remember session</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11 shadow-lg shadow-[#FF6A88]/15 flex items-center justify-center space-x-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-white/60 mb-3">New to Fosters Media?</p>
            <Link to="/register">
              <Button
                variant="ghost"
                className="w-full border border-white/10 text-white/90 hover:bg-white/5 rounded-xl h-11"
              >
                Create an account
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 text-[10px] text-white/30 font-mono space-y-2">
          <div>SECURE USER PORTAL • Fosters Media</div>
          <Link to="/admin/login" className="text-[#FF6A88] hover:underline">
            Admin Console Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
