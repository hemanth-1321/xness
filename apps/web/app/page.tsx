import { InstrumentSidebar } from '@/components/instrumentSideBar'
import { OrderPanel } from '@/components/OrderPannel'
import { PositionsTable } from '@/components/positionsTable'
import { TradingChart } from '@/components/tradiingChart'
import { TradingHeader } from '@/components/tradingHeader'
import React from 'react'
 const page = () => {
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
            <PositionsTable />
          </div>
        </div>
      </div>
    </div>
  )
}


export default page