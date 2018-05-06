$(document).ready(function() {
    $("#btn_s").on('click', function (e) {
        window.location.reload();
    })

    $("#modal_p input[value='确定']").on('click', function () {
        var data = {
            type:"settings",
            act:"add",
            sysname:$("#p_sysname").val(),
            host:$("#p_host").val(),
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
            $("#a_sysname").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='sysname']").text());
            $("#a_host").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='host']").text());
            $("#a_remark").val($("table.table tbody tr[trid='"+trid+"'] td[tdname='remark']").text());
            $("#modal_a").attr("trid",trid);
            e.preventDefault();
            var modalLocation = $(this).attr('to-data-reveal-id');
            $('#' + modalLocation).reveal($(this).data());
        }
    })

    $("#modal_a input[value='确定']").on('click', function (){
        var data = {
            type:"settings",
            act:"alter",
            sysname:$("#a_sysname").val(),
            host:$("#a_host").val(),
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
            type:"settings",
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

    $("#btn_u").on("click",function (e) {
        var  urls={};
        $("#data tr").each(function () {
            var sys=$(this).attr("trid");
            var usrhost=$(this).children("td[tdname='usrhost']").text();
            if (usrhost !=''){              //这样一旦设置了就不能删掉了，考虑到对实际应用影响不大，就这么办先
               urls[sys]=usrhost;
            }
        })
        var data={
            type:"user",
            act:"url",
            urls:JSON.stringify(urls)
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
})