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
})