const { SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")


class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new Product success",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // QUERY
    /**
     * 
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @return {Number} skip
     * @return {JSON}
     */
    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list success",
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list success",
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product success",
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublish product success",
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    
    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Search product success",
            metadata: await ProductService.searchProduct(
                req.params
            )
        }).send(res)
    }
 }

module.exports = new ProductController()