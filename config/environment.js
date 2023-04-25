const morgan = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    jwt_secret: 'codeial',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    google_clientID: "637268463823-cn2l11dbj8iomcos9ibg855hl60pdai7.apps.googleusercontent.com",
    google_clientSecret: "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",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.Codeial_gmail_username,
            pass: process.env.Codeial_gmail_password
        }
    },
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    },
    mongodb_url: process.env.mongodb_url
};

const production = {
    name: 'production',
    jwt_secret: process.env.Codeial_jwt_secret,
    asset_path: process.env.Codeial_asset_path,
    session_cookie_key: process.env.Codeial_session_cookie_key,
    db: process.env.Codeial_db,
    google_clientID: process.env.Codeial_google_client_id,
    google_clientSecret: process.env.Codeial_google_clientSecret,
    google_callbackURL: process.env.Codeial_google_callbackURL,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.Codeial_gmail_username,
            pass: process.env.Codeial_gmail_password
        }
    },
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    },
    mongodb_url: process.env.mongodb_url
};

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);