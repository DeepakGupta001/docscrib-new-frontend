"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { RegisterForm } from "../_components/register-form";
import GoogleLoginHookComponent from "@/components/GoogleLoginHookComponent";
import { GoogleButton } from "../_components/social-auth/google-button";
import { authApi } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

export default function RegisterV2() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLoginSuccess = async (data: any) => {
    setIsGoogleLoading(true); // Keep loading active during API call

    try {
      // Send the Google user data to your backend for authentication
      await authApi.googleCallback({
        googleId: data.sub,
        email: data.email,
        name: data.name,
        picture: data.picture,
        accessToken: data.access_token,
      });

      toast.success("Registration successful!", {
        description: "Welcome! Redirecting...",
      });

      // Redirect to dashboard
      router.push("/dashboard/default");
    } catch (error) {
      console.error("Google registration failed:", error);
      toast.error("Google registration failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setIsGoogleLoading(false); // Stop loading on error
    }
  };

  return (
    <AuthGuard>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Create your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to register.</p>
        </div>
        <div className="space-y-4">
          <GoogleLoginHookComponent
            onGoogleLoginSuccess={handleGoogleLoginSuccess}
            onLoadingChange={setIsGoogleLoading}
          >
            <GoogleButton className="w-full" />
          </GoogleLoginHookComponent>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
          </div>
          <RegisterForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link className="text-foreground" href="login">
            Login
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="text-muted-foreground size-4" />
          ENG
        </div>
      </div>
    </AuthGuard>
  );
}
