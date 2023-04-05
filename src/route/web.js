import express from "express";
import homeController from "../controllers/homeController"
let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCrud);
    router.post('/post-crud', homeController.postCrud);


    return app.use("/", router);

}
module.exports = initWebRoutes;