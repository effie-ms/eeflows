from eeflows.celery import app as celery_app


default_app_config = "eeflows.apps.EeflowsConfig"

__all__ = ["celery_app"]
