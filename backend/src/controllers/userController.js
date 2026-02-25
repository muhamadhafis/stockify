const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getUsers = async (req, res) => {
    const result = await pool.query('SELECT username FROM users');
    return successResponse(res, 'Berhasil mengambil daftar user', result.rows);
};

exports.createUser = async (req, res) => {
    const { username } = req.body;
    if (!username) return errorResponse(res, "body username wajib digunakan", null, 400);

    const result = await pool.query(`
        INSERT INTO users (first_username) 
        VALUES ($1)
        RETURNING *`,
        [username]
    );

    return successResponse(res, 'User berhasil ditambahkan', result.rows[0], 201);
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!id) return errorResponse(res, "params id wajib digunakan", null, 400);
    if (!username) return errorResponse(res, "body username wajib digunakan", null, 400);

    const result = await pool.query(`
        UPDATE users SET
            first_username = $2
        WHERE id = $1
        RETURNING *`,
        [id, username]
    );

    if (result.rows.length === 0) return errorResponse(res, 'User tidak ditemukan', null, 404);

    return successResponse(res, 'User berhasil diperbarui', result.rows[0]);
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) return errorResponse(res, "params id wajib digunakan", null, 400);

    const result = await pool.query(`
        DELETE FROM users
        WHERE id = $1`,
        [id]
    );

    if (result.rowCount === 0) {
        return errorResponse(res, `User dengan id ${id} tidak ditemukan`, null, 404);
    }

    return successResponse(res, `User dengan id ${id} berhasil dihapus`);
};
