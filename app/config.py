from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Postgres
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "zahnfunnel"
    postgres_user: str = "zahnfunnel"
    postgres_password: str

    # App
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    log_level: str = "INFO"
    contact_delay_minutes: int = 3

    # Optional shared-secret für POST /webhook/form
    form_api_key: str | None = None

    # Anthropic
    anthropic_api_key: str
    anthropic_model: str = "claude-sonnet-4-5"

    # WhatsApp Cloud API
    wa_graph_api_version: str = "v21.0"
    wa_phone_number_id: str
    wa_access_token: str
    wa_verify_token: str
    wa_app_secret: str
    wa_template_name: str = "lead_intro_de"
    wa_template_lang: str = "de"

    # Gmail
    gmail_credentials_file: Path = Path("./secrets/gmail_credentials.json")
    gmail_token_file: Path = Path("./secrets/gmail_token.json")
    gmail_from_address: str
    gmail_from_name: str = ""

    # Berater-Branding (für AI-Prompts, Auto-Reply, Templates)
    berater_name: str = "Alexander Fürtbauer"
    berater_firma: str = "VVO Haberger AG"
    berater_typ: str = "Zahnzusatzversicherungen"

    @property
    def postgres_dsn(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
