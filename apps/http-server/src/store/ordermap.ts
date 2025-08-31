import { Order } from "../types/types";



export const orders = new Map<string, Order>();

export function AddOrder(order: Order) {
    orders.set(order.orderId, order)
}


export function getOrdersByUserId(userId:string):Order[]{
return Array.from(orders.values()).filter(o=>o.userId===userId)


}