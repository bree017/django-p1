from django.shortcuts import render
from apps.interfacetest import models
from django.http import JsonResponse
from django.http import HttpResponse
from apps.interfacetest.datastruct import ResultSet
from django.core import serializers
import json

# Create your views here.
def index(request):
    return render(request,'interfacetest/index.html')

def settings(request):
    return render(request,'interfacetest/iframe/settings.html')

#实现查询数据接口
def getdata(request):
    try:
        if request.method == 'GET':
            par = request.GET
            gettype = par.getlist('type')
            if gettype == []:
                return JsonResponse(ResultSet(0, 'type字段不能为空').todict())
            elif gettype[0] == 'settings':       #只获取第一个作为type参数
                data = serializers.serialize('json', models.sysconfig.objects.all())
                # 为了重新构造json将data又转换回字符串了，就导致消耗多余的系统资源，以后再优化
                return JsonResponse(ResultSet(1, '',json.loads(data)).todict())
            else:
                return JsonResponse(ResultSet(0, 'type字段有误').todict())
        else:
            return JsonResponse(ResultSet(0,'请求方式应该为GET').todict())
    except Exception as e:
        return JsonResponse(ResultSet(0, str(e)).todict())

def postdata(request):
    try:
        if request.method == 'POST':
            par = request.POST
            gettype = par.getlist('type')
            if gettype == []:
                return JsonResponse(ResultSet(0, 'type字段不能为空').todict())
            elif gettype[0] == 'settings':       #只获取第一个作为type参数

                return JsonResponse(ResultSet(1, '',data).todict())
            else:
                return JsonResponse(ResultSet(0, 'type字段有误').todict())

        else:
            return JsonResponse(ResultSet(0,'请求方式应该为POST').todict())
    except Exception as e:
        return JsonResponse(ResultSet(0, str(e)).todict())
