const cron = require('node-cron');
const { supabase } = require('../config/database');
const currentTime = require('../utils/currentTime')

// Run every minute
cron.schedule('* * * * *', async () => {
    try {
        const result = await supabase.from('user_otp').delete().lt('expired_at', currentTime()).select()
        if (result.data > 0) {
            console.info(`[Cron] Removed ${result.data} expired OTPs`);
        }
    } catch (error) {
        console.error('[Cron] Error cleaning up OTPs:', error);
    }
});

console.info('[Cron] OTP cleanup service started');
