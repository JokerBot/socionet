



module.exports = function(sequelize, DataTypes) {
    var Favourites = sequelize.define("Favourites", {

        favourite_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       

    });

    Favourites.associate = function(models){
        Favourites.belongsTo(models.Status, {
            foreignKey: "status_id"
        });
        Favourites.belongsTo(models.Accounts, {
            foreignKey: "uuid"
        });
    };
   

    return Favourites;
}