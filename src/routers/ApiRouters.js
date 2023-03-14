import express,{ Router } from "express";
import  CartRouter  from "./CarRouter.js";
import  ProductsRouter  from "./ProductsRouter.js";

export const ApiRouters = Router()

ApiRouters.use(express.json())
ApiRouters.use(express.urlencoded({extended: true}))

ApiRouters.use('/products',ProductsRouter )
ApiRouters.use('/carts',CartRouter)