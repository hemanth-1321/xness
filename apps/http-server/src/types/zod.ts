import {z} from "zod"

export const userSchema=z.object({
    email:z.string().email("invalid email address"),
    password:z.string()
})


export const OrderSchema=z.object({
    asset:z.string(),
    quantity:z.number(),
    openingPrice:z.number(),
    userAmount:z.number().optional(),
    leverage:z.number().optional(),
    exposure:z.number().optional(),   

})
