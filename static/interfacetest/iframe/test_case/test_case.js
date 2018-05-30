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


    $("#btn_p").on('click', function (e) {
        var chk_value =new Array();
        $("table.table tbody tr[selected='selected']").each(
            function(){
                chk_value.push($(this).attr('trid'));
            }
        )
        if (chk_value.length != 1){
            alert('请选择接口');
        }
        else{
            e.preventDefault();
            var modalLocation = $(this).attr('to-data-reveal-id');
            $('#' + modalLocation).reveal($(this).data());
        }
    })
    $("#modal_p input[value='确定']").on('click', function () {
        if($('#p_body_type').val()=='application/x-www-form-urlencoded'){
            var bodydata=JSON.stringify(getdata('body'));
        }
        else{
            var bodydata=$('#p_body').val();
        }
        var body={
            type:$('#p_body_type').val(),
            data:bodydata
        }
        var data = {
            type:"testcase",
            act:"add",
            interfaceid:$("table.table tbody tr[selected='selected']").attr("trid"),
            method:$("#p_method").val(),
            param:JSON.stringify(getdata('params')),
            header:JSON.stringify(getdata('header')),
            body:JSON.stringify(body),
            cookie:$('#p_cookie').val(),
            expect:JSON.stringify(getdata('expect')),
            isdefault:$("#p_isdefault").val(),
            isactive:$("#p_isactive").val(),
            remark:$('#p_remark').val()
        };
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                     $("#modal_p").trigger("reveal:close");
                    recase();
                }
                else{
                    alert(respon.errormsg);
                }
            }
        )
    })
    $("#btn_a").on('click', function (e) {
        var chk_value =new Array();
        $("table.testcase input[type='checkbox']:checked").each(
            function(){
                chk_value.push($(this).val());
            }
        )
        if (chk_value.length != 1){
            alert('请选择一条数据');
        }
        else{
            var trid=chk_value[0];
            $("#a_method").val($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='method']").text().toLowerCase());
            $("#a_isdefault").val(($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='isdefault']").text().toLowerCase()=='true')?1:0);
            $("#a_isactive").val(($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='isactive']").text()=='true')?1:0);
            $("table.testcase tbody tr[trid='"+trid+"'] td[tdname='param']").text()!=''?(update("params",JSON.parse($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='param']").text()))):false;
            $("table.testcase tbody tr[trid='"+trid+"'] td[tdname='header']").text()!=''?(update("header",JSON.parse($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='header']").text()))):false;
            if ($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='body']").text()!=''){
                var bdtindex=$("table.testcase tbody tr[trid='"+trid+"'] td[tdname='body']").text().indexOf(":");
                var bodytype=$("table.testcase tbody tr[trid='"+trid+"'] td[tdname='body']").text().substring(0,bdtindex);
                var bodydata=$("table.testcase tbody tr[trid='"+trid+"'] td[tdname='body']").text().substring(bdtindex+1);
                $("#a_body_type").val(bodytype);
                $("#a_body_type").trigger("change");
                if (bodytype=="application/x-www-form-urlencoded") {
                    update("body",JSON.parse(bodydata));
                }
                else{
                    $("#a_body").val(bodydata);
                }
            }
            $("#a_cookie").val($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='cookie']").text());
            $("table.testcase tbody tr[trid='"+trid+"'] td[tdname='expect']").text()!=''?(update("expect",JSON.parse($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='expect']").text()))):false;
            $("#a_remark").val($("table.testcase tbody tr[trid='"+trid+"'] td[tdname='remark']").text());
            $("#modal_a").attr("trid",trid);
            e.preventDefault();
            var modalLocation = $(this).attr('to-data-reveal-id');
            $('#' + modalLocation).reveal($(this).data());
        }
    })
    $("#modal_a input[value='确定']").on('click', function (){
        if($('#a_body_type').val()=='application/x-www-form-urlencoded'){
            var bodydata=JSON.stringify(getdata('body'));
        }
        else{
            var bodydata=$('#a_body').val();
        }
        var body={
            type:$('#a_body_type').val(),
            data:bodydata
        }
        var data = {
            type:"testcase",
            act:"alter",
            id:$("#modal_a").attr("trid"),
            interfaceid:$("table.table tbody tr[selected='selected']").attr("trid"),
            method:$("#a_method").val(),
            param:JSON.stringify(getdata('params')),
            header:JSON.stringify(getdata('header')),
            body:JSON.stringify(body),
            cookie:$('#a_cookie').val(),
            expect:JSON.stringify(getdata('expect')),
            isdefault:$("#a_isdefault").val(),
            isactive:$("#a_isactive").val(),
            remark:$('#a_remark').val()
        };
        $.post(
            '../api/postdata',
            data,
            function(respon){
                if (respon.issuccess == 1){
                     $("#modal_a").trigger("reveal:close");
                    recase();
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
    $("#a_body_type").on("change",function (e) {
        if($(this).val()=="application/x-www-form-urlencoded"){
            $("div.reveal-modal div.ts_settings div.config div.body textarea.body").hide();
            $("div.reveal-modal div.ts_settings div.config div.body table.body").show();
        }
        else{
            $("div.reveal-modal div.ts_settings div.config div.body textarea.body").show();
            $("div.reveal-modal div.ts_settings div.config div.body table.body").hide();
        }
    })


})