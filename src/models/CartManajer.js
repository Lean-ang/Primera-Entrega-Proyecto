
import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import { IdNotFound } from '../err/err.js'
import { Cart } from './cart.js'

export class CartManager{
    #rutaProduct
    #rutaCart
    #carts
    #products
    constructor(rutaCart, RutaProduct){
        this.#rutaCart = rutaCart
        this.#rutaProduct = RutaProduct
        this.#carts = []
        this.#products = []
      
    }

    async #readProd(){
        const json = await fs.readFile(this.#rutaProduct, 'utf-8')
        this.#products = JSON.parse(json)
    }
    
    async #readCart(){
        const json = await fs.readFile(this.#rutaCart, 'utf-8')
        this.#carts = JSON.parse(json)
    }

    async #writeCart(){
        const json =JSON.stringify(this.#carts, null, 2)
        await fs.writeFile(this.#rutaCart, json)
    }

    async createCart(){
        await this.#readCart()
        const newCart= new Cart({
            id: randomUUID(),
            products : []
            })
        this.#carts.push(newCart)
        this.#writeCart()
        return newCart
    }

    async getCartById(id){
        await this.#readCart()
        const cart = this.#carts.find(cart => cart.id ===id)
        if(!cart){
            throw new Error(IdNotFound)
        }
        return cart
    }

    async addProductCart (cid, pid) {        
        await this.#readProd()
        await this.#readCart()
        const product = this.#products.find((prod) => prod.id === pid)        
        if(!product){
          throw new Error (IdNotFound)      
        }
        const cart = this.#carts.findIndex((cart) => cart.id === cid)
        if(cart === -1){
          throw new Error (IdNotFound) 
        }else{
          const index = this.#carts[cart].products.findIndex((prod) => prod.id === pid)
          if(index !== -1 ){        
            this.#carts[cart].products.splice(index,1, {...this.#carts[cart].products[index], quantity:this.#carts[cart].products[index].quantity + 1})
            await this.#writeCart()
            return this.#carts[cart].products    
          }else{
            this.#carts[cart].products.push({id:product.id, quantity:1})
            await this.#writeCart()
            return this.#carts[cart].products
          } 
        }       
      }  
} 