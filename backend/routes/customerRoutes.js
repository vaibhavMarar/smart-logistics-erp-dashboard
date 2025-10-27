const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

router.get('/customers', getCustomers);
router.get('/customers/:led_cd', getCustomerById);
router.post('/customers', addCustomer);
router.put('/customers/:led_cd', updateCustomer);
router.delete('/customers/:led_cd', deleteCustomer);

module.exports = router;