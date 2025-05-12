'use strict'

const { BadRequestError } = require('../core/errror.response')
const {product, electronic, clothing, furniture} = require('../models/product.model')
const {findAllDraftForShop, findAllPublishForShop, publishProductByShop, unPublishProductByShop} = require('../repository/product.repository')

// define class Factory patten to  create new product
class ProductService {
    static productRegistry = {}
    static registerProductType(type, classRef) {
        ProductService.productRegistry[type] = classRef
    }
    static async createProduct (type, payload) {
        const productClass = ProductService.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product class ${productClass}`)
        return new productClass(payload).createProduct()
    }
    static async findAllDraftForShop({product_shop, limit = 50, skip=0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftForShop({query, limit, skip})
    }
    static async findAllPublishForShop({product_shop, limit = 50, skip=0}) {
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip})
    }
    static async publishProductByShop ({product_shop, product_id}) {
        return publishProductByShop({product_shop, product_id})
    }
    static async unPublishProductByShop ({product_shop, product_id}) {
        return unPublishProductByShop({product_shop, product_id})
    }
}

//define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_desc,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_desc = product_desc,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes 
    }

    // create new product
    async createProduct (product_id) {
        return await product.create({...this, _id: product_id})
    }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct () {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError("Create Clothing error")
        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError("Create Product error")
        return newProduct
    }
}
    
class Electronic extends Product {
    async createProduct () {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError("Create Clothing error")
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError("Create Product error")
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct () {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError("Create Clothing error")
        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError("Create Product error")
        return newProduct
    }
}

ProductService.registerProductType('Electronic', Electronic)
ProductService.registerProductType('Furniture', Furniture)
ProductService.registerProductType('Clothing', Clothing)

module.exports = ProductService