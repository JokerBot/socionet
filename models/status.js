
var uuidv1  = require('uuid/v1');

var bcrypt  = require('bcrypt');


module.exports = function(sequelize, DataTypes) {
    var Status = sequelize.define("Status", {

        status_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 500]
            },
        }

    });

    

    Status.associate = function(models){
        Status.hasMany(models.Comments, {
            foreignKey: "status_id"
        });
        Status.hasMany(models.Favourites, {
            foreignKey: "status_id"
        });
        Status.belongsTo(models.Accounts, {
            foreignKey: "uuid"
        });
 
    };

    

   

    return Status;
}