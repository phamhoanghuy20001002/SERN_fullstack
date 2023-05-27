import usersService from "../services/userServices";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs'
        })
    }
    let userData = await usersService.handUserLogin(email, password)
    //check email exist
    //compare password
    // return userInfo
    //access token:jwt (json web token)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleGetAllUser = async (req, res) => {
    let id = req.query.id;// all, id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }
    let users = await usersService.getAllUser(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await usersService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}
let handleUpdateUser = async (req, res) => {
    let message = await usersService.updateUser(req.body);

    return res.status(200).json(message);
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameters!"
        })
    }
    let message = await usersService.deleteUser(req.body.id);

    return res.status(200).json(message);

}
let getAllCode = async (req, res) => {
    try {
        let data = await usersService.getAllCodeService(req.query.type);
        return res.status(200).json(data)
    } catch (error) {
        console.log('get all code error:', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'ERROR from server'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleUpdateUser: handleUpdateUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode
}