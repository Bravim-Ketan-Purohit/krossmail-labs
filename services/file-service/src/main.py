from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: db pool, s3 client
    yield
    # shutdown: close connections


app = FastAPI(title="kross-file-service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "file-service"}
