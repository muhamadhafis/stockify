const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');
const config = require('../config');
const currentTime = require('../utils/currentTime');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const axios = require('axios');

const { url: WHATSAPP_MESSAGE_URL, user: WHATSAPP_AUTH_USER, pass: WHATSAPP_AUTH_PASS } = config.whatsapp;

// Helper to generate and send OTP
async function generateAndSendOtp(userId, phone_number) {
    const time = currentTime();
    const expiredTime = currentTime(5);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await supabase.from('user_otp').insert({
        user_id: userId,
        otp_code: otpCode,
        created_at: time,
        expired_at: expiredTime
    });

    if (result.error) {
        console.error('Insert OTP Error:', result.error);
        return false;
    }

    // Bersihkan nomor agar hanya angka
    const cleanNumber = phone_number.toString().replace(/\D/g, '');

    const baseUrl = WHATSAPP_MESSAGE_URL.replace(/\/$/, '');
    const finalUrl = `${baseUrl}/send-person`;

    const payload = {
        phoneNumber: cleanNumber,
        message: `Kode OTP Anda adalah: *${otpCode}*. Kode ini berlaku selama 5 menit.`
    };

    try {
        const response = await axios.post(finalUrl, payload, {
            auth: {
                username: WHATSAPP_AUTH_USER,
                password: WHATSAPP_AUTH_PASS
            },
            timeout: 15000 // Menunggu sampai 15 detik
        });

        return true;
    } catch (error) {
        if (error.response) {
            console.error(`[WhatsApp] API Error [${error.response.status}]:`, error.response.data);
            // 405 berasal dari catch block di WhatsApp Backend Anda
        } else {
            console.error('[WhatsApp] Koneksi Error:', error.message);
        }
        return false;
    }
}

exports.register = async (req, res) => {
    const { username, password, phone_number, full_name } = req.body;
    if (!username || !password || !phone_number || !full_name) {
        return errorResponse(res, 'Lengkapi username, password, full_name dan phone_number', null, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const time = currentTime();

    const { data: user, error } = await supabase
        .from('users')
        .insert({
            username,
            password: hashedPassword,
            full_name,
            phone_number,
            created_at: time
        })
        .select()
        .single();

    if (error) return errorResponse(res, error.message, null, 400);

    const otpSent = await generateAndSendOtp(user.id, user.phone_number);

    return successResponse(res, 'Registrasi berhasil. Silakan cek WhatsApp untuk kode OTP.', {
        id: user.id,
        username: user.username,
        otp_sent: otpSent
    }, 201);
};

exports.sendOtp = async (req, res) => {
    const { username } = req.body;
    if (!username) return errorResponse(res, 'Username wajib diisi', null, 400);

    const { data: user, error } = await supabase
        .from('users')
        .select('id, phone_number, is_verified')
        .eq('username', username)
        .maybeSingle();

    if (error || !user) return errorResponse(res, 'User tidak ditemukan', null, 404);
    if (user.is_verified) return errorResponse(res, 'User sudah terverifikasi', null, 400);

    const otpSent = await generateAndSendOtp(user.id, user.phone_number);

    return successResponse(res, 'OTP berhasil dikirim ulang via WhatsApp.', { otp_sent: otpSent });
};

exports.verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
    if (!username || !otp) return errorResponse(res, 'Lengkapi username dan otp', null, 400);

    const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

    if (userErr || !user) return errorResponse(res, 'User tidak ditemukan', null, 404);

    const { data: otpData, error: otpErr } = await supabase
        .from('user_otp')
        .select()
        .eq('user_id', user.id)
        .eq('otp_code', otp)
        .maybeSingle();

    if (otpErr || !otpData) return errorResponse(res, 'OTP salah atau tidak ditemukan', null, 400);

    const time = currentTime();
    if (new Date(otpData.expired_at) < new Date(time)) {
        return errorResponse(res, 'OTP sudah kedaluwarsa', null, 400);
    }

    await supabase.from('users').update({ is_verified: true }).eq('id', user.id);
    await supabase.from('user_otp').delete().eq('id', otpData.id);

    return successResponse(res, 'Verifikasi berhasil. Silakan login.');
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return errorResponse(res, 'Lengkapi username dan password', null, 400);

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

    if (error || !user) return errorResponse(res, 'Username atau password salah', null, 401);

    if (!user.is_verified) {
        return errorResponse(res, 'Akun Anda belum terverifikasi', null, 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 'Username atau password salah', null, 401);

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('created_by', user.id)
        .limit(1)
        .maybeSingle();

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            tenant_id: business ? business.id : null
        },
        config.jwtSecret,
        { expiresIn: '1d' }
    );

    return successResponse(res, 'Login berhasil', {
        token,
        user: { id: user.id, username: user.username, full_name: user.full_name }
    });
};
