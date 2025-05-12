'use strict'

const {product, electronic, furniture, clothing} = require('../models/product.model')
const {Types, model} = require('mongoose')

const findAllDraftForShop = async ({query, limit, skip}) => {
    return await queryProduct({query,limit,product})
}

const findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct({query,limit,product})
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop ),
        _id: new Types.ObjectId(product_id)
    })  
    if(!foundShop) return null
    const {modifiedCount} = await foundShop.updateOne({
        $set: {
            isDraft: false,
            isPublished: true
        }
    })
    return modifiedCount
}

const unPublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop ),
        _id: new Types.ObjectId(product_id)
    })  
    if(!foundShop) return null
    const {modifiedCount} = await foundShop.updateOne({
        $set: {
            isDraft: true,
            isPublished: false
        }
    })
    return modifiedCount
}

const searchProduct = async ({keyword}) => {
    const regexSearch = new RegExp(keyword)
    const results = await product.find({
        isPublished: true,
        $text: {$search: regexSearch}},  
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .lean()
    return results
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
                        .populate('product_shop', 'name email -_id') // join with Shop // same JOIN in SQL
                        .sort({updateAt: -1})
                        .skip(skip)
                        .limit(limit)
                        .lean()
                        .exec()
}


module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProduct
}