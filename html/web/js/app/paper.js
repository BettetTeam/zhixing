/**
 * Created by admin on 2017/7/27.
 */

$(function () {
    //已经上传的文件删除方法
    function deleteFile(fileName, cb) {//删出上传文件时向后台传送数据
        //debugger;
        //console.log(fileName);
        var flag;
        $.ajax({
            url: "/img/delete" + "?fileName=" + fileName,//backURL 删出已经上传的文件
            type: "GET",
            dataType: "json",
            cache: false,
            success: function (result) {
                if (result.code == '0') {
                    flag = true;//后台删除成功则返回true
                } else {
                    flag = false;//后台删除失败则返回false
                }
                cb(flag);
            },
            error: function (data) {
                flag = false;//后台删除失败则返回false
                cb(flag);
            }
        });
    }

    /*
     * 文件预览
     * */
    var scanModal = $('#filescan-modal')
            .on('show.bs.modal', function (e) {
                var filename = $(e.relatedTarget).data('addr');
                var index1 = filename.lastIndexOf(".");
                var index2 = filename.length;
                var postf = filename.substring(index1, index2);//后缀名
                if (/(pdf)/.test(postf)) {
                    //模态框展示的时候更新iframe的地址栏
                    var _frame = scanModal.find('#preview-frame'),
                        _prefx = _frame.data('addr');
                    _frame.attr('src', _prefx + 'upload/' + filename);
                    //document.getElementById('preview-frame').contentWindow.location.reload(true);
                } else {
                    $tipModal.modal('show').find('p').text('抱歉，' + postf + '格式的文件不能预览');
                    return false;
                }
            })
            .on('hidden.bs.modal', function () {
                scanModal.find('#preview-frame').attr('src', "");
            })
        ;
    /*
     * 文件删除
     * */
    $('.uploaded-files').on('click.delete', '.delete-btn', function (e) {//删除
        e.preventDefault();
        var fileName = $(this).attr('href');
        var $self = $(this);
        //debugger;
        //console.log(fileName);
        deleteFile(fileName, function (flag) {
            if (flag) {
                $self.closest('li').remove();
            }
        });
    });
    /*
     * 文件上传
     * */
    // 上传配置项
    var upLoadConfig = {
        // 文件接收服务端。
        server: '/img/upload',//backURL 接收文件的服务端
        // swf文件路径
        swf: '/js/lib/Uploader.swf',//backURL flash 文件地址
        thread: 1,// 最大上传并发数
        pick: {//上传按钮
            id: '#filePicker',
            label: '',
            multiple: false
        },
        auto: true,// {Boolean} [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
        dnd: '#uploader .queueList', //拖拽上传容器
        paste: document.body,//指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body.
        accept: { //指定接受哪些类型的文件
            title: 'intoTypes',
            extensions: 'doc,docx,pdf',
            mimeTypes: '.doc,.docx,.pdf'
        },
        disableGlobalDnd: true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
        chunked: true,//是否要分片处理大文件上传。
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        fileNumLimit: 1,//{int} [可选] [默认值：undefined] 验证文件总数量, 超出则不允许加入队列。
        fileSizeLimit: 20 * 1024 * 1024,    // 200 M  {int} [可选] [默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列。
        fileSingleSizeLimit: 20 * 1024 * 1024    // 50 M {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
    };

    function resetState() {
        $('#uploader').find('.placeholder').removeClass('queued');
        $uploadBtn.data('state', 'pedding');
        //$uploadBtn.text('开始上传');
        upLoadModal.find('.modal-footer').hide();
        $statusBar.hide().find('.title').text("");
        $progress.hide().find('.percentage').css({width: 0});
        $progressTxt.hide().find('.size').text(0).siblings('.text').text(0 + "%");
        $info.hide().html('');
    }

    var upLoadModal = $('#upload-modal').modal({backdrop: 'static', show: false}),
        fileName = null,
        $wrap = $('#uploader'),
        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar').hide(),

        // 文件总体选择信息。
        $info = $statusBar.find('.info').hide(),

        // 上传按钮
        $uploadBtn = upLoadModal.find('.upload-confirm').data('state', 'pedding'),

        //文件图标路径
        pdficon = $statusBar.find('.imgWrap img').data('pdf');
        docicon = $statusBar.find('.imgWrap img').data('doc');

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),
        //上传实例
        uploader,
        // 总体进度条
        $progress = $statusBar.find('.progress').hide();
    $progress.find('.percentage').css({width: 0});
    $progressTxt = $statusBar.find('.progress-txt').hide();
    $progressTxt.find('.text').text(0 + "%").siblings('.size').text(0);
    if (!WebUploader.Uploader.support()) {
        $tipModal.modal('show').find('p').text('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        //alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }

    // 实例化
    uploader = WebUploader.create(upLoadConfig);

    //当validate不通过时，会以派送错误事件的形式通知调用者。
    uploader.on('error', function (type) {
        if (type == "Q_TYPE_DENIED") {
            $tipModal.modal('show').find('p').text("请上传 " + uploader.options.accept[0].extensions + " 格式的文件");
            //alert("请上传 " + uploader.options.accept[0].extensions + " 类型的文件");
        } else if (type == "F_EXCEED_SIZE") {
            var fileSizeLimit = uploader.options.fileSizeLimit;
            fileSizeLimit = fileSizeLimit > 1024 * 1024 ? parseFloat(fileSizeLimit / (1024 * 2014)).toFixed(2) + "M" : fileSizeLimit > 1024 ? arseFloat(fileSizeLimit / 1024 * 2014).toFixed(2) + "Kb" : fileSizeLimit + "B";
            $tipModal.modal('show').find('p').text("请上传小于 " + fileSizeLimit + " 的文件");
            //alert("请上传小于 " + fileSizeLimit + " 的文件");
            //return false;
        } else if (type == "Q_EXCEED_NUM_LIMIT") {
            $tipModal.modal('show').find('p').text("同时可以上传 " + uploader.options.fileNumLimit + " 个的文件");
            //alert("同时可以上传 " + uploader.options.fileNumLimit + " 个的文件");
        }
    });
    //当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
    uploader.on('beforeFileQueued', function (file) {
    });

    //当文件被加入队列以后触发。
    uploader.on('fileQueued', function (file) {
        //上传栏样式变化
        $('#uploader').find('.placeholder').addClass('queued');
        //状态栏显示，并更新数据
        var _class;
        if (/(doc)|(docx)|(odt)|(ods)/.test(file.ext)) {
            //如果是文档则显示文档图标
            _class = docicon;
        } else if (/(pdf)/.test(file.ext)) {
            _class = pdficon;
        }
        upLoadModal.find('.modal-footer').show();
        $uploadBtn.data('state', 'ready');
        $statusBar.find('.imgWrap img').attr('src',_class);
        $statusBar.show().find('.title').text(file.name);//文件名
        $progress.show().find('.percentage').css({width: 0});//进度条显示
        $progressTxt.show().find('.size').text(WebUploader.formatSize(file.size));//进度条描述显示
        $progressTxt.find('.text').text(0 + '%');
    });
    //上传过程中触发，携带上传进度。
    uploader.on('uploadProgress', function (file, percentage) {
        $progress.find('.percentage').css('width', Math.round(percentage * 100) + '%');
        $progressTxt.find('.text').text(Math.round(percentage * 100) + '%');
    });

    //当文件上传出错时触发。
    uploader.on('uploadError', function (file, reason) {
        //file {File}File对象
        //reason {String}出错的code
        $uploadBtn.data('state', 'error');
        $progress.hide().find('.percentage').css('width', 0);
        $progressTxt.hide().find('.text').text(0 + '%');
        $info.html('上传失败，请<a class="retry" href="#">重试</a>').show();
    });
    //当文件上传成功时触发。
    uploader.on('uploadSuccess', function (file, response) {
        //file {File}File对象
        //response {Object}服务端返回的数据
        $uploadBtn.data('state', 'success');
        $progress.hide().find('.percentage').css('width', '100%');
        $progressTxt.hide().find('.text').text(100 + "%");
        $info.html('文件上传成功！').show();
        //接收反悔的数据
        var _html = "";
        fileName = response.data.fileName;//backURL  文件上传成功后返回的文件地址
        _html += '<li><span class="name">' + file.name + '</span> <a class="scan-btn" data-addr=' + fileName + ' href="#filescan-modal" data-toggle="modal">预览</a> <a href="' + fileName + '" class="delete-btn">删除</a></li>';
        $('.uploaded-files').append(_html);
    });
    //点击上传、开始上传
    upLoadModal.on('click', '.upload-confirm', function (e) {
        e.preventDefault();
        var _state = $uploadBtn.data('state');
        switch (_state) {
            case "pedding":
                //$tipModal.modal('show').find('p').text('您还没有选择文件，请选择文件。');
                //alert('请选择上传文件');
                break;
            case "ready":
                //uploader.upload();
                $uploadBtn.data('state', 'loading');
                break;
            case "loading":
                //alert('文件正在上传中...');
                break;
            case "error":
                //uploader.retry();
                $progress.show().find('.percentage').css({width: 0});
                $progressTxt.show().find('.text').text(0 + "%");
                $info.hide().html("");
                //$uploadBtn.data('state', 'loading').text('上传中...');
                break;
            case "success":
                break;
        }
        upLoadModal.modal('hide');
    });
    //取消按钮点击
    upLoadModal.on('click', '.upload-cancel', function (e) {
        e.preventDefault();
        var _state = $uploadBtn.data('state');
        switch (_state) {
            case "success":
                deleteFile(fileName, function (flag) {
                    if (flag) {
                        //后台删除文件成功
                        uploader.reset();
                        fileName = null;
                        upLoadModal.modal('hide');
                        $('.uploaded-files li').last().remove();
                    } else {
                        $tipModal.modal('show').find('p').text('取消上传文件失败！');
                    }
                });
                break;
            default:
                upLoadModal.modal('hide');

        }

    });
    // 上传失败，点击重试
    $info.on('click', '.retry', function () {
        uploader.retry();
        $progress.show().find('.percentage').css({width: 0});
        $progressTxt.show().find('.text').text(0 + "%");
        $info.hide().html("");
        $uploadBtn.data('state', 'loading')
    });

    //文件上传中的删除按钮点击

    $statusBar.on('click', '.cancel', function (e) {
        e.preventDefault();
        var _state = $uploadBtn.data('state');
        switch (_state) {
            case "ready":
                uploader.reset();
                resetState();
                break;
            case "loading":
                uploader.cancelFile(uploader.getFiles()[0]);//取消文件上传
                uploader.reset();
                resetState();
                break;
            case "error":
                uploader.cancelFile(uploader.getFiles()[0]);//取消文件上传
                uploader.reset();
                resetState();
                break;
            case "success":
                deleteFile(fileName, function (flag) {
                    if (flag) {
                        //后台删除文件成功
                        fileName = null;
                        uploader.reset();
                        resetState();
                        $('.uploaded-files li').last().remove();
                    } else {
                        $tipModal.modal('show').find('p').text('删除文件失败!');
                        //alert('删除文件失败');
                    }
                });
                break;
        }
    });
    //上传模态框关闭
    upLoadModal
        .on('hidden.bs.modal', function (e) {
            var _state = $uploadBtn.data('state');
            switch (_state) {
                case "ready":
                    uploader.reset();
                    break;
                case "loading":
                    uploader.cancelFile(uploader.getFiles()[0]);//取消文件上传
                    uploader.reset();
                    break;
                case "error":
                    uploader.cancelFile(uploader.getFiles()[0]);//取消文件上传
                    uploader.reset();
                    break;
                case "success":
                    uploader.reset();
                    break;
            }
            resetState();
        })
    ;
    /*
     * 表单提交
     * */
    var $tipModal = $('#form-tips-modal');
    $('#hot-form').on('click', '.btn-submit', function (e) {
        e.preventDefault();
        var _fileLen = $('.uploaded-files li').length;
        var newsLink = $('[name="newsLink"]');
        var tel = $('[name="tel"]');
        var wx = $('[name="wx"]');
        var username = $('[name="username"]');
        if (!_fileLen && $.trim(newsLink.val()) == "") {
            $tipModal.modal('show').find('p').text('请选择上传文件或者添加文章链接！');
            return false;
        } else if (_fileLen > 1) {
            $tipModal.modal('show').find('p').text('每次只能上传一个文件！');
            return false;
        } else {
            var _vals = "";
            $('.uploaded-files li').each(function (i, elem) {
                if (!_vals) {
                    _vals += $(elem).find('.delete-btn').attr('href');
                } else {
                    _vals += '#' + $(elem).find('.delete-btn').attr('href');
                }
            });
            $('#fileinput').val(_vals);
        }
        if ($.trim(username.val()) == "") {
            $tipModal.modal('show').find('p').text('姓名不能为空！');
            return $(this);
        }
        if ($.trim(tel.val()) == "") {
            $tipModal.modal('show').find('p').text('手机号不能为空！');
            return $(this);
        }
        if ($.trim(tel.val()) != "" && !(/^1(3|4|5|7|8)\d{9}$/.test(tel.val()))) {
            $tipModal.modal('show').find('p').text('手机号码有误，请重填');
            return $(this);
        }
        if ($.trim(tel.val()) == "") {
            $tipModal.modal('show').find('p').text('微信号不能为空！');
            return $(this);
        }
        var AjaxURL = "/contribution";
        var _data = $('#hot-form').serialize();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: AjaxURL,
            data: _data,
            success: function (result) {
                if (result.code == '0') {
                    $tipModal.modal('show').find('p').text('信息已收到，感谢您的提交！');
                    //alert('信息已收到，感谢您的提交！');
                } else {
                    $tipModal.modal('show').find('p').text('提交发生错误，请核对信息后重新提交');
                    // alert('提交发生错误，请核对信息后重新提交！');
                }
            },
            error: function (data) {
                $tipModal.modal('show').find('p').text('系统错误，请核对信息后重新提交！');
                //alert('系统错误，请核对信息后重新提交！');
            }
        });
    });
});