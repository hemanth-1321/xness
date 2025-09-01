import { Order } from "../types/types";
import { orders } from "../store/ordermap";
import { prisma } from "@repo/primary-db/prisma";

export const createOrder = async({ order }: { order: Order }) => {
  try {
    const { orderId, userId, asset, openingPrice, quantity, leverage = 1, userAmount } = order;

    console.log("Order details:", orderId, userId, asset, openingPrice, quantity, leverage, userAmount);

    const user =await prisma.user.findUnique({
      where:{
        id:userId
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
      where:{
        id:user.id,
      },
      data:{
        balance:user.balance
      }
    })

    const defaultStopLoss=order.type=="BUY"?openingPrice*0.98:openingPrice*1.02;

   order.stopLoss=defaultStopLoss

    orders.set(orderId,order );

    console.log("Order created successfully. Updated balance:", user.balance);
    console.log("Order created successfully. Updated balance:", order.stopLoss);

  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

// export const checkOrders({symbol,price}:{symbol:string,price:string})=>{

// }

export const CloseOrder=({orderId,userId,closingPrice}:{orderId:string,userId:string,closingPrice:number})=>{

}