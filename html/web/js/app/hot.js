/**
 * Created by admin on 2017/7/18.
 */
$(function () {
    /*
    * 表单提交
    * */
    var $tipModal = $('#form-tips-modal');
    $('#hot-form').on('click','.btn-submit',function (e) {
        e.preventDefault();
        var accident = $('[name="accident"]');
        var phone = $('[name="phone"]');
        var wechat = $('[name="wechat"]');
        var firstName = $('[name="firstName"]');
        var company = $('[name="company"]');
        if($.trim(accident.val()) == ""){
            $tipModal.modal('show').find('p').text('加 * 为必填');
            return $(this);
        }
        if($.trim(phone.val()) == ""){
            $tipModal.modal('show').find('p').text('加 * 为必填');
            return $(this);
        }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone.val()))){
            $tipModal.modal('show').find('p').text('手机号码有误，请重填');
            return $(this);
        }
        if($.trim(wechat.val()) == ""){
            $tipModal.modal('show').find('p').text('加 * 为必填');
            return $(this);
        }
        var AjaxURL= "../OrderManagement/AjaxModifyOrderService.aspx";
        var _data = $('#hot-form').serialize();
        $.ajax({
            type: "POST",
            dataType: "html",
            url: AjaxURL,
            data: _data,
            success: function (result) {
                alert(result);
            },
            error: function(data) {
                alert("error:"+data.responseText);
            }
        });
    });
});