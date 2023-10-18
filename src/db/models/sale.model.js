const { Model, DataTypes, Sequelize } = require("sequelize");
const { EMPLOYEE_TABLE } = require("./employee.model");

const SALE_TABLE = 'sales'

const SaleSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
    },
    employeeId: {
        allowNull: false,
        field: 'employee_id',
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: EMPLOYEE_TABLE,
            key: 'id'
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}

class Sale extends Model {
    static associate(models) {
        this.belongsTo(models.Employee, {
            as: 'employee'
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: SALE_TABLE,
            modelname: 'Sale',
            timestamps: false
        }
    }
}
module.exports = {
    Sale,
    SaleSchema,
    SALE_TABLE
}
