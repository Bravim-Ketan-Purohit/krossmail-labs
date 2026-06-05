from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: ollama client, sqs consumer task
    yield
    # shutdown: cancel consumer task


app = FastAPI(title="kross-ai-service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}
