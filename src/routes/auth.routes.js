const { Router } = require('express');
const Joi = require('joi');
const passport = require('passport');
const validatorHandler = require('../middlewares/validator.handler');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

const UsersService = require('../services/user.service');
const { createEmployeeSchema } = require('../schemas/employee.schema');
const EmployeesService = require('../services/employee.service');

const router = Router()
const service = new UsersService()
const empService = new EmployeesService()

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

router.post('/login', validatorHandler(loginSchema, 'body'),
    passport.authenticate('local', {
       session: false
    }),
    async (req, res, next) => {
        try {
            const user = req.user
            const payload = {
                sub: user.id,
                role: user.role,
            }
            const token = jwt.sign(payload, config.jwtSecret)
            res.json({
                user, token
            })
        } catch (error) {
            next(error)
        }
    })

router.get('/profile-user', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const user = req.user
        const id = user.sub
        const info = await service.findOne(id)
        delete info.dataValues.password
        res.json(info)
    } catch (error) {
        next(error)
    }
})


/// este endpoint solo se ocupa para crear tu usuario administrador la primera vez que usas la api
router.post('/create-user', validatorHandler(createEmployeeSchema, 'body'), async (req, res, next) => {
    try {
        const data = req.body
        const dataAdmin = {
            ...data,
            user: {
                ...data.user,
                role: "admin"
            }
        }
        const newUser = await empService.create(dataAdmin)
        res.status(201).json({
            message: "Usuario administrador creado",
            newUser
        })
        // crear el empleado con su usuario
    } catch (error) {
        next(error)
    }
})

module.exports = router
