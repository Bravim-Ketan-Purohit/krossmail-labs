from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://kross:kross@localhost:5432/kross"
    aws_region: str = "us-east-1"
    aws_s3_bucket: str = ""


settings = Settings()
