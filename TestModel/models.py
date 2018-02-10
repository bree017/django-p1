from django.db import models
from django.contrib import admin
# Create your models here.
class Test(models.Model):
    tittle = models.CharField(max_length=20)
    body = models.TextField(default='')
    timestamp = models.DateTimeField()

admin.site.register(Test)