const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs"); //create log in this folder
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); //if exist then dont id dont then create

const accesLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "assets",
  session_cookie_key: "blahsomething",
  db: "codeial_developement",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com", //'smtp.gmail.com',   // hosting service
    port: 587,
    secure: false,

    auth: {
      /*for this code taken help from freecode camp
            https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
                */

      user: "iam.nanhe33@gmail.com", //process.env.EMAIL,//
      pass: process.env.CODEIAL_EMAIL_PASS,
      clientId: process.env.CODEIAL_OAUTH_CLIENTID,
      clientSecret: process.env.CODEIAL_OAUTH_CLIENT_SECRET,
      refreshToken:
        process.env
          .CODEIAL_OAUTH_REFRESH_TOKEN /** generate it from: https://developers.google.com/oauthplayground */,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },

  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codeial",
  morgan: {
    mode: "dev",
    options: { stream: accesLogStream },
  },
};

const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com", //'smtp.gmail.com',   // hosting service
    port: 587,
    secure: false,

    auth: {
      /*for this code taken help from freecode camp
            https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
                */

      user: process.env.CODEIAL_EMAIL,
      pass: process.env.CODEIAL_EMAIL_PASS,
      clientId: process.env.CODEIAL_OAUTH_CLIENTID,
      clientSecret: process.env.CODEIAL_OAUTH_CLIENT_SECRET,
      refreshToken:
        process.env
          .CODEIAL_OAUTH_REFRESH_TOKEN /** generate it from: https://developers.google.com/oauthplayground */,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },

  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,

  morgan: {
    mode: "combined",
    options: { stream: accesLogStream },
  },
};

// console.log(eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT),'check production')
module.exports =
  eval(process.env.CODEIAL_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.CODEIAL_ENVIRONMENT);
