import Sequelize from 'sequelize';
import uuid from 'uuid/v4';

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    name: DataTypes.STRING,
  }, {});

  Group.associate = (models) => {
    Group.belongsToMany(models.User, { as: 'members', through: 'GroupMember', foreignKey: 'groupID' });
    Group.hasMany(models.Board, { as: 'boards', foreignKey: 'groupID', sourceKey: 'id' });
    Group.hasMany(models.Action, { as: 'actions', foreignKey: 'groupID' });
    Group.belongsTo(models.User, { as: 'facilitator', foreignKey: 'facilitatorID'});
  };

  return Group;
};
