import { Order } from "../types/types";



export const orders = new Map<string, Order>();

export function AddOrder(order: Order) {
    orders.set(order.orderId, order)
}

