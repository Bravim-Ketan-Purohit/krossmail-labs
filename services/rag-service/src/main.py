from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: db pool, ollama client, sqs consumer task
    yield
    # shutdown: cancel consumer task


app = FastAPI(title="kross-rag-service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "rag-service"}
