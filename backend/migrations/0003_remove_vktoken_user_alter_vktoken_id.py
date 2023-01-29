# Generated by Django 4.1.5 on 2023-02-19 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_vktoken'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vktoken',
            name='user',
        ),
        migrations.AlterField(
            model_name='vktoken',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False, unique=True),
        ),
    ]
