from django.shortcuts import render
from apps.interfacetest import models
from django.http import JsonResponse
from django.http import HttpResponse
from apps.interfacetest.datastruct import ResultSet
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json

# Create your views here.
def index(request):
    return render(request,'interfacetest/index.html')

def settings_old(request):
    return render(request,'interfacetest/iframe/settings(old).html')

def settings(request):
    page = request.GET.get('page')
    contact_list = models.sysconfig.objects.all()  # 获取所有contacts,假设在models.py中已定义了Contacts模型
    paginator = Paginator(contact_list, 20) # 每页20条
    try:
        contacts = paginator.page(page) # contacts为Page对象！
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        contacts = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        contacts = paginator.page(paginator.num_pages)
    return render(request,'interfacetest/iframe/settings.html',{'contacts': contacts})

#查询数据接口,不用了
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
            type = par.getlist('type')
            act = par.getlist('act')
            sysname = par.getlist('sysname')
            if type[0] == '' or act[0] == '' or sysname[0] == '':       #只获取第一个参数
                return JsonResponse(ResultSet(0, 'type、act、sysname字段不能为空').todict())
            elif type[0] == 'settings':
                if act[0] == 'add':
                    data={
                        'sysname': par.getlist('sysname')[0],
                        'host': par.getlist('host')[0],
                        'remark': par.getlist('remark')[0]
                    }
                    models.sysconfig.objects.create(**data)
                    return JsonResponse(ResultSet(1).todict())
            else:
                return JsonResponse(ResultSet(0, 'type字段有误').todict())

        else:
            return JsonResponse(ResultSet(0,'请求方式应该为POST').todict())
    except Exception as e:
        return JsonResponse(ResultSet(0, str(e)).todict())
