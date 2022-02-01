const axios = require('axios');
const {Establishment, Site} = require('../db');
const { createSite } = require('./site');


const getEstablishmentsFromDB = async(searchBarName)=>{

    let establishmentDB = await Establishment.findAll({
        include: {
            model: Site,
            attributes: ['name'],
            through:{
                attributes:[],
            }
        }
    })
    if(searchBarName!==''){
        establishmentDB = establishmentDB.filter(establishment => establishment.name.toLowerCase().includes(searchBarName));
    }

    establishmentDB = establishmentDB.map(establishment => {
        return{
            id: establishment.id,
            name: establishment.name,
            logoImage: establishment.logoImage,
            rating: establishment.rating,
            timeActiveFrom: establishment.timeActiveFrom,
            timeActiveTo: establishment.timeActiveTo,
            responsable_id: establishment.responsable_id,
            sites: establishment.sites
        }
    })

    return establishmentDB;
}


const createEstablishment = async (req, res, next)=>{

    const {id,name,logoImage,rating, timeActiveFrom, timeActiveTo, responsable_id} = req.body

    // creo el establecimiento

    let establishmentDB = await Establishment.findOne({
        where : {id: id}
    })

    try {
        if(!establishmentDB){
            let establishmentCreated = await Establishment.create({
                id,
                name,
                logoImage,
                rating,
                timeActiveFrom,
                timeActiveTo,
                responsable_id
            })

            res.send('establishment created')
        }
        else{
            res.status(404).send('establishment already exist')
        }
    } catch (error) {
        next(error)
    }
    

}

module.exports = {getEstablishmentsFromDB, createEstablishment}