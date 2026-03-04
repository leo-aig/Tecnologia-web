from contextlib import asynccontextmanager
from fastapi import FastAPI
from psycopg_pool import AsyncConnectionPool
from psycopg.rows import dict_row
from config.configuracion import config

DB_config = {
    "dbname": config.DB_NAME,
    "user": config.DB_USER,
    "password": config.DB_PASSWORD,
    "host": config.DB_HOST,
    "port": config.DB_PORT,
}

DB_URL = (
    f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}"
    f"@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
)

pool = AsyncConnectionPool(conninfo=DB_URL, open=False)


async def get_conexion():
    async with pool.connection() as conn:
        conn.row_factory = dict_row
        yield conn


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await pool.open()
        print("Pool de conexiones abierto exitosamente")
        yield
    finally:
        await pool.close()
        print("Pool de conexiones cerrado")
app = FastAPI(lifespan=lifespan)
