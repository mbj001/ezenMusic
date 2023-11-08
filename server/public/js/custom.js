// view.html
$(function(){
    $("#del").click(function(){
        const delpass = $("#password_del").val();
        const delnum = $("#delnum").val();
        $.ajax({
            url: "/del",
            type: "post",
            data: { delpass: delpass, delnum: delnum},
            success: function(data){
                const rs = parseInt(data);
                if(rs > 0){
                    alert("삭제 성공");
                    location.href = "/";
                }
                else{
                    alert("비밀번호 틀림");
                    $("#password_del").val("");
                    $("#password_del").focus();
                }
            },
            error: function(xhr){
                alert("에러 발생\n 재시도 바람");
                $("#password_del").val("");
                $("#password_del").focus();
            }
        })
    })
})