#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time    : 2018/4/14 0014 下午 1:12
# @Author  : bree
# @Site    : 
# @File    : datastruct.py
# @Software: PyCharm

class ResultSet():
    def __init__(self,issuccess=1,errormsg=None,data={}):
        self.issuccess = (issuccess == 1) and True or False         #满足括号里面的返回and后面的值，否则返回or后面的值
        self.errormsg = errormsg
        self.data =data

    def todict(self):
        return {
            'issuccess':self.issuccess,
            'errormsg':self.errormsg,
            'data':self.data,
        }