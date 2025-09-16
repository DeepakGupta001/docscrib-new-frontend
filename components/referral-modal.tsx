"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "./icon";

export default function ReferralModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("support@docscrib.com");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[600px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left gradient section */}
          <div className="bg-gradient-to-br from-purple-800 via-indigo-700 to-pink-600 text-white p-8 flex flex-col justify-center">
            <Button variant="secondary" size="sm" className="mb-4 w-fit">
              <Icon name="DollarSign" className="h-4 w-4 mr-2" />
              Docscrib Referral program
            </Button>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Earn up to $50 per user referred
            </h2>
            <ul className="space-y-2 text-sm md:text-base">
              <li>• Earn $50 per paid user. T&Cs apply.</li>
              <li>• Users that sign up with your link get a 30 day free trial on our paid tiers</li>
            </ul>
            <p className="mt-6 text-sm md:text-base opacity-80 leading-relaxed">
              Amounts in $USD. Currency converted on withdrawal. <br />
              *Docscrib may conduct additional authenticity checks prior to distributing funds to rule out instances of fraudulent activities related to a user account.
            </p>
          </div>

          {/* Right form section */}
          <div className="p-8 flex flex-col justify-center">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-semibold">Set up your referral link</DialogTitle>
            </DialogHeader>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Docscrib uses PayPal to process payouts for successful referrals. To receive your referral rewards, please enter your PayPal email address below.
            </p>
            <label className="text-sm md:text-base font-medium mb-3">Your PayPal Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full">Get referral link</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
