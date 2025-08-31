import { v4 as uuidv4 } from "uuid";
import express, { Router } from "express"
import { authMiddleware } from "../middleware/middlware"
import { OrderSchema } from "../types/zod"
import { BuyOrder } from "../controllers/OrderCOntroller"
import { Order } from "../types/types";
import { getUserById } from "../store/usermap";
import { getOrdersByUserId } from "../store/ordermap";
const router: Router = express.Router()



router.post("/trade", authMiddleware, (req, res) => {
    const userId = req.userId
    if (!userId) {
        res.status(403).json({
            message: "user not found"
        })
        return
    }
    console.log("userId")
    const parsedData = OrderSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({
            message: "invalid inputs"
        })
        return
    }
    const { asset, quantity, openingPrice, leverage } = parsedData.data
    const order: Order = {
        orderId: uuidv4(),
        userId,
        asset,
        quantity,
        openingPrice,
        leverage,
        createdAt: new Date(),
        type: "BUY"
    }
    try {
        BuyOrder({ order });
        res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to place order", error });
    }

})


router.get("/open-orders", authMiddleware, (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(403).json({
            message: "user not found"
        })
        return
    }
    const user = getUserById(userId)
    if (!user) {
        console.log("user not found")
        throw new Error("User not found")
    }


    try {
        const openOrders = getOrdersByUserId(userId)
        res.status(200).json({
            openOrders
        })

    } catch (error) {
        console.error("error", error)
        res.status(500).json({ message: "Failed to get open orders", error });

    }



})


export default router