from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://kross:kross@localhost:5432/kross"
    aws_region: str = "us-east-1"
    aws_sqs_rag_queue_url: str = ""
    ollama_base_url: str = "http://localhost:11434"
    embed_model: str = "nomic-embed-text"


settings = Settings()
