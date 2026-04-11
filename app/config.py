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

    # Optional shared-secret für POST /webhook/form. Wenn gesetzt, muss die
    # Website den Header X-Api-Key mitschicken. Wenn None/leer, ist der
    # Endpunkt offen (nur für Dev empfohlen).
    form_api_key: str | None = None

    # Anthropic
    anthropic_api_key: str
    # Stabiler Alias ohne Datum-Suffix. Für teurere/neuere Modelle z.B.
    # 'claude-sonnet-4-6' oder 'claude-opus-4-6' setzen.
    anthropic_model: str = "claude-sonnet-4-5"

    # WhatsApp Cloud API
    wa_graph_api_version: str = "v21.0"
    wa_phone_number_id: str
    wa_access_token: str
    # Beim Webhook-Setup im Meta Business Manager frei wählbar, hier spiegeln
    # wir den hub.challenge nur wenn der verify_token übereinstimmt.
    wa_verify_token: str
    # Meta App Secret (Settings → Basic → App Secret). Wird zur HMAC-Prüfung
    # der X-Hub-Signature-256 auf dem Webhook-POST benötigt. KRITISCH.
    wa_app_secret: str
    wa_template_name: str = "lead_intro_de"
    wa_template_lang: str = "de"

    # Gmail
    gmail_credentials_file: Path = Path("./secrets/gmail_credentials.json")
    gmail_token_file: Path = Path("./secrets/gmail_token.json")
    gmail_from_address: str
    gmail_from_name: str = ""

    # Praxis
    praxis_name: str = "Musterpraxis"
    praxis_stadt: str = ""

    @property
    def postgres_dsn(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
