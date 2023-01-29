# Generated by Django 4.1.5 on 2023-02-20 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_socialnetwork_socialaccount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Settings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=50)),
                ('value', models.CharField(max_length=500)),
                ('description', models.CharField(blank=True, max_length=1000, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='vktoken',
            name='token',
            field=models.CharField(max_length=250, unique=True),
        ),
    ]
