from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: db pool, redis connect
    yield
    # shutdown: close connections


app = FastAPI(title="kross-auth-service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-service"}
