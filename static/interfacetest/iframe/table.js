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
function getdata(table){    //获取table数据
    var data={};
    $("table." + table + " tbody").children("tr").each(function () {
        var key=$(this).find(".key").val();
        var value=$(this).find(".value").val();
        if (key !=''){
            data[key]=value;
        }
    })
    return data;
}
function update(table,dit){     //更新table数据
    if (dit==''){return;}
    $("table." + table + " tbody").html('');
    var id=1;
    for (i in dit){
        content ="<tr trid="+id+">" +
            "<td><input type=\"text\" class='key' tclass=\""+table+ "\" trid="+id+" value=\""+i+"\"></td>" +
            "<td><input type=\"text\" class='value' tclass=\""+table+ "\" trid="+id+" value=\""+dit[i]+"\"></td>" +
            "<td><input type=\"button\" value=\"X\" class='delbtn' tclass=\""+table+ "\" trid="+id+"></td>" +
            "</tr>"
        $("table." + table + " tbody").append(content);
        id++
    }
    content ="<tr trid="+id+">" +
        "<td><input type=\"text\" class='key' tclass=\""+table+ "\" trid="+id+"></td>" +
        "<td><input type=\"text\" class='value' tclass=\""+table+ "\" trid="+id+"></td>" +
        "<td><input type=\"button\" value=\"X\" class='delbtn' tclass=\""+table+ "\" trid="+id+"></td>" +
        "</tr>"
    $("table." + table + " tbody").append(content);

}
