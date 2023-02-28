import express from "express";
import dealTexasHoldEm from "../modules/pokerHandler.js";
const router = express.Router();

router.get('/new',(req, res, next) => {
    const deal = dealTexasHoldEm(3)
    res.json(deal);

});

router.use((req, res, next) => {
    res.status(404).send(`404 not found`);
});

export { router }