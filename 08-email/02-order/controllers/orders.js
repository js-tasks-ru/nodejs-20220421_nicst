const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {
    user,
    request: {
      body: {
        product,
        phone,
        address,
      },
    },
  } = ctx;

  try {
    const order = await Order.create({
      user: user._id,
      product,
      phone,
      address,
    });

    await sendMail({
      to: user.email,
      template: 'order-confirmation',
      locals: {
        id: order._id,
        product: await Product.findById(product),
      },
    });

    ctx.body = {
      order: order._id,
    };
  } catch ({errors}) {
    ctx.status = 400;
    ctx.body = {
      errors: Object.keys(errors).reduce((acc, current) => ({
        ...acc,
        [current]: errors[current].toString(),
      }), {})};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const {
    user: {
      _id: userId,
    },
  } = ctx;
  const orders = await Order.find({user: userId});
  await Order.populate(orders, {path: 'product'} );
  ctx.body = {orders};
};
