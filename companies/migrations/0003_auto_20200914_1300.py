# Generated by Django 3.0.6 on 2020-09-14 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0002_company_owned_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='Name',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]