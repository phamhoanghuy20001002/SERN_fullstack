require('dotenv').config();
//const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer'
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Huy Pham 👻" <huy.pho.60cntt@ntu.edu.vn>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
}


let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
            <h3> Xin chào  ${dataSend.patientName}</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Bệnh viện</p>
            <p>thông tin đặt lịch khám bệnh</p>
            <div><b>Thời gian:${dataSend.time}</b></div>
            <div><b>Bác sĩ:${dataSend.doctorName}</b></div>

            <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác
            nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
            <div>
            <a href=${dataSend.redicrectLink} target="_blank">Click here</a>
            <div> Xin chân thành cảm ơn</div>
            </div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
            <h3> Dear ${dataSend.patientName}</h3>
            <p>You received this email because you booked an online medical appointment at the Hospital
            </p>
            <p>medical appointment booking information</p>
            <div><b>Time:${dataSend.time}</b></div>
            <div><b>Doctor's Name:${dataSend.doctorName}</b></div>

            <p>If the above information is true, please click on the link below to confirm
            Receive and complete the procedure to make an appointment for medical examination</p>
            <div>
            <a href=${dataSend.redicrectLink} target="_blank">Click here</a>
            <div> Xin chân thành cảm ơn
            Thank you
        `
    }
    return result

}


module.exports = {
    sendSimpleEmail: sendSimpleEmail
}