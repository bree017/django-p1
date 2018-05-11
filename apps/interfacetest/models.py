from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.
class sysconfig(models.Model):
    id=models.AutoField(primary_key=True)
    sysname=models.CharField(null=False,max_length=30)
    host=models.CharField(null=False,default='http://localhost/',max_length=100)
    remark=models.TextField()
    created_date=models.DateTimeField(default=datetime.datetime.now)
    last_update_date=models.DateTimeField(default='1000-01-01 00:00:00')
    class Meta:
        db_table='sysconfig'

class ifmanage(models.Model):
    id=models.AutoField(primary_key=True)
    ifname=models.CharField(null=False,max_length=30)
    sys=models.ForeignKey(sysconfig,on_delete=models.PROTECT)
    url=models.CharField(null=False,default='/',max_length=100)
    remark=models.TextField()
    created_date=models.DateTimeField(default=datetime.datetime.now)
    last_update_date=models.DateTimeField(default='1000-01-01 00:00:00')
    class Meta:
        db_table='ifmanage'

class user_host(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    sys = models.ForeignKey(sysconfig,on_delete=models.CASCADE)
    host = models.CharField(null=False, default='http://localhost/', max_length=100)
    created_date=models.DateTimeField(default=datetime.datetime.now)
    last_update_date=models.DateTimeField(default='1000-01-01 00:00:00')
    class Meta:
        db_table = 'user_host'

class test_case(models.Model):
    interface = models.ForeignKey(ifmanage,on_delete=models.CASCADE)
    method = models.CharField(max_length=30,default='POST')
    param=models.CharField(max_length=1000,default='')
    header =models.CharField(max_length=1000,default='')
    body =models.CharField(max_length=1000,default='')
    cookie =models.CharField(max_length=1000,default='')
    expect =models.CharField(max_length=1000,default='')
    response = models.CharField(max_length=1000,default='')
    result = models.CharField(max_length=30,default='')
    isdefault = models.BooleanField(default=0)
    isactive = models.BooleanField(default=1)
    start_time =models.DateTimeField(default='1000-01-01 00:00:00')
    end_time =models.DateTimeField(default='1000-01-01 00:00:00')
    created_date=models.DateTimeField(default=datetime.datetime.now)
    last_update_date=models.DateTimeField(default='1000-01-01 00:00:00')
    class Meta:
        db_table = 'test_case'