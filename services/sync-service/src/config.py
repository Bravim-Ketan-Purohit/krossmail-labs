from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://kross:kross@localhost:5432/kross"
    redis_url: str = "redis://localhost:6379"
    aws_region: str = "us-east-1"
    aws_sqs_sync_queue_url: str = ""
    webhook_secret_gmail: str = ""
    webhook_secret_outlook: str = ""


settings = Settings()
