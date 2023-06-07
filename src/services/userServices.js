import db from "../models/index";
import bcrypt, { hash } from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
let handUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id'],
                    where: { email: email },
                    raw: true

                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }

            } else {
                userData.errCode = 1;
                userData.errMessage = `your's email isn't exist in your system.Plz try other email`;

            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error);
        }

    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch (error) {
            reject(error);
        }

    })
}
let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = '';

            if (userId === 'ALL') {
                user = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } if (userId && userId !== 'ALL') {
                user =
                    await db.User.findOne({
                        where: { id: userId },
                        attributes: {
                            exclude: ['password']
                        }
                    })
            }

            resolve(user)
        } catch (error) {
            reject(error);
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'your email is exist,plz try other email'
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar

                })
                resolve({
                    errCode: 0,
                    message: 'ok'

                })
            }

        } catch (error) {
            reject(error);
        }
    })
}
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'MISSING REQUIRED PARAMETERS'
                })

            }
            let user = await db.User.findOne({
                where: {
                    id: data.id,

                },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                if (data.avatar) {
                    user.image = data.avatar;

                }

                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update the user success!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                })
            }

        } catch (error) {
            reject(error)

        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `the user isn't exist`
            })
        }
        // await user.destroy();
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: `user was delete`
        })
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeInput) {


                let res = {};
                let allcodes = await db.Allcodes.findAll({
                    where: { type: typeInput }
                });

                res.errCode = 0;
                res.data = allcodes;
                resolve(res);
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'missing require parameter'
                })
            }


        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    handUserLogin: handUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,
}