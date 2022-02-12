const { date } = require("joi");
const { User, Establishment, Site, Court, Booking, Op } = require("../db");

const getAllBookings = async (req, res, next) => {
  try {
    const all = await Booking.findAll();

    res.status(200).json(all);
  } catch (e) {
    next(e);
  }
};

const newBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { infoBooking } = req.body;

    infoBooking.userId = userId;
    // si horario de inicio y cancha coinciden con alguno creado dar error
    // console.log(infoBooking.startTime)
    // const itsNotAvailable = await Booking.findOne({
    //   where: {
    //     startTime: infoBooking.startTime,
    //     courtId: infoBooking.courtId
    //   }
    // });
    // console.log(itsNotAvailable);
    // if (itsNotAvailable) {
    //   res.status(409).send("Conflict - There is a previous booking scheduled");
    // //
    // "startTime": "2022-02-13T18:30:00.000Z",
    // "endTime": "2022-02-13T19:00:00.000Z",
    // "description": "aca van las aclaraciones q quiera hacer el user",
    // "courtId": 1,
    // "finalAmount": 50

    const newBooking = await Booking.create(infoBooking);
    console.log(newBooking.startTime.getHours());
    res.status(200).json(newBooking);
  } catch (e) {
    next(e);
  }
};

const getCourtAvailability = async (req, res, next) => {
  try {
    //     buscar el horarios apertura y cierre del establ
    const courtId = req.params.id;
    const dateToCheck = req.query.date;
    const infoCourt = await Court.findOne({
      where: { id: courtId },
      include: [
        {
          model: Site,
          as: "site",
          attributes: ["id", "street", "streetNumber"],
          include: {
            model: Establishment,
            as: "establishment",
            attributes: ["timeActiveFrom", "timeActiveTo"],
          },
        },
      ],
    });
    console.log("precio", infoCourt.id,  infoCourt.site.establishment.timeActiveFrom);

    let [activeFromHour, activeFromMin] =
      infoCourt.site.establishment.timeActiveFrom.split(":");
    let [activeToHour, activeToMin] =
      infoCourt.site.establishment.timeActiveTo.split(":");
    
      //calculo el largo del dia de trabajo en minutos de inicio y de fin
    activeTo = parseInt(activeToHour) * 60 + parseInt(activeToMin);
    activeFrom = parseInt(activeFromHour) * 60 - parseInt(activeFromMin);

    //     la duracion del dia de trabajo del court en minutos
    let businessHoursInMinutes = activeTo - activeFrom;
    //     dividir las horas abiertas por la duracion de los turno y me da cuantos slots son
    //2022-02-12 con esta fecha traer las reservas de esa cancha
    //traer el el dia completo de reservas de esa cancha
    let [year, month, day] = dateToCheck.split("-");
    let searchFromDate = new Date(year, month - 1, day);
    let searchToDate = new Date(year, month - 1, day, 23, 59);

    const dayBookings = await Booking.findAll({
      where: {
        [Op.and]: [
          {
            courtId: infoCourt.id,
          },
          {
            startTime: {
              [Op.between]: [searchFromDate, searchToDate],
            },
          },
        ],
      },
    });
    console.log("reservas del dia", dayBookings.length);
    let slotsQuantity = businessHoursInMinutes/infoCourt.shiftLength
    console.log('cantidad de turnos en el dia',slotsQuantity)
    let availability = []
    
        // console.log(dayBookings)
    for(let i = 0; i < slotsQuantity; i++) {
      let startSlotMin = activeFrom + (i * infoCourt.shiftLength)
      let endSlotMin = startSlotMin + infoCourt.shiftLength

      let start = minutesToHour(startSlotMin)
      let end = minutesToHour(endSlotMin)
      let [stHour, stMin] = start.split(':') 

      let compareDate = new Date (year, month-1, day, stHour, stMin, 00)
      //console.log('comparo aca', (compareDate.getTime()) === dayBookings[0].startTime.getTime())

      let available = dayBookings.filter(el => el.startTime.getTime() === compareDate.getTime())
      //calcular inicio fin crear fecha ver si esta disponivble y  pushear el objeto con las 3 cosas
     // slots.push({})
      let isAvailable = available.length ? false : true;
      availability.push({
        date: dateToCheck,
        startTime: start,
        endTime: end,
        isAvailable: isAvailable 
      })
      
    }
    
    res.status(200).json([dayBookings, availability]);
  } catch (e) {
    next(e);
  }
};

function minutesToHour(min){
  let newMin = min%60 ? min%60 : '00'
  let newHour = (min-newMin)/60
  
  return newHour + ':' + newMin
}
module.exports = {
  getAllBookings,
  newBooking,
  getCourtAvailability,
};