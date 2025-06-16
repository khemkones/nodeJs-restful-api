const con = require('../config/db');
const db = require('../config/db');

exports.create = (values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db.users.create(values);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

exports.update = (values, user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result] = await db.users.update(values, {
        where: {
          user_id
        }
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

exports.find = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      let condition = ``
      const params = [];
      let LIMIT = ``

      if (query.filter) {
        condition += ` AND u.username LIKE ?`
        params.push(`%${query.filter.username}%`);
      }

      if (query.offset && query.limit) {
        LIMIT = `LIMIT ? OFFSET ?`
        params.push(query.limit, query.offset);
      }

      const sql = `SELECT u.id, u.username, u.first_name, u.last_name, u.created_at
                   FROM Users u
                   WHERE u.deleted_at IS NULL
                   ORDER BT u.created_at DESC
                   ${LIMIT}`
      const result = await con.query(sql, []);

      const sqlCount = `SELECT COUNT(*) as total
                        FROM Users u
                        WHERE u.deleted_at IS NULL`
      const [countResult] = await con.query(sqlCount, []);

      resolve({
        data: result,
        total: countResult.total || 0
      });
    } catch (e) {
      reject(e);
    }
  });
};

exports.fineOne = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      let condition = ``
      const params = [];
      if (query.user_id) {
        condition += ` AND u.user_id = ?`
        params.push(query.user_id);
      }

      if (query.username) {
        condition += ` AND u.username = ?`
        params.push(query.username);
      }

      const sql = ` SELECT u.id, u.username, u.password, u.first_name, u.last_name, u.created_at
                    FROM Users u
                    WHERE u.deleted_at IS NULL ${condition}
                    LIMIT 1`
      const [result] = await con.query(sql, [ID]);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

exports.softDelete = (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {

      const [result] = await db.users.update(
        { deletedAt: new Date() },
        { where: { user_id } }
      );
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

exports.hardDelete = (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db.users.destroy({
        where: {
          user_id
        }
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

