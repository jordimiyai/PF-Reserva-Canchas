const { Court, Site, Establishment} = require ('../db');

const findBySport = async (req, res) => { 
    const {sport} = req.query

    try {
        var courts = await Court.findAll({
            where:{
              sport: sport
            },
            attributes: { exclude: ['createdAt','updatedAt'] }
          })
        for(var i = 0; i<courts.length ; i++){
            var site = await Site.findOne({
                where: { id: courts[i].siteId},
                attributes: ['name', 'id', 'establishmentId','street', 'streetNumber', 'city']
              })
            courts[i]= {...courts[i].dataValues, site}
        }
        for(var i=0; i<courts.length ; i++){
            var establishment = await Establishment.findOne({
                where: { id: courts[i].site.establishmentId},
                attributes: ['name', 'id', 'timeActiveFrom', 'timeActiveTo']
            })
            courts[i]= {...courts[i], establishment}
        }
      res.send(courts)
    } catch (e) {
      console.log(e)
      res.send(e)
    }
  }

module.exports= { findBySport }