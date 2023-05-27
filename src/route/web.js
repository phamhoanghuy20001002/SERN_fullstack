import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController'
let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCrud);

    router.post('/post-crud', homeController.postCrud);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);

    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/update-user', userController.handleUpdateUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/get-allcodes', userController.getAllCode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctor', doctorController.getAllDoctor)
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    return app.use("/", router);

}
module.exports = initWebRoutes;