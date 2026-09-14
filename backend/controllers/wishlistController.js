const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    res.json({ success: true, wishlist: wishlist || { user: req.user._id, products: [] } });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    if (wishlist.products.some((id) => id.toString() === productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const populated = await wishlist.populate('products');
    res.status(201).json({ success: true, wishlist: populated });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter((productId) => productId.toString() !== req.params.id);
    await wishlist.save();

    const populated = await wishlist.populate('products');
    res.json({ success: true, wishlist: populated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
