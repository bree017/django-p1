#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time    : 2018/4/14 0014 下午 1:12
# @Author  : bree
# @Site    : 
# @File    : datastruct.py
# @Software: PyCharm
import datetime

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

class TestPlane():
    def __init__(self,testsuits=[]):
        self.testsuits=testsuits
        self.count=0
        self.passc=0
        self.failc=0
        self.starttime=datetime.datetime.now()
        self.endtime=''
        self.costtime=''

    def calc(self,testsuits=[]):
        self.count=0
        self.passc=0
        self.failc=0
        self.testsuits = testsuits
        self.endtime = datetime.datetime.now()
        self.costtime = self.endtime-self.starttime
        for testsuit in self.testsuits:
            self.count += len(testsuit['testcase'])
            for testcase in testsuit['testcase']:
                if testcase['issuccess']:
                    self.passc += 1
                else:
                    self.failc += 1