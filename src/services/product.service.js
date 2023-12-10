const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class ProductsService {

    constructor() {

    }

    async create(data) {
        const newProduct = await models.Product.create(data, {
            include: ['category', 'provider'],

        })
        return newProduct
    }

    async update(id, changes) {
        const product = this.findOne(id)
        const newProd = (await product).update(changes)
        return newProd
    }
    async delete(id) {
        const producto = await this.findOne(id);
        await producto.destroy();
        return {
            message: "Producto eliminado"
        }
    }
    
    async findOne(id) {
        const product = await models.Product.findByPk(id, {
            include: ['category', 'provider']
        })
        if (!product) {
            throw boom.notFound("Producto no encontrado")
        }
        return product
    }
    async findBy(data) {
        if ('id' in data) {
            // Buscar por id
            const product = await models.Product.findByPk(data.id, {
                include: ['category', 'provider']
            });
            if (!product) {
                throw boom.notFound("Producto no encontrado");
            }
            return product;
        }else if('barCode' in data){
            // Buscar por codigo de barras
            const products = await models.Product.findAll({
                where: {
                    barCode: data.barCode
                },
                include: ['category', 'provider']
            });
            return products;
        } else if ('name' in data) {
            // Buscar por nombre
            const products = await models.Product.findAll({
                where: {
                    name: {
                        [Op.like]: `%${data.name}%`
                    }
                },
                include: ['category', 'provider']
            });
            return products;
        } else {
            throw boom.badRequest("Debe proporcionar un id o un nombre para buscar el producto");
        }
    }
    async findAll(query) {
        const options = {
            include: ['category', 'provider']
        }
        const { limit, offset } = query
        if (limit && offset) {
            options.limit = limit;
            options.offset = offset
        }
        const products = await models.Product.findAll(options)
        return products
    }
}

module.exports = ProductsService
