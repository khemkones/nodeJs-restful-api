module.exports = (sequelize, DataTypes) => {
    let Users = sequelize.define('Users', {
      user_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      createdAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.fn('NOW'),
        allowNull: false,
        field: 'updated_at'
      },
      deletedAt: {
        type: 'TIMESTAMP',
        allowNull: true,
        field: 'deleted_at'
      },
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
    },  { tableName: 'Users'});
    return Users;
  };