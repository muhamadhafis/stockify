const { supabase } = require('../config/database');
const currentTime = require('../utils/currentTime');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper to upload image to Supabase Storage
const uploadToSupabase = async (file, tenant_id) => {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${tenant_id}/${Date.now()}.${fileExt}`;
    const filePath = `parts/${fileName}`;

    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    return publicUrl;
};

// Helper to delete image from Supabase Storage
const deleteFromSupabase = async (imageUrl) => {
    if (!imageUrl) return;
    try {
        const path = imageUrl.split('/storage/v1/object/public/images/')[1];
        if (path) {
            await supabase.storage.from('images').remove([path]);
        }
    } catch (err) {
        console.error('Gagal menghapus gambar:', err.message);
    }
};

exports.getParts = async (req, res) => {
    const { data, error } = await supabase.from('part').select();
    if (error) throw error;
    return successResponse(res, 'Berhasil mengambil daftar part', data);
};

exports.getPartById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('part').select('*').eq('id', id).single();
    if (error || !data) return errorResponse(res, 'Part tidak ditemukan', null, 404);
    return successResponse(res, 'Detail part berhasil diambil', data);
};

exports.createPart = async (req, res) => {
    const { tenant_id, name, description, keyword, unit, supplier_id, minimum_stock } = req.body;

    if (!tenant_id || !name || !keyword) {
        return errorResponse(res, 'Lengkapi tenant_id, name, dan keyword field', null, 400);
    }

    let imageUrl = null;
    if (req.file) {
        imageUrl = await uploadToSupabase(req.file, tenant_id);
    }

    const time = currentTime();
    const { data, error } = await supabase.from('part').insert({
        tenant_id: parseInt(tenant_id),
        name,
        description,
        keyword,
        image: imageUrl,
        unit,
        supplier_id,
        minimum_stock: minimum_stock || 0,
        created_at: time,
        updated_at: time,
        created_by: parseInt(req.user)
    }).select().single();

    if (error) {
        if (imageUrl) await deleteFromSupabase(imageUrl); // Clean up image if DB insert fails
        throw error;
    }
    return successResponse(res, "Part berhasil ditambahkan", data, 201);
};

exports.updatePart = async (req, res) => {
    const { id } = req.params;
    const { name, description, keyword, unit, supplier_id, minimum_stock } = req.body;

    // 1. Get current part data
    const { data: currentPart } = await supabase.from('part').select('image, tenant_id').eq('id', id).single();
    if (!currentPart) return errorResponse(res, 'Part tidak ditemukan', null, 404);

    let imageUrl = currentPart.image;
    if (req.file) {
        // Delete old image if exists
        if (currentPart.image) await deleteFromSupabase(currentPart.image);
        // Upload new image
        imageUrl = await uploadToSupabase(req.file, currentPart.tenant_id);
    }

    const time = currentTime();
    const { data, error } = await supabase.from('part').update({
        name,
        description,
        keyword,
        image: imageUrl,
        unit,
        supplier_id,
        minimum_stock,
        updated_at: time
    }).eq('id', id).select().single();

    if (error) throw error;
    return successResponse(res, "Part berhasil diupdate", data);
};

exports.deletePart = async (req, res) => {
    const { id } = req.params;

    const { data: part } = await supabase.from('part').select('image').eq('id', id).single();
    if (part && part.image) {
        await deleteFromSupabase(part.image);
    }

    const { error } = await supabase.from('part').delete().eq('id', id);
    if (error) throw error;
    return successResponse(res, "Part berhasil dihapus");
};
