"use client";
import { use, useState } from 'react';
import { ChevronDown, Settings, Grid3x3, Clock, Search, Bell, User } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { mockAccountInfo } from '@/data/mockTradingData';
import { useUserStore } from "@/store/userStore";
export const TradingHeader = () => {
  const { logout } = useUserStore();
  return (
    <header className="bg-card border-b border-trading-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left section - Logo and currency pairs */}
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-primary">Xness</div>
   
        </div>

        {/* Right section - Account info and controls */}
        <div className="flex items-center gap-4">
         

          <div className="flex items-center gap-2">
           

            <Button  onClick={logout} className="bg-trading-info hover:bg-trading-info/90 text-white px-4 cursor-pointer">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};