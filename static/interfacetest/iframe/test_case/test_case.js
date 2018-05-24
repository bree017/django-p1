$(document).ready(function() {
    //用paging插件实现分页——一次性获取所有数据
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
                                        '<td tdname="body">' + JSON.parse(data[num].body).type +":<br>"+ JSON.parse(data[num].body).data + '</td>' +
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
    //通过django Paginator实现的分页——动态获取，但是会刷新页面
    $("#prev").on("click",function (e) {
        var page =$(this).attr("page");
        page_reflash(page);
    })
    $("#next").on("click",function (e) {
        var page =$(this).attr("page");
        page_reflash(page);
    })
    $("#btn_s").on("click",function (e) {
        page_reflash(1);
    })
    function page_reflash(page) {
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
        $("table.testcase input[type='checkbox']:checked").each(
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
         $("table.testcase input[type='checkbox']:checked").each(
            function(){
                chk_value.push($(this).val());
            })
        var data = {
            type:"testcase",
            act:"delete",
            id:chk_value.join(',')
        };
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                    $("#modal_d").trigger("reveal:close");
                    recase();
                }
                else{
                    alert(respon.errormsg);
                }
            }
        )
     })
    function recase(){
        $("div.table tbody tr[selected='selected']").click();
    }

    //弹窗中的交互
    $("div.reveal-modal div.label").on("click",function () {
        var config=$(this).text().toLowerCase();
        var labeltype=$(this).attr("labeltype");
        $("div.reveal-modal div."+labeltype).children().each(function () {
            if ($(this).attr("class").toLowerCase() == config) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        })
    })
    $("div.reveal-modal div.ts_settings table").on("blur", "input[type='text']",function (e) {        //用于参数表自动生成空行
        var trid=$(this).attr("trid");
        var ntrid=parseInt(trid)+1;
        var tableclass=$(this).attr("tclass");
        if($(this).val() !=""){
            if ($("div.reveal-modal div.ts_settings table."+tableclass+" tr[trid="+trid+"]").next().length == 0){     //判断下一个兄弟元素是否不存在
                content ="<tr trid="+ntrid+">" +
                    "<td><input type=\"text\" class='key' tclass="+tableclass+ " trid="+ntrid+"></td>" +
                    "<td><input type=\"text\" class='value' tclass="+tableclass+ " trid="+ntrid+"></td>" +
                    "<td><input type=\"button\" value=\"X\" class='delbtn' tclass="+tableclass+ " trid="+ntrid+"></td>" +
                    "</tr>"
                $("div.reveal-modal div.ts_settings table."+tableclass+" tbody").append(content);
            }
        }
    })
    $("div.reveal-modal div.ts_settings table").on("click", "input[type='button']",function () {         //表格行删除
        var trid=$(this).attr("trid");
        var tableclass=$(this).attr("tclass");
        if ($("div.reveal-modal div.ts_settings table[class="+tableclass+"] tr[trid="+trid+"]").next().length != 0){
            $("div.reveal-modal div.ts_settings table[class="+tableclass+"] tr[trid="+trid+"]").remove();
        }
    })
    $("#p_body_type").on("change",function (e) {
        if($(this).val()=="application/x-www-form-urlencoded"){
            $("div.reveal-modal div.ts_settings div.config div.body textarea.body").hide();
            $("div.reveal-modal div.ts_settings div.config div.body table.body").show();
        }
        else{
            $("div.reveal-modal div.ts_settings div.config div.body textarea.body").show();
            $("div.reveal-modal div.ts_settings div.config div.body table.body").hide();
        }
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