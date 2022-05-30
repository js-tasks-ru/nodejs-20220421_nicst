const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const {Types} = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const products = await Product.find({subcategory}).exec();
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.request.params;
  if (!id) return next();
  const {ObjectId} = Types;


  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const product = await Product.findById(id);
  if (!product) {
    ctx.status = 404;
  } else {
    ctx.body = {product: mapProduct(product)};
  }
};

