import mysql from 'mysql2/promise';
let pool: mysql.Pool | null = null;
export function useMysql() {
    if (!pool) {
        const config = useRuntimeConfig();
        pool = mysql.createPool({
            host: config.mysqlHost,
            port: Number(config.mysqlPort || 3306),
            user: config.mysqlUser,
            password: config.mysqlPassword,
            database: config.mysqlDatabase
        })
    }
    return pool;
}