const { Router } = require("express");
const validatorHandler = require('../middlewares/validator.handler');
const { queryReportMonthSchema, queryReportDaySchema } = require('../schemas/reports.schema');
const { checkRoles } = require("../middlewares/auth.handler");
const passport = require("passport");
const ReportService = require('../services/reports.service');

const router = Router()
const service = new ReportService()

router.get('/month',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    validatorHandler(queryReportMonthSchema, 'body'), async (req, res, next) => {
    try {
        const sales = await service.perMonth(req.body);
        res.status(200).json(sales)
    } catch (error) {
        next(error)
    }
})

router.get('/day',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    validatorHandler(queryReportDaySchema, 'body'), async (req, res, next) => {
    try {
        const sales = await service.perDay(req.body);
        res.status(200).json(sales)
    } catch (error) {
        next(error)
    }
})

// Cambié el método de 'get' a 'post' en las rutas
router.post('/month',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    validatorHandler(queryReportMonthSchema, 'body'), async (req, res, next) => {
    try {
        const sales = await service.perMonth(req.body);
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
});

router.post('/day',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    validatorHandler(queryReportDaySchema, 'body'), async (req, res, next) => {
    try {
        const sales = await service.perDay(req.body);
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
});

module.exports = router
