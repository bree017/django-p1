$(document).ready(function() {
    $("#modal_p input[value='确定']").on('click', function () {
        var data = {
            type:"settings",
            act:"add",
            sysname:$("#a_sysname").val(),
            host:$("#a_host").val(),
            remark:$("#a_remark").val()
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
    // $("#modal_a input[value='确定']").on('click', function () {
    $("#btn_a").on('click', function (e) {
        // alert('111');
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
            e.preventDefault();
            var modalLocation = $(this).attr('to-data-reveal-id');
            $('#' + modalLocation).reveal($(this).data());
        }
    })
})