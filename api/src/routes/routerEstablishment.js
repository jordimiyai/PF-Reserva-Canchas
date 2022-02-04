const { Router } = require('express');
const router = Router();
const validator = require('express-joi-validation').createValidator({})
const Joi = require('joi')
const {getEstablishmentsFromDB, createEstablishment, getEstablishmentsName, addUsertoEstablishment, getEstabIdByUserId} = require('../controllers/establishment.js');

const bodySchema = Joi.object({
    id: Joi.string().regex(/^[0-9]+$/).required(),
    userId: Joi.number(),
    name: Joi.string().regex(/^[a-zA-Z0-9 :]+$/).min(2).max(40).required(),
    logoImage: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/).min(8).allow(''),
    timeActiveFrom: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
    timeActiveTo: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
    
})

router.get('/:userId', getEstabIdByUserId )
router.get('/',getEstablishmentsFromDB)
router.post('/', validator.body(bodySchema), createEstablishment)
router.get('/', getEstablishmentsName)
router.post('/addUser/:establishmentId', addUsertoEstablishment)

module.exports = router