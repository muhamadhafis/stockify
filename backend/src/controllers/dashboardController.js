const { supabase, pool } = require('../config/database');
const { successResponse } = require('../utils/apiResponse');

exports.getStats = async (req, res) => {
    // 1. Get Total Parts
    const { count: totalParts, error: partError } = await supabase
        .from('part')
        .select('*', { count: 'exact', head: true });

    // 2. Get Low Stock Items
    // We use a join-like logic or a raw query if needed, 
    // but for simplicity we can fetch parts and their stock levels.
    const { data: lowStockItems, error: lowStockError } = await pool.query(`
        SELECT p.name, p.minimum_stock, SUM(si.quantity) as current_stock
        FROM part p
        JOIN stock_item si ON p.id = si.part_id
        GROUP BY p.id, p.name, p.minimum_stock
        HAVING SUM(si.quantity) <= p.minimum_stock
    `);

    // 3. Today's Transactions
    const today = new Date().toISOString().split('T')[0];
    const { count: todayTransactions, error: trackError } = await supabase
        .from('stock_item_tracking')
        .select('*', { count: 'exact', head: true })
        .gte('date', today);

    return successResponse(res, 'Berhasil mengambil statistik dashboard', {
        total_parts: totalParts || 0,
        low_stock_count: lowStockItems ? lowStockItems.rowCount : 0,
        today_transactions: todayTransactions || 0,
        low_stock_details: lowStockItems ? lowStockItems.rows : []
    });
};
