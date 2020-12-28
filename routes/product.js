const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/product');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);

router.post(
    '/',
    [
        body('name').trim().isLength({ min: 5 }),
        body('description').trim().isLength({ min: 5 }),
        body('type').trim().isLength({ min: 3 }),
    ],
    productController.createProduct
);

router.put(
    '/:productId',
    [
        body('name').trim().isLength({ min: 5 }),
        body('description').trim().isLength({ min: 5 }),
        body('type').trim().isLength({ min: 3 }),
    ],
    productController.updateProduct
);

router.delete('/:productId', productController.deleteProduct);

module.exports = router;
