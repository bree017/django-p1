#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time    : 2018/1/28 0028 下午 10:20
# @Author  : bree
# @Site    : 
# @File    : view1.py
# @Software: PyCharm

from django.http import HttpResponse
from django.shortcuts import render

def hello(request):
    context={}
    context['text']='Hello World'
    return render(request,'view1.html',context)
