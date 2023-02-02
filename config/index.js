import dontevn from 'dotenv'

dontevn.config()
export const { PORT, DEGUB_MODE, DB_URL, JWT_SECRET ,JWT_REFRESH_TOKEN, APP_BUCKET_URL } = process.env