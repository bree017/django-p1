from django.shortcuts import render
from apps.interfacetest import models
from django.http import JsonResponse
from django.http import HttpResponse
from apps.interfacetest.datastruct import ResultSet
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json
import datetime

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
        if request.method != 'POST':return JsonResponse(ResultSet(0, '请求方式应该为POST').todict())
        par = request.POST
        type = par.getlist('type')
        act = par.getlist('act')
        if not (type and act):return JsonResponse(ResultSet(0, 'type、act参数必填').todict())
        if type[0]=='' or act[0]=='':return JsonResponse(ResultSet(0, 'type、act参数不能为空字符串').todict())
        if type[0] == 'settings':                #只获取第一个参数
            sysname = par.getlist('sysname')
            id = par.getlist('id')
            if act[0] == 'add':
                if not sysname: return JsonResponse(ResultSet(0, '添加数据sysname参数必填').todict())
                if sysname[0] == '': return JsonResponse(ResultSet(0, 'sysname参数不能为空字符串').todict())
                data={
                    'sysname':sysname[0],
                    'host': (par.getlist('host')) and par.getlist('host')[0] or '',
                    'remark':(par.getlist('remark')) and (par.getlist('remark')[0]) or ''
                }
                models.sysconfig.objects.create(**data)
                return JsonResponse(ResultSet(1).todict())
            elif act[0] == 'alter':
                if not sysname: return JsonResponse(ResultSet(0, '添加数据sysname参数必填').todict())
                if sysname[0] == '': return JsonResponse(ResultSet(0, 'sysname参数不能为空字符串').todict())
                if not id: return JsonResponse(ResultSet(0, '添加数据id参数必填').todict())
                if id[0] == '': return JsonResponse(ResultSet(0, 'id参数不能为空字符串').todict())
                data={
                    'sysname':sysname[0],
                    'host': (par.getlist('host')) and par.getlist('host')[0] or '',
                    'remark':(par.getlist('remark')) and (par.getlist('remark')[0]) or '',
                    'last_update_date':datetime.datetime.now()
                }
                models.sysconfig.objects.filter(id=id[0]).update(**data)
                return JsonResponse(ResultSet(1).todict())
            elif act[0] =='delete':
                if not id: return JsonResponse(ResultSet(0, '添加数据id参数必填').todict())
                if id[0] == '': return JsonResponse(ResultSet(0, 'id参数不能为空字符串').todict())
                ids=id[0].split(',')
                models.sysconfig.objects.filter(id__in=ids).delete()
                return JsonResponse(ResultSet(1).todict())
            else:
                return JsonResponse(ResultSet(0, 'act参数有误').todict())
        else:
            return JsonResponse(ResultSet(0, 'type参数有误').todict())
    except Exception as e:
        return JsonResponse(ResultSet(0, str(e)).todict())
