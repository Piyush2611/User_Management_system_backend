module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        full_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Role', // must match your roles table name
                key: 'role_id',
            },
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        phone:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        profile_image: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });

    return User
}


