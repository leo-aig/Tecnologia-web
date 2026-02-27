from contextlib import asynccontextmanager
from fastapi import FastAPI
from psycopg_pool import AsyncConnectionPool
from psycopg.rows import dict_row

DB_URL = "postgresql://postgres:leo123@localhost:5432/veterinaria"
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