import express, { Router } from 'express'
import ProductManager from '../models/ProductManager.js'

export const productsRouter = Router()

const ProductMng = new ProductManager('./data/products.json')

productsRouter.use(express.json())

productsRouter.get('/', async(req, res, next) =>{
    if (req.query.limit){
        try{
            const {limit} = req.query
            const prod = await ProductMng.getProducts()
            res.json(prod.slice(0,limit))
        }
        catch(error){
            return next(error)
            //res.status(400).json({mensaje: error.message})        
    }
} else{
    try{
        const prod = await ProductMng.getProducts()
        res.json(prod)
    }
    catch(error){
        next(error)
        //res.json({mensaje: error.message})
    }
}
})

productsRouter.get('/:id', async (req, res, next) => {
    try{
        const prod =await ProductMng.getProductsById(req.params.id)
        res.json(prod)
    }
    catch(error){
        next(error)
        //res.status(404).json({mensaje: error.message})
    }
})

productsRouter.post('/', async (req, res, next) =>{
    try{
        const newProd = await ProductMng.createProduct({...req.body})
        res.json(newProd)
    }
    catch(error){
        next(error)
        //res.status(404).json({mensaje: error.message})
    }
})

productsRouter.put('/:id', async (req, res, next) =>{
    try{
        const updateProd = await ProductMng.updatProduct(req.params.id, {...req.body,})
        res.json(updateProd)
    }
    catch(error){
        next(error)
        //res.status(404).json({mensaje: message.error})
    }
})

productsRouter.delete('/:id', async (req, res , next) =>{
    try{
        const delProd = await ProductMng.deleteProductId(req.params.id)
        res.json({status:'deleted', payload:delProd})
    }
    catch(error){
        next(error)
        //res.status(404).json({mensaje: message.error})
    }
})