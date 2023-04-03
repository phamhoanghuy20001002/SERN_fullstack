import express from "express";
import homeController from "../controllers/homeController";
let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/huypham', (req, res) => {
        return res.send('page huy pham')
    });
    return app.use("/", router);
}
module.exports = initWebRoutes;