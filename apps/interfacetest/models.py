from django.db import models
import datetime

# Create your models here.
class sysconfig(models.Model):
    id=models.AutoField(primary_key=True)
    sysname=models.CharField(null=False,max_length=30)
    host=models.CharField(null=False,default='http://localhost/',max_length=100)
    remark=models.TextField()
    created_date=models.DateTimeField(default=datetime.datetime.now)
    last_update_date=models.DateTimeField(default='1000-01-01 00:00:00')


class ifmanage(models.Model):
    id=models.AutoField(primary_key=True)
    ifname=models.CharField(null=False,max_length=30)
    sysid=models.IntegerField()
    url=models.CharField(null=False,default='/',max_length=100)
    remark=models.TextField()
    created_date=models.DateTimeField(default=datetime.datetime.now)
    last_update_date=models.DateTimeField(default='1000-01-01 00:00:00')