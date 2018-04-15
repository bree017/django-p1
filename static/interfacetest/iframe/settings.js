$(document).ready(function(){
    $("#btn_s").on("click",function() {
            reflash();
        }
    )

    function reflash() {
         $.get("../api/getdata?type=settings",function(result){

            var result=$.parseJSON(result);
            if (result.issuccess=true){
                alert("data.errmsg2");
            }
            else {
                alert("data.errmsg");
            }
        })
    };
})