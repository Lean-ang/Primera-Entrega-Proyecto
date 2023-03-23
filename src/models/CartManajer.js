
import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import { IdNotFound } from '../err/err.js'
import { Cart } from './cart.js'

export class CartManager{
    #rutaPoduct
    #rutaCart
    #cart
    #products
    constructor(rutaCart, RutaProduct){
        this.#rutaCart = rutaCart
        this.#rutaPoduct = RutaProduct
        this.#cart = []
        this.#products = []
      
    }

    async #readProd(){
        const json = await fs.readFile(this.#rutaPoduct, 'utf-8')
        this.#products = JSON.parse(json)
    }
    
    async #readCart(){
        const json = await fs.readFile(this.#rutaCart, 'utf-8')
        this.#cart = JSON.parse(json)
    }

    async #writeCart(){
        const json =JSON.stringify(this.#cart, null, 2)
        await fs.writeFile(this.#rutaCart, json)
    }

    async createCart(){
        await this.#readCart()
        const newCart= new Cart({
            id: randomUUID(),
            products : []
            })
        this.#cart.push(newCart)
        await this.#writeCart()
        return newCart
    }

    async getCartById(id){
        await this.#readCart()
        const cart = this.#cart.find(cart => cart.id ===id)
        if(!cart){
            throw new Error(IdNotFound)
        }
        return cart
    }

    async addProductCart(cid, pid){
        await this.#readProd()
        await this.#readCart()
        const product = this.#products.find((prod)=> prod.id === pid)
        if(!product){
            throw new Error (IdNotFound)
        }
        const cart = this.#cart.finIndex((cart)=> cart.id === cid)
        if(!cart){
            throw new Error (IdNotFound)
        }
        else{
            const index = this.#cart[cart].products.findIndex((prod)=> prod.id === pid)
            if(index !== -1){
                this.#cart[cart].products.splice(index, 1, {...this.#cart[cart].products[index], quantity:this.#cart[cart].products[index].quatity + 1})
                await this.#writeCart()
                return this.#cart[cart].products
            }
            else{
                this.#cart[cart].products.push({id:product.id, quantity:1})
                await this.#writeCart()
                return this.#cart[cart].products
            }
        }
    }
}