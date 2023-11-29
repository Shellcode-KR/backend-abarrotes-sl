const validatorHandler = require('../middlewares/validator.handler');
const { Router } = require('express');
const SaleService = require('../services/sale.service');
const { createSaleSchema,
    getSaleSchema, addItemSchema } = require('../schemas/sale.schema');
const passport = require('passport');
const { checkRoles } = require('../middlewares/auth.handler');
const router = Router()
const service = new SaleService()

router.get('/',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin', 'employee'),
    async (req, res, next) => {
        try {
            const sales = await service.find()
            res.json(sales)
        } catch (error) {
            next(error)
        }
    })

router.get('/totales', async (req, res, next) => {
    try {
        // TODO: CALCULAR LOS TOTALES DE LAS VENTAS
        const total = await service.getTotalSales()
        res.json({
            totalVentas: total
        })
    } catch (error) {
        next(error)
    }
})


router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin', 'employee'),
    validatorHandler(getSaleSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params
            const sale = await service.findOne(id)
            res.json(sale)
        } catch (error) {
            next(error)
        }
    })

router.post('/',
    //passport.authenticate('jwt', { session: false }),
    //checkRoles('admin', 'employee'),
    validatorHandler(createSaleSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body
            const newSale = await service.create(data)
            res.json(newSale)

        } catch (error) {
            next(error)
        }
    })

router.post('/add-item',
    //passport.authenticate('jwt', { session: false }),
    //checkRoles('admin', 'employee'),
    validatorHandler(addItemSchema, 'body'), async (req, res, next) => {
        try {
            const body = req.body
            const newItem = await service.addItem(body)
            res.status(201).json({
                message: "Nuevo item agregado a la venta",
                ...newItem
            })
        } catch (error) {
            next(error)
        }
    })



module.exports = router
