$(document).ready(function() {
    $("#prev").on("click",function (e) {
        var ifname = $("input.ifname").val();
        var url = $("input.url").val();
        var sysid = $("select.sysid").val();
        var page =$(this).attr("page");
        var url = "?page="+page+"&ifname="+ifname+"&url="+url+"&sysid="+sysid;
        window.location.href=url;
    })
    $("#next").on("click",function (e) {
        var ifname = $("input.ifname").val();
        var url = $("input.url").val();
        var sysid = $("select.sysid").val();
        var page =$(this).attr("page");
        var url = "?page="+page+"&ifname="+ifname+"&url="+url+"&sysid="+sysid;
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
        var url = "?ifname="+ifname+"&url="+url+"&sysid="+sysid;
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
        var tableclass=$(this).attr("class");
        if($(this).val() !=""){
            if ($("div.postman div.request table."+tableclass+" tr[trid="+trid+"]").next().length == 0){     //判断下一个兄弟元素是否不存在
                console.log(ntrid);
                content ="<tr trid="+ntrid+">" +
                    "<td><input type=\"text\" class="+tableclass+" trid="+ntrid+"></td>" +
                    "<td><input type=\"text\" class="+tableclass+" trid="+ntrid+"></td>" +
                    "<td><input type=\"button\" value=\"X\" class="+tableclass+" trid="+ntrid+"></td>" +
                    "</tr>"
                $("div.postman div.request table."+tableclass+" tbody").append(content);
            }
        }
    })
    $("div.postman div.request table").on("click", "input[type='button']",function () {
        var trid=$(this).attr("trid");
        var tableclass=$(this).attr("class");
        if ($("div.postman div.request table."+tableclass+" tr[trid="+trid+"]").next().length != 0){
            $("div.postman div.request table."+tableclass+" tr[trid="+trid+"]").remove();
        }
    })

})