import { Order } from "../types/types";
import { orders } from "../store/ordermap";
import { getUserById, updateUser, users } from "../store/usermap";
export const BuyOrder = ({ order }: { order: Order }) => {
    try {
        const { orderId, userId, asset, openingPrice, quantity, leverage = 1 } = order
        // console.log("quantity",quantity)
        console.log(orderId, userId, asset, openingPrice,leverage)
        orders.set(orderId,order)

        const user = getUserById(userId)
        if (!user) {
            console.log("user not found")
            throw new Error("User not found")
        }

        const exposure = openingPrice * quantity * leverage
        const margin = exposure / leverage

        console.log("User balance:", user.balance);
        console.log("Exposure:", exposure, "Margin required:", margin);


        if (user.balance < margin) {
            console.log("insufficent balance")
            throw new Error("insuffient blance")
        }
        user.balance = user.balance - margin
        updateUser(user)


    } catch (error) {
        console.error("errorr creating order", error)
        throw new Error("error creating order")
    }
}   