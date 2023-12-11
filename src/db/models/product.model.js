const { Model, DataTypes, Sequelize } = require("sequelize");
const { CATEGORY_TABLE } = require("./category.model");
const { PROVIDER_TABLE } = require("./provider.model");

const PRODUCT_TABLE = 'products'

const ProductSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    purchasePrice: {
        allowNull: false,
        type: DataTypes.DECIMAL(5, 2),
        field: 'purchase_price'
    },
    salePrice: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        field: 'sale_price'
    },
    description: {
        type: DataTypes.STRING,
    },
    barCode: {
        type: DataTypes.STRING,
        unique: true,
        field: 'bar_code'
    },
    imgUrl: {
        type: DataTypes.STRING,
        field: 'img_url',
    },
    stock: {
        type: DataTypes.INTEGER
    },
    brand: {
        type: DataTypes.STRING,
    },
    categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'category_id',
        allowNull: false,
        references: {
            model: CATEGORY_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    providerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'provider_id',
        allowNull: false,
        references: {
            model: PROVIDER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: "SET NULL"
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}

class Product extends Model {
    // para definir las asociaciones
    static associate(models) {
        this.belongsTo(models.Category, {
            as: 'category',
        })
        this.belongsTo(models.Provider, {
            as: 'provider',
        })

    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: "Product",
            timestamps: false
        }
    }
}

module.exports = {
    PRODUCT_TABLE,
    ProductSchema,
    Product
}
