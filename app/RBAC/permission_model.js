module.exports = (sequelize, Sequelize) => {
    const Permissions = sequelize.define('Permissions', {
        permission_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        access_type: {
            type: Sequelize.ENUM('read', 'write', 'delete'),
            defaultValue: 'read',
            allowNull: false,
        },
        section_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'section',
                key: 'sec_id',
            }
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });

    return Permissions;
}


