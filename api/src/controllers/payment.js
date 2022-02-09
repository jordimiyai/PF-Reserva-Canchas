const { Order } = require("../db");

const payment = async (req,res,next)=>{

 const  {establishmentId,courtId,courtPrice,email, idOrder} = req.body

 const order = parseInt(idOrder);

 let product = {
    courtId:courtId,
    title: establishmentId + '-' + courtId,
    courtPrice: courtPrice,
    quantity: 1,
    currency_id: "ARS"

  }

  try {

    let preference = {
        items: product,
        external_reference: `${order}`,
        back_urls: {
            success: `http://localhost:3001/orders/mercadopago/pagos/${email}`,
            pending: `http://localhost:3001/orders/mercadopago/pagos/${email}`,
            failure: `http://localhost:3001/orders/mercadopago/pagos/${email}`,
        },
        auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference)

    Order.findByPk(idOrder)
        .then((order) => {
            order.payment_link = response.body.init_point
            order.address = inputAndress
            order.save()
        })

    res.send({ mpLink: response.body.init_point, mpId: response.body.id })
  }
  catch (error) {
    res.send(error)
  }
}


//////////////

server.get("/mercadopago/pagos/:email", (req, res) => {
  const payment_id = req.query.payment_id
  const payment_status = req.query.status
  const external_reference = req.query.external_reference
  const merchant_order_id = req.query.merchant_order_id
  const payment_method = 'mercadopago'

  Shoppingcart.findByPk(external_reference, { include: [{ model: Lineorder, include: [{ model: Product }] }] })
      .then((order) => {
          let handleStock = order.dataValues.lineorders.map(l => ({ id: l.dataValues.product.id_product, quantity: l.dataValues.quantity }));

          handleStock.forEach(element => {
              Product.findByPk(element.id)
                  .then((prod) => {
                      prod.stock = prod.stock - element.quantity;
                      prod.save();
                  });
          });
      })

  Shoppingcart.findByPk(external_reference)
      .then((order) => {
          order.payment_id = payment_id
          order.payment_status = payment_status
          order.merchant_order_id = merchant_order_id
          order.status = payment_status
          order.state = payment_status === "approved" ? "fullfilled" : "pending"
          order.payment_method = payment_method
          order.save()
              .then((_) => {
                  console.info('redirect success')
                  if (order.state === "fullfilled") {
                      const body = `<div>Hola,</div>
                                    <div>Tu compra se ha realizado con éxito</div>
                                    <div>El número de orden es : ${external_reference}</div>
                                    <div><h3>artHub</h3></div>
                                    <div>arte en su máxima expresión</div>`
                      sendEmail('Compra exitosa', body, req.params.email)
                      return res.redirect(`http://localhost:3000/carritocomprado/${external_reference}/fullfilled`)
                  } else {
                      return res.redirect(`http://localhost:3000/carritocomprado/${external_reference}/pending`)
                  }
              })
              .catch((err) => {
                  return res.redirect(`http://localhost:3000/miperfil`)
              })
      })
      .catch(err => {
          return res.redirect(`http://localhost:3000`)
      })

})















