"use client"
import { AuthForm } from '@/components/Auth'
import { InstrumentSidebar } from '@/components/instrumentSideBar'
import { OrderPanel } from '@/components/OrderPannel'
import { OpenOrdersTable } from '@/components/openOrdersTable'
import TradingChart from '@/components/tradingChart'
import { TradingHeader } from '@/components/tradingHeader'
import { useUserStore } from '@/store/userStore'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const token = useUserStore((state) => state.token);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // treat <768px as mobile
    };
    checkMobile(); // run once
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ redirect to login if no token
  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  // no token → show auth
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <AuthForm />
      </div>
    );
  }

  // ✅ block mobile → show warning
  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-center p-4">
        <h1 className="text-xl font-semibold">
          Please use this app on a desktop or larger device. <br />
          Mobile devices are not supported.
        </h1>
      </div>
    );
  }

  // ✅ desktop/laptop → show trading dashboard
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
