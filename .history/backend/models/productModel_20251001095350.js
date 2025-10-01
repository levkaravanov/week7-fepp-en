const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  company: {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true }
  }
});


//add  virtual field id
productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

