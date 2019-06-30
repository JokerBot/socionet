
var uuidv1  = require('uuid/v1');

var bcrypt  = require('bcrypt');


module.exports = function(sequelize, DataTypes) {
    var Accounts = sequelize.define("Accounts", {

        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          isUnique :true
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            },
            isUnique :true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        account_key: {
            type: DataTypes.STRING,
            required: true,
            validate: {
                len:[8]
            }
        }

    });

    // generating a hash
    Accounts.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    Accounts.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.account_key);
    };

    Accounts.associate = function(models){
        Accounts.hasMany(models.Status, {
            foreignKey: "uuid"
        });
        Accounts.hasMany(models.Comments, {
            foreignKey: "uuid"
        });
        Accounts.hasMany(models.Favourites, {
            foreignKey: "uuid"
        });
       
    };

  

    // Accounts.associate = function(models){
    //     Accounts.hasMany(models.Transactions, {
    //         foreignKey: "renter_id"
    //     });
    // };

    return Accounts;
}