module.exports = (sequelize, Sequelize) => {
    const assign_permission = sequelize.define('assign_permission', {
        assign_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        permission_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Permissions',
                key: 'permission_id',
            }
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Role',
                key: 'role_id',
            }
        },
        isDeleted :{
            type :Sequelize.BOOLEAN,
            defaultValue:false
        },
        status:{
            type : Sequelize.ENUM("ACTIVE","INACTIVE"),
            defaultValue:"ACTIVE"
        },
    }, {
        freezeTableName: true
    });

    return assign_permission;
}


