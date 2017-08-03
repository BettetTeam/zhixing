/**
 * Created by admin on 2017/7/18.
 */
/**
 * Created by admin on 2017/7/18.
 */
$(function () {
    /*
     * 表单提交
     * */
    $('.checkbox input').on('change',function () {
        var _checked = $(this)[0].checked;
       if(_checked)
           $(this).parent().addClass('checked');
        else
           $(this).parent().removeClass('checked');
    });
    if($('.checkbox input')[0].checked==true){
        $(this).parent().addClass('checked');
    }
    var $tipModal = $('#form-tips-modal');
    $('#hot-form').on('click','.btn-submit',function (e) {
        e.preventDefault();
        var _email = $('[name="emailcheck"]');
        var _link = $('[name ="txtlink" ]');
        var phone = $('[name="phone"]');
        var wechat = $('[name="wechat"]');
        var firstName = $('[name="firstName"]');
        if(_email[0].checked == false && $.trim(_link.val()) == ""){
            $tipModal.modal('show').find('p').text('邮箱或者文章链接必须填写其中一个！');
            return $(this);
        }
        if($.trim(firstName.val()) == ""){
            $tipModal.modal('show').find('p').text('姓名不能为空！');
            return $(this);
        }
        if ($.trim(phone.val()) == "") {
            $tipModal.modal('show').find('p').text('手机号码不能为空！');
            return $(this);
        }
        if($.trim(phone.val()) != ""&&!(/^1(3|4|5|7|8)\d{9}$/.test(phone.val()))){
            $tipModal.modal('show').find('p').text('手机号码有误，请重填');
            return $(this);
        }
        if ($.trim(wechat.val()) == "") {
            $tipModal.modal('show').find('p').text('微信号不能为空！');
            return $(this);
        }
        var AjaxURL= "../OrderManagement/AjaxModifyOrderService.aspx";
        var _data = $('#hot-form').serialize();
        alert(_data);
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