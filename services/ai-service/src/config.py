from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    aws_region: str = "us-east-1"
    aws_sqs_ai_queue_url: str = ""
    ollama_base_url: str = "http://localhost:11434"
    gemma_model: str = "gemma4:26b"
    gemma_lora_adapter: str = ""
    embed_model: str = "nomic-embed-text"


settings = Settings()
