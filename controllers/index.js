const users = require("./users");




module.exports = {
  users: {
    Insert: users.Insert,
    Update: users.Update,
    List: users.List,
    GetByID: users.GetByID,
    GetByUsername: users.GetByUsername,
    Delete: users.Delete
  },
};
