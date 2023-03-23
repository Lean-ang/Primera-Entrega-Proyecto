import fs from "fs";
import { randomUUID } from "crypto"
import { Product } from "./Products.js"
import {IdNotFound, Empty, CodeRepeat} from '../err/err.js'

export default class ProductManager {
    #path
    #products
    constructor(path) {
        this.#path = path
        this.#products =[]
    }

    //leer
    async #readingJSON(){    
            const data = await fs.promises.readFile(this.#path, 'utf-8')
            this.#products = JSON.parse(data)                
    }

    //escribir
    async #writingSave(){
            const dataJSON = JSON.stringify(this.#products, null, 2)
             await fs.promises.writeFile(this.#path, dataJSON)   
    }

    //guardar
    async dataSaving(item){
        await this.#readingJSON()
        this.#products.push(item)
        await this.#writingSave()
        return item 
    }

    //buscar
    async getProducts(){
        await this.#readingJSON()
        if (this.#products.length === 0){
        throw new Error(Empty)
    }
        return this.#products
    }

    //buscar por id
    async getProductsById(id){       
            await this.#readingJSON()
            const prod = this.#products.find(prod => prod.id === id)
            if (!prod){
               throw new Error(IdNotFound)
            }
            return prod
        }

    //añadir
    async createProduct({
        title,
        description,
        stock,
        code,
        price,
        thumbnails,   
        id = randomUUID(),
      }) {
        await this.#readingJSON()
        const newProduct = new Product({
          title,
          description,
          stock,
          code,
          price,
          thumbnails,
          id,
        });
        const product = this.#products.find(prod => prod.code === newProduct.code)
        if (product) {
          throw new Error(CodeRepeat);
        }
        this.#products.push(newProduct)
        await this.#writingSave()
        return newProduct;
      }

    //Remplazar
    async updatProduct(id, newItem){
        await this.#readingJSON()
        const index = this.#products.findIndex(prod => prod.id === id)
        if (index === -1){
            throw new Error(IdNotFound)
        }
        this.#products[index] = newItem
        await this.#writingSave()
        return newItem
        
    }
    //Borrar
    async deleteProductId(id){
        await this.#readingJSON()
        const index = this.#products.findIndex(prod => prod.id === id)
        if (index === -1){
            throw new Error(IdNotFound)
        }
        const [del] = this.#products.splice(index, 1)
        await this.#readingJSON()
        return del      
    }
    
}


