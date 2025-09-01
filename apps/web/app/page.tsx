"use client"
import { AuthForm } from '@/components/Auth'
import { InstrumentSidebar } from '@/components/instrumentSideBar'
import { OrderPanel } from '@/components/OrderPannel'
import { OpenOrdersTable } from '@/components/openOrdersTable'
import TradingChart from '@/components/tradingChart'
import { TradingHeader } from '@/components/tradingHeader'
import { useUserStore } from '@/store/userStore'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'


const Page = () => {
  const token = useUserStore((state) => state.token);
  const router=useRouter()
   useEffect(() => {
    if (!token) {
      router.replace("/"); // or wherever your auth page is
    }
  }, [token, router]);

  // while redirecting, optionally show nothing or a loader
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <AuthForm />
      </div>
    );
  }

  // else show trading dashboard
  return (
    <div className="min-h-screen bg-background">
      <TradingHeader />
      <div className="flex h-[calc(100vh-73px)]">
        <InstrumentSidebar />

        <div className="flex-1 flex flex-col">
          <div className="flex flex-1">
            <div className="flex-1 p-4">
              <TradingChart />
            </div>
            <OrderPanel />
          </div>

          <div className="p-4 border-t border-trading-border">
            <OpenOrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
