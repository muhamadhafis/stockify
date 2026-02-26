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
    // Cooldown check: 5 minutes
    const { data: lastOtp } = await supabase
        .from('user_otp')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (lastOtp) {
        const lastTime = new Date(lastOtp.created_at).getTime();
        const now = new Date(currentTime()).getTime();
        const diff = (now - lastTime) / 1000 / 60; // in minutes

        if (diff < 5) {
            return { error: true, message: `Harap tunggu ${Math.ceil(5 - diff)} menit lagi untuk kirim ulang.` };
        }
    }

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
        return { error: true, message: 'Gagal generate OTP' };
    }

    const cleanNumber = phone_number.toString().replace(/\D/g, '');
    const baseUrl = WHATSAPP_MESSAGE_URL.replace(/\/$/, '');
    const finalUrl = `${baseUrl}/send-person`;

    const payload = {
        phoneNumber: cleanNumber,
        message: `Kode OTP Anda adalah: *${otpCode}*. Kode ini berlaku selama 5 menit.`
    };

    try {
        await axios.post(finalUrl, payload, {
            auth: {
                username: WHATSAPP_AUTH_USER,
                password: WHATSAPP_AUTH_PASS
            },
            timeout: 15000
        });
        return { error: false, message: 'OTP terkirim' };
    } catch (error) {
        console.error('[WhatsApp] Koneksi Error:', error.message);
        return { error: true, message: 'Gagal mengirim WhatsApp' };
    }
}

exports.register = async (req, res) => {
    const { username, password, phone_number, full_name } = req.body;
    if (!username || !password || !phone_number || !full_name) {
        return errorResponse(res, 'Lengkapi username, password, full_name dan phone_number', null, 400);
    }

    // Check uniqueness
    const { data: existingUser } = await supabase
        .from('users')
        .select('id, username, phone_number')
        .or(`username.eq.${username},phone_number.eq.${phone_number}`)
        .maybeSingle();

    if (existingUser) {
        if (existingUser.username === username) return errorResponse(res, 'Username sudah digunakan', null, 400);
        if (existingUser.phone_number === phone_number) return errorResponse(res, 'Nomor telepon sudah terdaftar', null, 400);
    }

    const time = currentTime();
    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
        .from('users')
        .insert({
            username,
            password: hashedPassword,
            full_name,
            phone_number,
            created_at: time,
            is_verified: false
        })
        .select()
        .single();

    if (error) return errorResponse(res, error.message, null, 400);

    const otpStatus = await generateAndSendOtp(user.id, user.phone_number);

    return successResponse(res, 'Data terdaftar. Silakan verifikasi OTP.', {
        id: user.id,
        username: user.username,
        otp_sent: !otpStatus.error
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
    if (user.is_verified) return errorResponse(res, 'Akun sudah aktif', null, 400);

    const otpStatus = await generateAndSendOtp(user.id, user.phone_number);
    if (otpStatus.error) return errorResponse(res, otpStatus.message, null, 429);

    return successResponse(res, 'OTP berhasil dikirim ulang via WhatsApp.');
};

exports.verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
    if (!username || !otp) return errorResponse(res, 'Lengkapi username dan otp', null, 400);

    const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .maybeSingle();

    if (userErr || !user) return errorResponse(res, 'User tidak ditemukan', null, 404);

    const { data: otpData, error: otpErr } = await supabase
        .from('user_otp')
        .select()
        .eq('user_id', user.id)
        .eq('otp_code', otp)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (otpErr || !otpData) return errorResponse(res, 'OTP salah atau tidak ditemukan', null, 400);

    const now = new Date(currentTime()).getTime();
    if (new Date(otpData.expired_at).getTime() < now) {
        return errorResponse(res, 'OTP sudah kedaluwarsa', null, 400);
    }

    // Mark as verified
    await supabase.from('users').update({ is_verified: true }).eq('id', user.id);

    // Delete used OTP
    await supabase.from('user_otp').delete().eq('user_id', user.id);

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username, tenant_id: null },
        config.jwtSecret,
        { expiresIn: '1d' }
    );

    return successResponse(res, 'Verifikasi berhasil.', {
        token,
        user_id: user.id,
        username: user.username
    });
};

exports.setPassword = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return errorResponse(res, 'Username dan password wajib diisi', null, 400);

    if (password.length < 8) return errorResponse(res, 'Password minimal 8 karakter', null, 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabase
        .from('users')
        .update({ password: hashedPassword, is_verified: true })
        .eq('username', username)
        .select()
        .single();

    if (error) return errorResponse(res, 'Gagal update password', null, 400);

    // After password set, we can return a login token
    const token = jwt.sign(
        { id: user.id, username: user.username, tenant_id: null },
        config.jwtSecret,
        { expiresIn: '1d' }
    );

    return successResponse(res, 'Password berhasil diatur.', { token, user_id: user.id });
};

exports.setupBusiness = async (req, res) => {
    const { user_id, business_name } = req.body;
    if (!user_id || !business_name) return errorResponse(res, 'Lengkapi data bisnis', null, 400);

    const { data, error } = await supabase
        .from('businesses')
        .insert({
            name: business_name,
            keyword: business_name.toLowerCase().replace(/ /g, '-'),
            created_at: currentTime(),
            created_by: user_id
        })
        .select()
        .single();

    if (error) return errorResponse(res, 'Gagal membuat bisnis', null, 400);

    return successResponse(res, 'Setup bisnis berhasil.', data);
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
    if (!user.is_verified) return errorResponse(res, 'Akun Anda belum terverifikasi', null, 403);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 'Username atau password salah', null, 401);

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('created_by', user.id)
        .maybeSingle();

    const token = jwt.sign(
        { id: user.id, username: user.username, tenant_id: business ? business.id : null },
        config.jwtSecret,
        { expiresIn: '1d' }
    );

    return successResponse(res, 'Login berhasil', { token, user });
};
