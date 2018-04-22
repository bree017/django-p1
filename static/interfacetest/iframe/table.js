$(document).ready(function() {
    $("table.table tbody tr").on("click",function () {
        $(this).find('input[type="checkbox"]').click();
    })
    $("table.table tbody tr input[type='checkbox']").on("click",function () {  //阻止事件冒泡
        trid=$(this).val();
        if ($(this).is(':checked')){
            $("table.table tbody tr[trid='"+trid+"']").attr('selected',true);
        }
        else {
            $("table.table tbody tr[trid='"+trid+"']").attr('selected',false);
        }
        event.stopPropagation();
    })
    $("table.table thead th input[type='checkbox']").on("click",function () {
        if ($(this).is(':checked')){
            $("table.table tbody tr input[type='checkbox']:not(:checked)").click();
        }
        else{
            $("table.table tbody tr input[type='checkbox']:checked").click();
        }
    })
})

