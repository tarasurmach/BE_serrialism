import { cleanEnv, port, str } from 'envalid';

export default function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({ choices: ['dev', 'prod'] }),
        MONGO_URL: str(),
        PORT: port({ default: 3600 }),
    });
}
