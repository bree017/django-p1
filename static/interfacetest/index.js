$(document).ready(function() {
    $("div.left-menu div.mbutton").on("click",function (e) {
        $("div.left-menu div.mbutton").attr("selected",false);
        $(this).attr("selected",true);
        var iframe = $(this).attr('iframe');
        $("div.frame").hide()
        $("div.frame[iframe=" + iframe +"]").show();
    })


})