import dotenv from "dotenv";
dotenv.config();

export const env = {
  get port() {
    return process.env.Port;
  },
  get MONGO_URL() {
    return process.env.DBMS;
  },
  get CLIENT_ORGIN() {
    return process.env.client_Orgin;
  },
  get EMAIL() {
    return process.env.Email;
  },
  get PASS_KEY() {
    return process.env.passKey;
  },
  get ACCESS_TOKEN() {
    return process.env.ACCESS_TOKEN;
  },
  get REFRESH_TOKEN() {
    return process.env.REFRESH_TOKEN;
  },
  get CLIENT_ID() {
    return process.env.CLIENT_ID;
  },
  get CLIENT_SECRET() {
    return process.env.CLIENT_SECRET;
  },
  get CALLBACK_URL() {
    return process.env.CALLBACK_URL;
  },
  get SESSION_SECRET() {
    return process.env.SESSION_SECRET;
  },
  get AWS_S3_ACCESS_KEY() {
    return process.env.AWS_S3_ACCESS_KEY;
  },
  get AWS_S3_SECRET_KEY() {
    return process.env.AWS_S3_SECRET_KEY;
  },
  get AWS_S3_REGION() {
    return process.env.AWS_S3_REGION;
  },
  get AWS_s3_BUCKET_NAME() {
    return process.env.AWS_S3_BUCKET_NAME;
  },
  get STRIPE_SECRETE_KEY(){
    return process.env.STRIPE_SECRETE_KEY
  },
  get WEB_HOOK_SECRETE_KEY(){
    return process.env.WEB_HOOK_SECRET_KEY
  }
};
