# Generated by Django 3.1.1 on 2021-01-05 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pesticide_app', '0010_auto_20210102_0331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emoticon',
            name='aria_label',
            field=models.CharField(max_length=35, unique=True),
        ),
        migrations.AlterField(
            model_name='emoticon',
            name='emoji',
            field=models.CharField(max_length=35, unique=True),
        ),
    ]