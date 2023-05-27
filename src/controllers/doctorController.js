import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;

    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }

}
let getAllDoctor = async (req, res) => {
    try {
        let doctor = await doctorService.getAllDoctors();
        return res.status(200).json(doctor)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}
let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {

        let infor = await doctorService.getDetailDoctorByIdService(req.query.id)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedules(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById
}