from django.shortcuts import render
from apps.interfacetest import models
from django.http import JsonResponse
from django.http import HttpResponse
from apps.interfacetest.datastruct import ResultSet
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from itertools import chain
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as ulogin
from django.contrib.auth.models import User
from django.forms.models import model_to_dict

import json
import datetime

# Create your views here.
def login(request):
    return render(request,'interfacetest/login.html')

#不用先
def userlogin(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    rdurl = request.POST.get('next')
    user=authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            ulogin(request, user)
            return JsonResponse(ResultSet(1,'',{'url':rdurl}).todict())
        else:
            return JsonResponse(ResultSet(0, '用户未激活！').todict())
    else:
        return JsonResponse(ResultSet(0, '账号/密码错误！').todict())

# @login_required
def index(request):
    return render(request,'interfacetest/index.html')

# @login_required
def settings(request):
    page = request.GET.get('page')
    contact_list = models.sysconfig.objects.all()  # 获取所有contacts,假设在models.py中已定义了Contacts模型
    paginator = Paginator(contact_list, 20) # 每页20条
    user=request.user
    userhost=models.user_host.objects.filter(user=user.id)
    try:
        contacts = paginator.page(page) # contacts为Page对象！
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        contacts = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        contacts = paginator.page(paginator.num_pages)
    return render(request,'interfacetest/iframe/settings.html',{'contacts': contacts,"userhost":userhost})

# @login_required
def ifmanage(request):
    try:
        page = request.GET.get('page')
        ifname = request.GET.get('ifname')
        url = request.GET.get('url')
        sysid = request.GET.get('sysid')
        remark = request.GET.get('remark')

        contact_list = models.ifmanage.objects.all()
        if ifname == None or ifname == '':
            ifname = ''
        else:
            contact_list = contact_list.filter(ifname__contains=ifname)
        if url == None or url == '':
            url = ''
        else:
            contact_list = contact_list.filter(url__contains=url)
        if sysid == None or sysid == '0':
            sysid = 0
        else:
            sysid=int(sysid)
            contact_list = contact_list.filter(sys=sysid)
        if remark == None or remark == '':
            remark = ''
        else:
            contact_list = contact_list.filter(remark__contains=remark)

        filter ={'ifname':ifname,'url':url,'sysid':sysid,'remark':remark}
        testsys=models.sysconfig.objects.values('id','sysname').distinct()
        paginator = Paginator(contact_list, 10) # 每页20条
        try:
            contacts = paginator.page(page) # contacts为Page对象！
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            contacts = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            contacts = paginator.page(paginator.num_pages)

        user = request.user
        userhost = models.user_host.objects.filter(user=user.id)
        hostid =userhost.values_list('sys',flat=True)
        return render(request,'interfacetest/iframe/interface_management.html',{'contacts': contacts,'testsys':testsys,'filter':filter,'userhost':userhost,'hostid':hostid},)
    except Exception as e:
            return JsonResponse(ResultSet(0, str(e)).todict())

# @login_required
def testcase(request):
    try:
        page = request.GET.get('page')
        ifname = request.GET.get('ifname')
        url = request.GET.get('url')
        sysid = request.GET.get('sysid')
        remark = request.GET.get('remark')

        contact_list = models.ifmanage.objects.all()
        if ifname == None or ifname == '':
            ifname = ''
        else:
            contact_list = contact_list.filter(ifname__contains=ifname)
        if url == None or url == '':
            url = ''
        else:
            contact_list = contact_list.filter(url__contains=url)
        if sysid == None or sysid == '0':
            sysid = 0
        else:
            sysid=int(sysid)
            contact_list = contact_list.filter(sys=sysid)
        if remark == None or remark == '':
            remark = ''
        else:
            contact_list = contact_list.filter(remark__contains=remark)

        filter ={'ifname':ifname,'url':url,'sysid':sysid,'remark':remark}
        testsys=models.sysconfig.objects.values('id','sysname').distinct()
        paginator = Paginator(contact_list, 10) # 每页20条
        try:
            contacts = paginator.page(page) # contacts为Page对象！
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            contacts = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            contacts = paginator.page(paginator.num_pages)

        user = request.user
        userhost = models.user_host.objects.filter(user=user.id)
        hostid =userhost.values_list('sys',flat=True)
        return render(request,'interfacetest/iframe/test_case.html',{'contacts': contacts,'testsys':testsys,'filter':filter,'userhost':userhost,'hostid':hostid},)
    except Exception as e:
            return JsonResponse(ResultSet(0, str(e)).todict())

def getdata(request):
    try:
        if request.method != 'GET':return JsonResponse(ResultSet(0, '请求方式应该为GET').todict())
        par = request.GET
        type = par.getlist('type')
        if not type or type[0] =='':return JsonResponse(ResultSet(0, 'type参数必填').todict())
        if type[0] == 'testcase':       #只获取第一个作为type参数
            ids=par.getlist('ids')[0].split(',')
            data =[]
            for id in ids:
                try:
                    objlist=[]
                    for obj in models.test_case.objects.filter(interface_id=id):
                        objlist.append(model_to_dict(obj))
                    result=ResultSet(1,'',objlist).todict()
                except Exception as e:
                    result = ResultSet(0,str(e)).todict()
                data.append(result)
            return JsonResponse(data,safe=False)
        else :
            return JsonResponse(ResultSet(0, 'type参数有误').todict())
    except Exception as e:
        return JsonResponse(ResultSet(0, str(e)).todict())

# @login_required
def postdata(request):
    try:
        if request.method != 'POST':return JsonResponse(ResultSet(0, '请求方式应该为POST').todict())
        par = request.POST
        type = par.getlist('type')
        act = par.getlist('act')
        if not (type and act):return JsonResponse(ResultSet(0, 'type、act参数必填').todict())
        if type[0] =='' or act[0]=='':return JsonResponse(ResultSet(0, 'type、act参数不能为空字符串').todict())
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
                if not sysname: return JsonResponse(ResultSet(0, '修改数据sysname参数必填').todict())
                if sysname[0] == '': return JsonResponse(ResultSet(0, 'sysname参数不能为空字符串').todict())
                if not id: return JsonResponse(ResultSet(0, '修改数据id参数必填').todict())
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
        if type[0] == 'ifmanage':
            ifname = par.getlist('ifname')
            id = par.getlist('id')
            sysid = par.getlist('sysid')
            if act[0] == 'add':
                if not ifname: return JsonResponse(ResultSet(0, '添加数据接口名必填').todict())
                if ifname[0] == '': return JsonResponse(ResultSet(0, '接口名不能为空').todict())
                if not sysid: return JsonResponse(ResultSet(0, '添加数据测试系统必选').todict())
                if sysid[0] == '': return JsonResponse(ResultSet(0, '测试系统不能为空').todict())
                data={
                    'ifname':ifname[0],
                    'sys':models.sysconfig.objects.get(id=sysid[0]),
                    'url': (par.getlist('url')) and par.getlist('url')[0] or '',
                    'remark':(par.getlist('remark')) and (par.getlist('remark')[0]) or ''
                }
                models.ifmanage.objects.create(**data)
                return JsonResponse(ResultSet(1).todict())
            elif act[0] == 'alter':
                if not ifname: return JsonResponse(ResultSet(0, '修改数据接口名必填').todict())
                if ifname[0] == '': return JsonResponse(ResultSet(0, '接口名不能为空').todict())
                if not sysid: return JsonResponse(ResultSet(0, '修改数据测试系统必选').todict())
                if sysid[0] == '': return JsonResponse(ResultSet(0, '测试系统不能为空').todict())
                if not id: return JsonResponse(ResultSet(0, '修改数据id必填').todict())
                if id[0] == '': return JsonResponse(ResultSet(0, 'id不能为空').todict())

                data={
                    'id':id[0],
                    'ifname':ifname[0],
                    'sys':models.sysconfig.objects.get(id=sysid[0]),
                    'url': (par.getlist('url')) and par.getlist('url')[0] or '',
                    'remark':(par.getlist('remark')) and (par.getlist('remark')[0]) or '',
                    'last_update_date':datetime.datetime.now()
                }
                models.ifmanage.objects.filter(id=id[0]).update(**data)
                return JsonResponse(ResultSet(1).todict())
            elif act[0] == 'delete':
                if not id: return JsonResponse(ResultSet(0, '添加数据id参数必填').todict())
                if id[0] == '': return JsonResponse(ResultSet(0, 'id参数不能为空字符串').todict())
                ids = id[0].split(',')
                models.ifmanage.objects.filter(id__in=ids).delete()
                return JsonResponse(ResultSet(1).todict())
        if type[0] == 'user':
            if act[0] == 'url':
                ruser=request.user
                if ruser.id == None :return JsonResponse(ResultSet(0, '请先登录').todict())
                urls = json.loads(par.getlist('urls')[0])
                if urls=={} :return JsonResponse(ResultSet(1).todict())
                for url in urls:
                    obj=models.user_host.objects.filter(user=ruser.id,sys=url)
                    if obj.count() > 0:
                        obj.update(**{'host':urls[url],'last_update_date':datetime.datetime.now()})
                    else:
                        sys = models.sysconfig.objects.get(id=url)
                        user = User.objects.get(id=ruser.id)
                        data={
                            "user":user,
                            "sys":sys,
                            "host":urls[url]
                        }
                        models.user_host.objects.create(**data)
                return JsonResponse(ResultSet(1).todict())
        if type[0] == 'testcase':
            if act[0] == 'add':
                interfaceid= par.getlist('interfaceid')
                if not interfaceid : return JsonResponse(ResultSet(0, 'interfaceid参数有误1').todict())
                if interfaceid[0] == '': return JsonResponse(ResultSet(0, 'interfaceid参数有误2').todict())
                data ={
                    'interface':models.ifmanage.objects.get(id=int(interfaceid[0])),
                    'method':(par.getlist('method'))and (par.getlist('method')[0]) or 1,
                    'param':(par.getlist('param')) and par.getlist('param')[0] or '',
                    'header':(par.getlist('header')) and par.getlist('header')[0] or '',
                    'body':(par.getlist('body')) and par.getlist('body')[0] or '',
                    'cookie':(par.getlist('cookie')) and par.getlist('cookie')[0] or '',
                    'expect':(par.getlist('expect')) and par.getlist('expect')[0] or '',
                    'isdefault':(par.getlist('isdefault')) and par.getlist('isdefault')[0] or 0,
                    'isactive':(par.getlist('isactive')) and par.getlist('isactive')[0] or 1
                }
                case = models.test_case.objects.filter(interface=interfaceid[0],isdefault=1)
                if case.count() > 0 and par.getlist('isdefault')[0]:
                    case.update(**data)
                else:
                    models.test_case.objects.create(**data)
                return JsonResponse(ResultSet(1).todict())
        else:
            return JsonResponse(ResultSet(0, 'type参数有误').todict())
    except Exception as e:
        return JsonResponse(ResultSet(0, str(e)).todict())


