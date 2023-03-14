import express,{ Router } from "express";
import { cartRouter } from "./CartRouter.js";
import { productsRouter } from "./ProductsRouter.js";



export const apiRouters = Router()

apiRouters.use(express.json())
apiRouters.use(express.urlencoded({extended: true}))

apiRouters.use('/products',productsRouter)
apiRouters.use('/carts',cartRouter)