"use client";
import { useState } from 'react';
import { ChevronDown, Settings, Grid3x3, Clock, Search, Bell, User } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { mockAccountInfo } from '@/data/mockTradingData';

export const TradingHeader = () => {
  const [selectedAccount, setSelectedAccount] = useState('Demo');

  return (
    <header className="bg-card border-b border-trading-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left section - Logo and currency pairs */}
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-primary">exness</div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-trading-bg-tertiary rounded-md">
              <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">EU</span>
              </div>
              <span className="text-sm font-medium text-trading-text-primary">EUR/USD</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-trading-bg-tertiary rounded-md">
              <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">XA</span>
              </div>
              <span className="text-sm font-medium text-trading-text-primary">XAU/USD</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-trading-bg-tertiary rounded-md">
              <div className="w-6 h-4 bg-gray-700 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">ET</span>
              </div>
              <span className="text-sm font-medium text-trading-text-primary">ETH</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-trading-bg-tertiary rounded-md">
              <div className="w-6 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">BT</span>
              </div>
              <span className="text-sm font-medium text-trading-text-primary">BTC</span>
            </div>

            <Button variant="ghost" size="sm" className="text-trading-text-muted hover:text-trading-text-primary">
              <span className="text-lg">+</span>
            </Button>
          </div>
        </div>

        {/* Right section - Account info and controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-trading-text-secondary">{selectedAccount}</span>
            <span className="text-trading-text-secondary">Standard</span>
            
            <div className="flex items-center gap-1 text-trading-success font-medium">
              <span>{mockAccountInfo.balance.toFixed(2)} USD</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-trading-text-muted hover:text-trading-text-primary p-2">
              <Clock className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-trading-text-muted hover:text-trading-text-primary p-2">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-trading-text-muted hover:text-trading-text-primary p-2">
              <Grid3x3 className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-trading-text-muted hover:text-trading-text-primary p-2">
              <Bell className="h-4 w-4" />
            </Button>

            <Button className="bg-trading-info hover:bg-trading-info/90 text-white px-4">
              Deposit
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};