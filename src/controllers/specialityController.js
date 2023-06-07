import specialityService from '../services/specialityService'

let createSpeciality = async (req, res) => {
    try {
        let infor = await specialityService.createSpeciality(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getAllSpeciality = async (req, res) => {
    try {
        let infor = await specialityService.getAllSpeciality(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getAllDetailSpecialityById = async (req, res) => {
    try {
        let infor = await specialityService.getAllDetailSpecialityById(req.query.id, req.query.location)
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
    createSpeciality: createSpeciality,
    getAllSpeciality: getAllSpeciality,
    getAllDetailSpecialityById: getAllDetailSpecialityById
}