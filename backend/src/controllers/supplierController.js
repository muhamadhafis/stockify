const { supabase } = require('../config/database');
const currentTime = require('../utils/currentTime');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getSuppliers = async (req, res) => {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) throw error;
    return successResponse(res, 'Berhasil mengambil daftar supplier', data);
};

exports.getSupplierById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).single();
    if (error || !data) return errorResponse(res, 'Supplier tidak ditemukan', null, 404);
    return successResponse(res, 'Detail supplier berhasil diambil', data);
};

exports.createSupplier = async (req, res) => {
    const { tenant_id, name, contact_person, email, phone, address } = req.body;
    if (!tenant_id || !name) {
        return errorResponse(res, 'tenant_id dan name wajib diisi', null, 400);
    }

    const time = currentTime();
    const { data, error } = await supabase.from('suppliers').insert({
        tenant_id,
        name,
        contact_person,
        email,
        phone,
        address,
        created_at: time,
        updated_at: time
    }).select().single();

    if (error) throw error;
    return successResponse(res, "Supplier berhasil ditambahkan", data, 201);
};

exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, contact_person, email, phone, address } = req.body;
    const time = currentTime();

    const { data, error } = await supabase.from('suppliers').update({
        name,
        contact_person,
        email,
        phone,
        address,
        updated_at: time
    }).eq('id', id).select().single();

    if (error || !data) return errorResponse(res, 'Supplier tidak ditemukan atau gagal update', null, 404);

    return successResponse(res, "Supplier berhasil diupdate", data);
};

exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw error;
    return successResponse(res, "Supplier berhasil dihapus");
};
