import { v4 as uuidv4 } from "uuid";
import express, { Router } from "express"
import { authMiddleware } from "../middleware/middlware"
import { OrderSchema } from "../types/zod"
import { CloseOrder, createOrder } from "../controllers/OrderCOntroller"
import { Order } from "../types/types";
import { getOrdersByUserId } from "../store/ordermap";
import { prisma } from "@repo/primary-db/prisma";
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
            message: "invalid inputs",
            err: parsedData.error.errors
        })
        return
    }
    const { asset, quantity, openingPrice, leverage, userAmount, type } = parsedData.data
    const order: Order = {
        orderId: uuidv4(),
        userId,
        asset,
        quantity,
        openingPrice,
        leverage,
        userAmount,
        createdAt: new Date(),
        type: type
    }
    try {
        createOrder({ order });
        res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to place order", error });
    }

})


router.get("/open-orders", authMiddleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(403).json({
            message: "user not found"
        })
        return
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        console.log("user not found")
        throw new Error("User not found")
    }

    const userBalance = user.balance

    try {
        const openOrders = getOrdersByUserId(userId)
        res.status(200).json({
            ...openOrders,
            userBalance
        })

    } catch (error) {
        console.error("error", error)
        res.status(500).json({ message: "Failed to get open orders", error });

    }



})

router.post("/close-order/:orderId", authMiddleware, async (req, res) => {
    const userId = req.userId
    if (!userId) {
        res.status(403).json({
            message: "user not found"
        })
        return
    }

    const { orderId } = req.params;
    const { closingPrice } = req.body;

    if (!orderId) {
        console.log("orderId not found")
        return
    }
    try {
        await CloseOrder({
            orderId,
            closingPrice: Number(closingPrice),
        });
        res.status(200).json({ message: "Order closed successfully", orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to close order", error });
    }

})


export default router