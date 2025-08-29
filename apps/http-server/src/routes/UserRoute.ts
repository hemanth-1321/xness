import express, { Router } from "express"

const router:Router=express.Router()




router.post("/signup",(req,res)=>{
    const body=req.body
    console.log("recied data",body)

     res.status(200).json({ message: "Data received successfully", data: body });


})



export default router
