
module.exports = function(sequelize, DataTypes) {
    var Comments = sequelize.define("Comments", {

        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            },
        }

    });

    Comments.associate = function(models){
        Comments.belongsTo(models.Status, {
            foreignKey: "status_id"
        });
         Comments.belongsTo(models.Accounts, {
            foreignKey: "uuid"
        });
    };

 


    return Comments;
}