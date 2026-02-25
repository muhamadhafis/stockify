const { supabase } = require('../config/database');
const currentTime = require('../utils/currentTime');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Get stock levels
exports.getStock = async (req, res) => {
    const { data, error } = await supabase
        .from('stock_item')
        .select(`
            id,
            quantity,
            status,
            part:part_id (id, name, unit),
            location:location_id (id, name)
        `);
    if (error) throw error;
    return successResponse(res, 'Berhasil mengambil daftar stok', data);
};

// Adjust Stock (In/Out)
exports.adjustStock = async (req, res) => {
    const { tenant_id, part_id, location_id, delta, tracking_type, notes, user_id, batch_id, serial_id } = req.body;

    if (!part_id || !location_id || delta === undefined || !tracking_type) {
        return errorResponse(res, 'Field part_id, location_id, delta, dan tracking_type wajib diisi', null, 400);
    }

    const time = currentTime();

    // 1. Get or Create Stock Item
    let { data: stockItem, error: getError } = await supabase
        .from('stock_item')
        .select('*')
        .eq('part_id', part_id)
        .eq('location_id', location_id)
        .maybeSingle();

    if (getError) throw getError;

    let updatedQuantity = delta;
    let stockItemId;

    if (stockItem) {
        updatedQuantity = Number(stockItem.quantity) + Number(delta);
        const { data: updatedItem, error: updateError } = await supabase
            .from('stock_item')
            .update({ quantity: updatedQuantity, updated_at: time })
            .eq('id', stockItem.id)
            .select()
            .single();

        if (updateError) throw updateError;
        stockItemId = stockItem.id;
    } else {
        const { data: newItem, error: insertError } = await supabase
            .from('stock_item')
            .insert({
                tenant_id,
                part_id,
                location_id,
                quantity: delta,
                batch_id,
                serial_id,
                created_at: time,
                updated_at: time
            })
            .select()
            .single();

        if (insertError) throw insertError;
        stockItemId = newItem.id;
    }

    // 2. Log to Tracking Table (Audit Trail)
    const { error: trackingError } = await supabase
        .from('stock_item_tracking')
        .insert({
            tenant_id,
            stock_item_id: stockItemId,
            delta,
            notes: notes || `Stock Adjustment: ${tracking_type}`,
            tracking_type,
            user_id: user_id || (req.user && req.user.id),
            date: time
        });

    if (trackingError) throw trackingError;

    return successResponse(res, 'Stok berhasil disesuaikan', {
        stock_item_id: stockItemId,
        new_quantity: updatedQuantity
    });
};

// Get Stock History
exports.getStockHistory = async (req, res) => {
    const { data, error } = await supabase
        .from('stock_item_tracking')
        .select(`
            *,
            stock_item:stock_item_id (
                part:part_id (name)
            )
        `)
        .order('date', { ascending: false });

    if (error) throw error;
    return successResponse(res, 'Berhasil mengambil riwayat stok', data);
};
