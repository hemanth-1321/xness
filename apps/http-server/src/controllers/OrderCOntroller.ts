  import { Order } from "../types/types";
  import { orders } from "../store/ordermap";
  import { prisma } from "@repo/primary-db/prisma";
  interface CheckOrdersParams {
    symbol: string;
    price: number;
  }
  export const createOrder = async ({ order }: { order: Order }) => {
    try {
      const { orderId, userId, asset, openingPrice, quantity, leverage = 1, userAmount } = order;

      console.log("Order details:", orderId, userId, asset, openingPrice, quantity, leverage, userAmount);

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      if (!user) {
        console.log("User not found");
        throw new Error("User not found");
      }

      if (!userAmount || userAmount <= 0) {
        throw new Error("Invalid user amount");
      }

      // Exposure = total position including leverage
      const exposure = openingPrice * quantity * leverage;

      console.log("User balance before:", user.balance);
      console.log("User input amount:", userAmount, "Exposure (with leverage):", exposure);

      // Deduct ONLY the user input amount from balance
      if (user.balance < userAmount) {
        console.log("Insufficient balance");
        throw new Error("Insufficient balance");
      }
      user.balance -= userAmount;
      //upadates user balance
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: user.balance
        }
      })

      const defaultStopLoss = order.type == "BUY" ? openingPrice * 0.98 : openingPrice * 1.02;

      order.stopLoss = defaultStopLoss

      orders.set(orderId, order);

      console.log("Order created successfully. Updated balance:", user.balance);
      console.log("Order created successfully. Updated balance:", order.stopLoss);

    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Error creating order");
    }
  };

  export const checkOpenOrders = ({ symbol, price }: CheckOrdersParams) => {
    for (const [orderId, order] of orders.entries()) {
      if (order.asset.toLowerCase() !== symbol.toLowerCase()) continue;

    //   const pnl = calculatePnl(order, price)
      if (
        (order.type == "BUY" && order.stopLoss && price <= order.stopLoss) || (order.type == "SELL" && order.stopLoss && price >= order.stopLoss)
      ) {
        CloseOrder({ orderId, closingPrice: price });

      }
    }
  }

export  const CloseOrder = async ({ orderId, closingPrice }: { orderId: string, closingPrice: number }) => {
    const order = orders.get(orderId)
    if (!order) {
      // console.error(`Order ${orderId} not found`);
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: order.userId
      }
    })

    if (!user) {
      console.error(`User ${order.userId} not found`);
      return;
    }

    const pnl = calculatePnl(order, closingPrice)
    await prisma.user.update({
      where: {
        id: order.userId
      },
      data: {
        balance: user.balance + order.userAmount! + pnl
      }
    })

    //delete the order from the map
    orders.delete(orderId)

    console.log(
      `Order ${orderId} closed. Type: ${order.type}, Closing price: ${closingPrice}, P&L: ${pnl}, User balance: ${user.balance + order.userAmount! + pnl
      }`
    );


  }


  function calculatePnl(order: Order, closingPrice: number) {
    if (order.type == "BUY") {
      return (closingPrice - order.openingPrice) * order.quantity * order.leverage!;
    } else {
      return (order.openingPrice - closingPrice) * order.quantity * order.leverage!
    }

  }