const express = require('express');
const { getAllVouchers, applyVoucher, createVoucher, activateVoucher, deactivateVoucher, deleteVoucher } = require('../Controller/VoucherController');
const VoucherRouter = express.Router();


// Route to create a tag

VoucherRouter.get('/vouchers', getAllVouchers)
VoucherRouter.post('/apply-vouchers', applyVoucher)
VoucherRouter.post('/vouchers/create-vouchers', createVoucher)
VoucherRouter.put('/vouchers/activateVoucher/:id', activateVoucher)
VoucherRouter.put('/vouchers/deactivateVoucher/:id', deactivateVoucher)
VoucherRouter.delete('/vouchers/deleteVoucher/:id', deleteVoucher)

module.exports = VoucherRouter;
