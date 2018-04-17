$(document).ready(function(){
    $("#btn_s").on("click",function() {
            reflash();
        }
    )

    function reflash() {
         $.get("../api/getdata?type=settings",function(result){
             if (result.issuccess=true){
                rebtable(result.data);
             }
             else {
                alert(result.errormsg);
             }
        })
    };
    function rebtable(data) {
        if (data.length != undefined){
            // $("tbody").html("");    //清空表格内容
            var str="";
            for (var i=0;i<data.length;i++){
                str += "<tr>" +
                        "<th><input type=\"checkbox\" value='" + data[i].pk + "'></th>" +
                        "<td>" + data[i].fields.sysname + "</td>" +
                        "<td>" + data[i].fields.host + "</td>" +
                        "<td>" + data[i].fields.remark + "</td>" +
                        "</tr>";
            }
        }
        else{
            str =='<tr><td><input type="checkbox"></td><td colspan="3">没有数据</td></tr>';
        }
        $("tbody").html(str);
    }
})