$(document).ready(function() {
    $("#prev").on("click",function (e) {
        var ifname = $("input.ifname").val();
        var url = $("input.url").val();
        var sysid = $("select.sysid").val();
        var page =$(this).attr("page");
        var remark = $("input.remark").val();
        var url = "?page="+page+"&ifname="+ifname+"&url="+url+"&sysid="+sysid+"&remark="+remark;
        window.location.href=url;
    })
    $("#next").on("click",function (e) {
        var ifname = $("input.ifname").val();
        var url = $("input.url").val();
        var sysid = $("select.sysid").val();
        var page =$(this).attr("page");
        var remark = $("input.remark").val();
        var url = "?page="+page+"&ifname="+ifname+"&url="+url+"&sysid="+sysid+"&remark="+remark;
        window.location.href=url;
    })
    $("#btn_c").on("click",function (e) {
        $("div.filter input[type='text']").val('');
        $("div.filter select").val(0);
    })
    $("#btn_s").on("click",function (e) {
        var ifname = $("input.ifname").val();
        var url = $("input.url").val();
        var sysid = $("select.sysid").val();
        var remark = $("input.remark").val();
        var url = "?ifname="+ifname+"&url="+url+"&sysid="+sysid+"&remark="+remark;
        window.location.href=url;
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

    $("div.postman table.controler input.params").on("click",function () {
        $("div.postman div.request table.params").toggle();         //参数表格隐藏/显示
    })
    $("div.postman div.request table").on("blur", "input[type='text']",function (e) {        //用于参数表自动生成空行
        var trid=$(this).attr("trid");
        var ntrid=parseInt(trid)+1;
        var tableclass=$(this).attr("tclass");
        if($(this).val() !=""){
            if ($("div.postman div.request table."+tableclass+" tr[trid="+trid+"]").next().length == 0){     //判断下一个兄弟元素是否不存在
                content ="<tr trid="+ntrid+">" +
                    "<td><input type=\"text\" class='key' tclass="+tableclass+ " trid="+ntrid+"></td>" +
                    "<td><input type=\"text\" class='value' tclass="+tableclass+ " trid="+ntrid+"></td>" +
                    "<td><input type=\"button\" value=\"X\" class='delbtn' tclass="+tableclass+ " trid="+ntrid+"></td>" +
                    "</tr>"
                $("div.postman div.request table."+tableclass+" tbody").append(content);
            }
        }
    })
    $("div.postman div.request table").on("click", "input[type='button']",function () {         //表格行删除
        var trid=$(this).attr("trid");
        var tableclass=$(this).attr("tclass");
        if ($("div.postman div.request table[class="+tableclass+"] tr[trid="+trid+"]").next().length != 0){
            $("div.postman div.request table[class="+tableclass+"] tr[trid="+trid+"]").remove();
        }
    })
    $("div.postman div.label").on("click",function () {
        var config=$(this).text().toLowerCase();
        var labeltype=$(this).attr("labeltype");
        $("div.postman div."+labeltype).children().each(function () {
            if ($(this).attr("class").toLowerCase() == config) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        })
    })
    $("#req_body_type").on("change",function (e) {
        if($(this).val()=="application/x-www-form-urlencoded"){
            $("div.postman div.request div.config div.body textarea.body").hide();
            $("div.postman div.request div.config div.body table.body").show();
        }
        else{
            $("div.postman div.request div.config div.body textarea.body").show();
            $("div.postman div.request div.config div.body table.body").hide();
        }
    })

    //将接口信息与postman信息交互用户友好化
    $("table.table tbody tr").on("click","input[type='checkbox']",function () {
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
                            var method='post';
                            for (i in data){
                              if (data[i].isdefault == 1){
                                    method=data[i].method.toLowerCase();
                                    var param=$.parseJSON(data[i].param);
                                    var header=$.parseJSON(data[i].header);
                                    var body=$.parseJSON(data[i].body);
                                }
                            }
                            $("#pm_metod").val(method);
                            update("params",param);
                            update("header",header);
                            if (body != undefined && body.type != undefined){
                                $("#req_body_type").val(body.type)
                                $("#req_body_type").trigger("change");
                                if (body.type == 'application/x-www-form-urlencoded'){
                                    update("body",$.parseJSON(body.data));
                                }
                                else {
                                    $("#req_body").val(body.data);
                                }
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
    })
    $("#btn_p").on("click",function (e) {
        var url=$("#pm_url").val();
        //js正则不怎么会用，不支持（?<pattern）
        if (url.indexOf("://") != -1){
            url=url.split('://');
            var host=url[1].split('/');
            host.shift();
            host="/"+host.join('/');
        }
        else {
            var host=url;
        }
        $("#p_url").val(host);
    })

    //postman功能
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});  //支持跨域
    $("div.postman div.request table.controler input.send").on("click",function (e) {
        var pmmethod=$("#pm_metod").val();
        var pmurl=$("#pm_url").val();
        var pmheader=getdata('header');
        $("#rsp_header").html('');
        $('#rsp_rsp').text("sending...");
        if (pmmethod=='get'){
            var pmdata=getdata('params');
            $.ajax({
                url:pmurl,
                headers:pmheader,
                type:'get',
                data:pmdata,
                success:function(data,status,xhr){
                    rsp_update(data,xhr)
                },
                error:function(xhr, status, error){
                    rsp_update(error,xhr)
                }
            })}
        if (pmmethod=='post'){
            if ($("#req_body_type").val()=="application/x-www-form-urlencoded"){
                var pmdata=getdata("body");
            }
            else{
                var pmdata=$("#req_body").val();
            }

            pmheader['Content-Type']=$("#req_body_type").val();
            //将参数放到url上
            var urlpar=getdata('params');
            var urlpars=''
            for (var up in urlpar){
                urlpars += up + "=" + encodeURIComponent(urlpar[up]) + "&"
            }
            pmurl += "?" + urlpars.substring(0,urlpars.length-1);

            $.ajax({
                url:pmurl,
                headers:pmheader,
                type:'post',
                data:pmdata,
                success:function(data,status,xhr){
                    var eeesss=xhr.getAllResponseHeaders();
                    rsp_update(data,xhr)
                },
                error:function(xhr, status, error){
                    rsp_update(error,xhr)
                }
            })
        }
    })

    function rsp_update(data, xhr) {
        if (xhr.status != 0 && xhr.status!=404){
            // if (xhr.getResponseHeader('content-type').indexOf('application/json')>=0){  //判断是否json格式
            try{
                var options = {
                  collapsed: false,
                  withQuotes: false
                };
                if(typeof(data) == "object"){
                    $('#rsp_rsp').jsonViewer(data, options);
                }
                else{
                    $('#rsp_rsp').jsonViewer( JSON.parse(data), options);
                }

            }
            // else {
            catch (err){
                $('#rsp_rsp').text(data.toString());
            }
            var pmheader="<pre>"+xhr.getAllResponseHeaders()+"</pre>";
            $("#rsp_header").html(pmheader);
        }
        else{
            $('#rsp_rsp').text("404 Not Found");
        }

    }

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