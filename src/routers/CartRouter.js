import express, { Router } from 'express'
import { CartManager } from "../models/CartManajer.js"

export const cartRouter = Router()

const cartMng = new CartManager("./data/cart.json", "./data/products.json" )

cartRouter.use(express.json())

cartRouter.post("/", async(req,res) => {
    const newCart = await cartMng.createCart()    
    res.send({status:"succes", payload:newCart})
  })

cartRouter.get("/:id", async(req,res) => {
  try {
    const cart = await cartMng.getCartById(req.params.id)
    res.send(cart)
  } catch (error) {
    res.status(404).json({message:error.message})
  }    
  }) 

cartRouter.post("/:cid/product/:pid", async(req,res) => {
    try {
      const products = await cartMng.addProductCart(req.params.cid, req.params.pid)
      res.send({status:"succes", payload:products})
    } catch (error) {
      res.status(400).json({status:"error", message: error.message})
    }
    
  })
