module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('Role', {
        role_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role_name: {
            type: Sequelize.STRING,
            allowNull: false,
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

    return role
}


