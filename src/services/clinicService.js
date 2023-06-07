const db = require("../models")
let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter clinic'
                })
            } else {
                await db.Clinics.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })

}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinics.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (error) {
            reject(error)
        }
    })

}
let getAllDetailClinicById = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter clinic'
                })
            } else {
                let data = await db.Clinics.findOne({
                    where: {
                        id: inputData
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'address', 'image']
                })
                data.image = new Buffer(data.image, 'base64').toString('binary');

                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_infor.findAll({
                        where: { clinicId: inputData },
                        attributes: ['doctorId']

                    })
                    data.doctorClinic = doctorClinic;

                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data
                })
            }


        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getAllDetailClinicById: getAllDetailClinicById
}