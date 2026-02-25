const { supabase } = require('../config/database');
const currentTime = require('../utils/currentTime');
const slugify = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getBusinesses = async (req, res) => {
    const { data, error } = await supabase.from('businesses').select();
    if (error) throw error;
    return successResponse(res, 'Berhasil mengambil daftar bisnis', data);
};

exports.createBusiness = async (req, res) => {
    const { name, description, user_id } = req.body;
    if (!name || !description || !user_id) {
        return errorResponse(res, 'Lengkapi name, description dan user_id field', null, 400);
    }

    const keywordBusiness = slugify(name);
    const time = currentTime();

    const { data, error } = await supabase
        .from('businesses')
        .insert({
            name,
            description,
            keyword: keywordBusiness,
            created_at: time,
            created_by: user_id
        })
        .select()
        .single();

    if (error) throw error;
    return successResponse(res, "Bisnis berhasil ditambahkan", data, 201);
};

exports.updateBusiness = async (req, res) => {
    const { name, description, user_id } = req.body;
    const { keyword } = req.params;

    if (!keyword) return errorResponse(res, 'Lengkapi keyword params', null, 400);
    if (!name) return errorResponse(res, 'Field name wajib diisi', null, 400);

    const keywordBusiness = slugify(name);
    const time = currentTime();

    const { data, error } = await supabase
        .from('businesses')
        .update({
            name,
            description,
            updated_at: time,
            created_by: user_id,
            keyword: keywordBusiness
        })
        .eq('keyword', keyword)
        .select()
        .single();

    if (error) return errorResponse(res, 'Bisnis tidak ditemukan atau error saat update', null, 404);

    return successResponse(res, "Bisnis berhasil diubah", data);
};

exports.deleteBusiness = async (req, res) => {
    const { keyword } = req.params;
    if (!keyword) return errorResponse(res, 'Lengkapi keyword params', null, 400);

    const { error } = await supabase.from('businesses').delete().eq('keyword', keyword);
    if (error) throw error;

    return successResponse(res, `Bisnis ${keyword} berhasil dihapus`);
};
