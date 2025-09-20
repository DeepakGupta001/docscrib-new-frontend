"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../_components/login-form";
import GoogleLoginHookComponent from "@/components/GoogleLoginHookComponent";
import { GoogleButton } from "../_components/social-auth/google-button";
import { authApi } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/authSlice";

export default function LoginV2() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/default";
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { user, token, loading } = useSelector((state) => state.auth);

  console.log("user=", user, token);

  useEffect(() => {
    //
  }, [user?.id]);

  const handleGoogleLoginSuccess = async (data: any) => {
    setIsGoogleLoading(true); // Keep loading active during API call

    try {
      const result = await dispatch(
        login({
          googleId: data.sub,
          email: data.email,
          name: data.name,
          picture: data.picture,
          accessToken: data.access_token
        })
      );

      // Send the Google user data to your backend for authentication
      // await authApi.googleCallback({
      //   googleId: data.sub,
      //   email: data.email,
      //   name: data.name,
      //   picture: data.picture,
      //   accessToken: data.access_token
      // });

      // toast.success("Login successful!", {
      //   description: "Welcome back! Redirecting..."
      // });

      // Redirect to dashboard
      router.push(redirectTo);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed", {
        description: error instanceof Error ? error.message : "Please try again."
      });
      setIsGoogleLoading(false); // Stop loading on error
    }
  };

  return (
    <AuthGuard>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Login to your account</h1>
          <p className="text-sm text-muted-foreground">Please enter your details to login.</p>
        </div>
        <div className="space-y-4">
          <GoogleLoginHookComponent
            onGoogleLoginSuccess={handleGoogleLoginSuccess}
            onLoadingChange={setIsGoogleLoading}>
            <GoogleButton className="w-full" />
          </GoogleLoginHookComponent>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <LoginForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link className="text-foreground" href="register">
            Register
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          ENG
        </div>
      </div>
    </AuthGuard>
  );
}
