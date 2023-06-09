import db from "../models/index";
import _, { reject } from 'lodash'
require('dotenv').config();
import emailService from '../services/emailService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            let user = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                ],
                raw: true,
                nest: true,

            })
            resolve({
                errCode: 0,
                data: user
            })

        } catch (error) {
            reject(error);
        }
    })
}
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctor
            })
        } catch (error) {
            reject(error)
        }
    })
}
let checkRequiredFields = (inputdata) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkDown',
        'actions', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameClinic', 'addressClinic', 'specialtyId'
    ]
    let isVaild = true;
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputdata[arr[i]]) {
            isVaild = false;
            element = arr[i]
            break;
        }
    }
    return {
        isVaild: isVaild,
        element: element
    }
}
let saveDetailInfoDoctor = (inputdata) => {
    return new Promise(async (resolve, reject) => {

        try {
            let checkObj = checkRequiredFields(inputdata)
            if (checkObj.isVaild === false) {

                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter:${checkObj.element}`
                })
            } else {
                //upsert to markdown
                if (inputdata.actions === 'CREATE') {
                    await db.markdown.create({
                        contentHTML: inputdata.contentHTML,
                        contentMarkDown: inputdata.contentMarkDown,
                        description: inputdata.description,
                        doctorId: inputdata.doctorId
                    })
                }
                else if (inputdata.actions === 'EDIT') {
                    let doctorMarkdown = await db.markdown.findOne({
                        where: { doctorId: inputdata.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputdata.contentHTML;
                        doctorMarkdown.contentMarkDown = inputdata.contentMarkDown;
                        doctorMarkdown.description = inputdata.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }
                let doctorInfor = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: inputdata.doctorId,

                    },
                    raw: false
                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputdata.doctorId
                    doctorInfor.priceId = inputdata.selectedPrice;
                    doctorInfor.provinceId = inputdata.selectedProvince;
                    doctorInfor.paymentId = inputdata.selectedPayment;
                    doctorInfor.addressClinic = inputdata.addressClinic;
                    doctorInfor.nameClinic = inputdata.nameClinic;
                    doctorInfor.note = inputdata.note;
                    doctorInfor.specialtyId = inputdata.specialtyId
                    doctorInfor.clinicId = inputdata.clinicId

                    await doctorInfor.save()

                } else {
                    //create
                    await db.Doctor_infor.create({
                        doctorId: inputdata.doctorId,
                        priceId: inputdata.selectedPrice,
                        provinceId: inputdata.selectedProvince,
                        paymentId: inputdata.selectedPayment,
                        addressClinic: inputdata.addressClinic,
                        nameClinic: inputdata.nameClinic,
                        note: inputdata.note,
                        specialtyId: inputdata.specialtyId,
                        clinicId: inputdata.clinicId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'save success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })

            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.markdown, attributes: ['description', 'contentHTML', 'contentMarkDown'] },
                        { model: db.Allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']

                            },
                            include: [
                                { model: db.Allcodes, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },

                    ],
                    raw: false,
                    nest: true,
                }
                )



                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let bulkCreateSchedules = (data) => {
    return new Promise(async (resolve, reject) => {
        try {


            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter param'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    },

                )
                // convert date

                // compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)

                }
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
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcodes, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true,
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']

                    },
                    include: [
                        { model: db.Allcodes, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcodes, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcodes, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.markdown, attributes: ['description', 'contentHTML', 'contentMarkDown'] },

                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']

                            },
                            include: [
                                { model: db.Allcodes, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },

                    ],
                    raw: false,
                    nest: true,
                }
                )
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Bookings.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    // group: ['timeType'],

                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'lastName', 'gender'],
                            include: [{ model: db.Allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },]

                        },
                        {
                            model: db.Allcodes, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'],


                        }



                    ],
                    raw: false,
                    nest: true,
                }
                )

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType
                || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter '
                })
            } else {
                let appointment = await db.Bookings.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                await emailService.sendAttachment(data);
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
module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateSchedules: bulkCreateSchedules,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}