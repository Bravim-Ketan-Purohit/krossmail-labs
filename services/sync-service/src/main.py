from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: db pool, redis connect, sqs client
    yield
    # shutdown: close connections


app = FastAPI(title="kross-sync-service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sync-service"}
