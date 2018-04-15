from django.db import models

# Create your models here.
class sysconfig(models.Model):
    id=models.AutoField(primary_key=True)
    sysname=models.CharField(null=False,max_length=30)
    host=models.CharField(null=False,default='http://localhost/',max_length=100)
    remark=models.TextField()
