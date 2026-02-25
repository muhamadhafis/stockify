const { supabase } = require('../config/database');
const currentTime = require('../utils/currentTime');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getLocations = async (req, res) => {
    const { data, error } = await supabase.from('stock_location').select('*');
    if (error) throw error;
    return successResponse(res, 'Berhasil mengambil daftar lokasi', data);
};

exports.createLocation = async (req, res) => {
    const { tenant_id, name, description, parent_id } = req.body;
    if (!tenant_id || !name) {
        return errorResponse(res, 'tenant_id dan name wajib diisi', null, 400);
    }

    const time = currentTime();
    const { data, error } = await supabase.from('stock_location').insert({
        tenant_id,
        name,
        description,
        parent_id,
        created_at: time,
        updated_at: time
    }).select().single();

    if (error) throw error;
    return successResponse(res, "Lokasi berhasil ditambahkan", data, 201);
};

exports.updateLocation = async (req, res) => {
    const { id } = req.params;
    const { name, description, parent_id } = req.body;
    const time = currentTime();

    const { data, error } = await supabase.from('stock_location').update({
        name,
        description,
        parent_id,
        updated_at: time
    }).eq('id', id).select().single();

    if (error || !data) return errorResponse(res, 'Lokasi tidak ditemukan', null, 404);
    return successResponse(res, "Lokasi berhasil diupdate", data);
};

exports.deleteLocation = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('stock_location').delete().eq('id', id);
    if (error) throw error;
    return successResponse(res, "Lokasi berhasil dihapus");
};
