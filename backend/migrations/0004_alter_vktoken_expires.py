# Generated by Django 4.1.5 on 2023-02-19 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_remove_vktoken_user_alter_vktoken_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vktoken',
            name='expires',
            field=models.DateTimeField(),
        ),
    ]
