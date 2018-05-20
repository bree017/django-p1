$(document).ready(function() {
    //用paging插件
    $("div.table table.table tbody tr").on("click",function (e) {
        $("div.table table.table tbody tr").each(function (e) {
            $(this).attr("selected",false);
        })
        $(this).attr("selected",true);
        var trid= $(this).attr("trid");
        var eachpagecount=10;        //每页10行
        $.get(
            '../api/getdata',
            {"type":"testcase","ids":trid},
            function (rsp) {
                if (rsp.issuccess != 0) {
                    var data = rsp[0].data;
                    if (data.length != 0) {
                        $('#paging').clearpaging();  //初始化paging
                        $('#paging').paging({
                            nowPage: 1,
                            allPages: Math.ceil(data.length / eachpagecount),
                            displayPage: eachpagecount,
                            callBack: function (now) {
                                $("#tcdata").html("");
                                var currentPages = now * eachpagecount < data.length ? eachpagecount : data.length - (now - 1) * eachpagecount;
                                for (var i = 0; i < currentPages; i++) {
                                    var num = (now - 1) * eachpagecount + i;
                                    var _html = '<tr trid=' + data[num].id + '>' +
                                        '<td><input type="checkbox" value=' + data[num].id + '></td>' +
                                        '<td tdname="id">' + data[num].id + '</td>' +
                                        '<td tdname="method">' + data[num].method + '</td>' +
                                        '<td tdname="param">' + data[num].param + '</td>' +
                                        '<td tdname="header">' + data[num].header + '</td>' +
                                        '<td tdname="body">' + data[num].body + '</td>' +
                                        '<td tdname="cookie">' + data[num].cookie + '</td>' +
                                        '<td tdname="expect">' + data[num].expect + '</td>' +
                                        '<td tdname="isdefault">' + data[num].isdefault + '</td>' +
                                        '<td tdname="isactive">' + data[num].isactive + '</td>' +
                                        '<td tdname="remark"><pre>' + data[num].remark + '</pre></td>' +
                                        '</tr>';
                                    $("#tcdata").append(_html);
                                }
                            }
                        })
                    }
                }
                else {
                    alert(rsp.errormsg);
                }
            }
        )
    })


    $("#prev").on("click",function (e) {
        var page =$(this).attr("page");
        page_reflash(page);
    })
    $("#next").on("click",function (e) {
        var page =$(this).attr("page");
        page_reflash(page);
    })
    $("#btn_s").on("click",function (e) {
        page_reflash(1,1);
    })
    function page_reflash(page,page_tc) {
        var ifname = $("input.ifname").val();
        var url = $("input.url").val();
        var sysid = $("select.sysid").val();
        var remark = $("input.remark").val();
        // var ifid = $("div.table table.table tbody tr[selected='selected']").attr("trid");
        var url = "?page="+page+"&ifname="+ifname+"&url="+url+"&sysid="+sysid+"&remark="+remark;
        window.location.href=url;
    }
    $("#btn_c").on("click",function (e) {
        $("div.filter input[type='text']").val('');
        $("div.filter select").val(0);
        $("div.table table.table tbody tr").each(function (e) {
            $(this).attr("selected",false);
        })
    })



    $("#modal_p input[value='确定']").on('click', function () {
        var data = {
            type:"ifmanage",
            act:"add",
            ifname:$("#p_ifname").val(),
            sysid:$("#p_sysid").val(),
            url:$("#p_url").val(),
            remark:$("#p_remark").val()
        };
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                    window.location.reload();
                }
                else{
                    alert(respon.errormsg);
                }
            }
        )
    })
    $("#btn_a").on('click', function (e) {
        var chk_value =new Array();
        $("table.table input[type='checkbox']:checked").each(
            function(){
                chk_value.push($(this).val());
            }
        )
        if (chk_value.length != 1){
            alert('请选择一条数据');
        }
        else{
            var trid=chk_value[0];
            $("#a_ifname").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='ifname']").text());
            $("#a_sysid").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='sysname']").attr("sysid"));
            $("#a_url").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='url']").text());
            $("#a_remark").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='remark']").text());
            $("#modal_a").attr("trid",trid);
            e.preventDefault();
            var modalLocation = $(this).attr('to-data-reveal-id');
            $('#' + modalLocation).reveal($(this).data());
        }
    })
    $("#modal_a input[value='确定']").on('click', function (){
        var data = {
            type:"ifmanage",
            act:"alter",
            ifname:$("#a_ifname").val(),
            sysid:$("#a_sysid").val(),
            url:$("#a_url").val(),
            remark:$("#a_remark").val(),
            id:$("#modal_a").attr('trid')
        };
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                    window.location.reload();
                }
                else{
                    alert(respon.errormsg);
                }
            }
        )
     })
    $("#btn_d").on('click', function (e) {
        var chk_value =new Array();
        $("table.table input[type='checkbox']:checked").each(
            function(){
                chk_value.push($(this).val());
            }
        )
        if (chk_value.length == 0){
            alert('请选择数据');
        }
        else{
            e.preventDefault();
            var modalLocation = $(this).attr('to-data-reveal-id');
            $('#' + modalLocation).reveal($(this).data());
        }
    })
    $("#modal_d input[value='确定']").on('click', function (){
         var chk_value =new Array();
         $("table.table input[type='checkbox']:checked").each(
            function(){
                chk_value.push($(this).val());
            })
        var data = {
            type:"ifmanage",
            act:"delete",
            id:chk_value.join(',')
        };
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                    window.location.reload();
                }
                else{
                    alert(respon.errormsg);
                }
            }
        )
     })


    //将接口信息与postman信息交互用户友好化_改成动态获取测试用例
    $("table.table tbody tr input[type='checkbox']").on("click",function () {
        var trid=$(this).val();
        var host=$("table.table tr[trid="+trid+"] td[tdname='sysname']").text().split(":");
        host.shift();
        host=host.join(':');
        var path=$("table.table tr[trid="+trid+"] td[tdname='url']").text();
        if (path.substr(0,1)!='/' ){path ='/'+path;}
        if ($(this).is(':checked')){
            $("#pm_url").val(host+path);
            $.get(
                "../api/getdata",
                {"type":"testcase","ids":trid,},
                function (rsp) {
                    if (rsp.issuccess != 0){
                        var data=rsp[0].data;
                        if(data.length != 0)
                        {
                            for (i in data){
                              if (data[i].isdefault == 1){
                                    var method=data[i].method.toLowerCase();
                                    var param=$.parseJSON(data[i].param);
                                    var header=$.parseJSON(data[i].header);
                                    var body=$.parseJSON(data[i].body);
                                }
                            }
                            $("#pm_metod").val(method);
                            update("params",param);
                            update("header",header);
                            $("#req_body_type").val(body.type)
                            $("#req_body_type").trigger("change");
                            if (body.type == 'application/x-www-form-urlencoded'){
                                update("body",$.parseJSON(body.data));
                            }
                            else {
                                $("#req_body").val(body.data);
                            }
                        }
                        // else{                //想一下还是不要置空了
                        //     $("#pm_metod").val('post');
                        //     update("params",{});
                        //     update("header",{});
                        //     update("body",{});
                        //     $("#req_body").val('');
                        // }
                    }
                    else{
                        alert(rsp.errormsg);
                    }
            }
        )
        }

        event.stopPropagation();
    })


    $("#add_case").on("click",function (e) {
        var chk_value =new Array();
        $("table.table input[type='checkbox']:checked").each(
            function(){
                chk_value.push($(this).val());
            }
        )
        if (chk_value.length != 1){
            alert('请选择一条数据');
            return;
        }
        if($('#req_body_type').val()=='application/x-www-form-urlencoded'){
            var bodydata=JSON.stringify(getdata('body'));
        }
        else{
            var bodydata=$('#req_body').val();
        }
        var body={
            type:$('#req_body_type').val(),
            data:bodydata
        }
        data ={
            'type':'testcase',
            'act':'add',
            'interfaceid':chk_value[0],
            'method':$("#pm_metod").val(),
            'param':JSON.stringify(getdata('params')),
            'header':JSON.stringify(getdata('header')),
            'body':JSON.stringify(body),
            'isdefault':1,
            'isactive':1
        }
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                    alert('添加成功');
                }
                else{
                    alert(respon.errormsg);
                }
            }
        )
    })
})