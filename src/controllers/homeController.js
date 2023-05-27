import db from "../models/index";
import CRUDservice from "../services/CRUDservice";
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error)
    }
}

let getCrud = (req, res) => {
    return res.render('crud.ejs')

}
let postCrud = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    console.log(message)
    return res.send('post crud from server');

}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', {
        datatable: data
    })
}
let getEditCRUD = async (req, res) => {
    let userid = req.query.id;
    if (userid) {
        let userData = await CRUDservice.getUserInfoById(userid)
        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else {
        return res.send('user no found');
    }

    return res.send('heelllloooo');
}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDservice.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        datatable: allUsers
    })

}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        let deleteUser = await CRUDservice.deleteUserById(id);
        return res.send('delete the user')
    }
    else return res.send('not found');


}
module.exports = {
    getHomePage: getHomePage,
    getCrud: getCrud,
    postCrud: postCrud,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}