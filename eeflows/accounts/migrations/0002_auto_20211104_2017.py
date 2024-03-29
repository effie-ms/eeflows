# Generated by Django 2.2.24 on 2021-11-04 20:17

from django.db import migrations
from django.contrib.auth import get_user_model


def create_test_user(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    get_user_model().objects.create_superuser(
        email="user@eeflows.com",
        password="test",
    )


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_test_user),
    ]
