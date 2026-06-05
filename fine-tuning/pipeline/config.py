from pydantic_settings import BaseSettings
from pathlib import Path

ROOT = Path(__file__).parent.parent


class Settings(BaseSettings):
    # Azure OpenAI
    azure_openai_api_key: str = ""
    azure_openai_endpoint: str = ""
    azure_openai_deployment: str = "gpt-4o-mini"
    azure_openai_api_version: str = "2024-08-01-preview"

    # Pipeline settings
    batch_size: int = 50
    max_retries: int = 3
    temperature_scenario: float = 0.9
    temperature_email: float = 0.85
    temperature_label: float = 0.2
    temperature_quality: float = 0.1
    rejection_rate_buffer: float = 0.15

    # Paths
    datasets_dir: Path = ROOT / "datasets"
    raw_dir: Path = ROOT / "datasets" / "raw"
    generated_dir: Path = ROOT / "datasets" / "generated"
    labeled_dir: Path = ROOT / "datasets" / "labeled"
    filtered_dir: Path = ROOT / "datasets" / "filtered"
    real_dir: Path = ROOT / "datasets" / "real"
    final_dir: Path = ROOT / "datasets" / "final"

    class Config:
        env_file = ROOT / ".env"


settings = Settings()
