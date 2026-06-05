from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: redis connect, websocket manager
    yield
    # shutdown: close connections


app = FastAPI(title="kross-notification-service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "notification-service"}
