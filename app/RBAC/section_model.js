module.exports = (sequelize, Sequelize) => {
    const section = sequelize.define('section', {
        sec_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        section_name: {
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

    return section
}


