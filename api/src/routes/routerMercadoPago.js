const { createPreference, createOrder } =  require('../controllers/mercadopago.js');
const router = require('express').Router();

//Ruta que genera la URL de MercadoPago
router.post("/", createPreference) 

//Ruta que recibe la información del pago y crea la orden
router.get("/pagos/:userId/:courtId", createOrder)


module.exports = router;