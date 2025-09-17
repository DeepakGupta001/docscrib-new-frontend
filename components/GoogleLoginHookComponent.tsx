"use client";

import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

interface GoogleProfile {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

interface GoogleLoginData extends GoogleProfile {
  access_token: string;
}

interface CustomGoogleLoginProps {
  onGoogleLoginSuccess?: (data: GoogleLoginData) => void;
  onLoadingChange?: (loading: boolean) => void;
  children?: React.ReactNode;
}

function CustomGoogleLogin({ onGoogleLoginSuccess, onLoadingChange, children }: CustomGoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      if (onLoadingChange) onLoadingChange(true);

      try {
        const { access_token } = tokenResponse;
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const profile: GoogleProfile = await res.json();
        console.log("Google profile:", profile);

        if (onGoogleLoginSuccess) onGoogleLoginSuccess({ ...profile, access_token });
        // Don't set loading to false here - let parent component handle it
      } catch (error) {
        console.error("Google OAuth error:", error);
        setIsLoading(false);
        if (onLoadingChange) onLoadingChange(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    },
    flow: "implicit"
  });

  // If children are provided, clone and pass the onClick handler and loading state
  if (children) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => login(),
      disabled: isLoading,
      loading: isLoading,
    });
  }

  // Default button if no children are provided
  return (
    <div className="flex justify-center">
      <button
        onClick={() => login()}
        disabled={isLoading}
        className={`flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 transition font-medium ${
          isLoading
            ? "bg-gray-100 cursor-not-allowed opacity-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        id='ztalk-google-login-button'
        aria-label="Login with Google"
        title="Login with Google"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google Logo"
          className="w-5 h-5"
        />
        <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
      </button>
    </div>
  );
}

interface GoogleLoginHookComponentProps {
  onGoogleLoginSuccess?: (data: GoogleLoginData) => void;
  onLoadingChange?: (loading: boolean) => void;
  children?: React.ReactNode;
}

export default function GoogleLoginHookComponent({ onGoogleLoginSuccess, onLoadingChange, children }: GoogleLoginHookComponentProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        <CustomGoogleLogin onGoogleLoginSuccess={onGoogleLoginSuccess} onLoadingChange={onLoadingChange}>
          {children}
        </CustomGoogleLogin>
      </GoogleOAuthProvider>
    ) : 'No Google Auth Key'
  );
}
