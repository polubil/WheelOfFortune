# Generated by Django 4.1.5 on 2023-02-23 09:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('backend', '0011_profilepic'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.IntegerField(default=1000, verbose_name='Баланс')),
                ('picture', models.ImageField(upload_to='')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Баланс')),
            ],
        ),
        migrations.RemoveField(
            model_name='userbalance',
            name='user',
        ),
        migrations.DeleteModel(
            name='ProfilePic',
        ),
        migrations.DeleteModel(
            name='UserBalance',
        ),
        migrations.AlterField(
            model_name='winners',
            name='winner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.userprofile', verbose_name='Победитель'),
        ),
    ]
