"use strict";

const { BadRequestError } = require("../core/errror.response");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../repository/inventory.repository");
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProduct,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../repository/product.repository");
const { removeUndefineObject, updateNestedObjectParser } = require("../utils");
// define class Factory patten to  create new product
class ProductService {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductService.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductService.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product class ${productClass}`);
    return new productClass(payload).createProduct();
  }
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  static async searchProduct({ keyword }) {
    return await searchProduct({ keyword });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
  static async updateProduct(payload, product_id, type) {
    const productClass = ProductService.productRegistry[type];
    if (!productClass)
      if (!productClass)
        throw new BadRequestError(`Invalid product class ${productClass}`);
    return new productClass(payload).updateProduct(product_id);
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
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_desc = product_desc),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({ product_id, bodyUpdate, model: product });
  }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create Clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create Product error");
    return newProduct;
  }
  async updateProduct(product_id) {
    const objectParams = removeUndefineObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }
    const result = await super.updateProduct(product_id, objectParams);
    return result;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Create Clothing error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create Product error");
    return newProduct;
  }
  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      });
    }
    const result = await super.updateProduct(product_id, objectParams);
    return result;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create Clothing error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create Product error");
    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = this;

    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furniture,
      });
    }

    const result = await super.updateProduct(product_id, objectParams);

    return result;
  }
}

ProductService.registerProductType("Electronic", Electronic);
ProductService.registerProductType("Furniture", Furniture);
ProductService.registerProductType("Clothing", Clothing);

module.exports = ProductService;
