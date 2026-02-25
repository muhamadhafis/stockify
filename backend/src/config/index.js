const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET,
    supabase: {
        url: process.env.supabaseUrl,
        anonKey: process.env.supabaseAnonKey,
        ServiceKey: process.env.supabaseServiceKey
    },
    postgres: {
        user: process.env.USER_POSTGRESQL,
        host: process.env.HOST_POSTGRESQL,
        database: process.env.DATABASE_POSTGRESQL,
        password: process.env.PASSWORD_POSTGRESQL,
        port: process.env.PORT_POSTGRESQL
    },
    whatsapp: {
        url: process.env.WHATSAPP_MESSAGE_URL,
        user: process.env.WHATSAPP_AUTH_USER,
        pass: process.env.WHATSAPP_AUTH_PASS
    }
};
