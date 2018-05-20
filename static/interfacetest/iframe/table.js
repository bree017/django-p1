$(document).ready(function() {
    $("div.table tbody").on("click","tr input[type='checkbox']",function (event) {  //阻止事件冒泡
        trid=$(this).val();
        if ($(this).is(':checked')){
            $("div.table tbody tr[trid='"+trid+"']").attr('selected',true);
        }
        else {
            $("div.table tbody tr[trid='"+trid+"']").attr('selected',false);
        }
        event.stopImmediatePropagation();
    })
    $("div.table tbody").on("click","tr",function () {
         $(this).find('input[type="checkbox"]').trigger("click");
         // event.stopPropagation();
    })
    $("div.table thead th").on("click","input[type='checkbox']",function () {
        if ($(this).is(':checked')){
            $("div.table tbody tr input[type='checkbox']:not(:checked)").trigger("click");
        }
        else{
            $("div.table tbody tr input[type='checkbox']:checked").trigger("click");
        }
    })
})

