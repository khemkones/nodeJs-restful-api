module.exports = (sequelize, DataTypes) => {
    let Users = sequelize.define('Users', {
      // uuid: {
      //   type: DataTypes.UUID,
      //   primaryKey: true,
      //   defaultValue: sequelize.fn("uuid"),
      //   field: "ID",
      // },
      // *ถ้าต้องการ id แบบ integer ไม่ต้องใส่ code ด้านบนมา
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
    },  { tableName: 'Users'});
    return Users;
  };