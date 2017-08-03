/**
 * Created by admin on 2017/7/15.
 */
$(function () {
    /*
     * 列表加载更多
     * */
    +function ($) {
        var controller = true,
            loadMore = $('#load-more-1'),
            loadWrap = $(loadMore.data('target'));
        loadMore.on('click.load', function () {
            if(controller){
                var _self = $(this);
                controller = false;
                //加载中状态显示
                $(this).find('.txt').text('加载中 ...').show().siblings('.icon-load-more').hide();
                $.ajax({
                    url: 'js/app/data.json',
                    type: 'GET', //GET
                    success: function (data, textStatus, jqXHR) {
                        if (data) {//如果数据不为空
                            var _html = "";
                            var _labels = "";
                            data.forEach(function (v,i,a) {//数据数组遍历
                                v.labels.forEach(function (v,i,a) {//标签遍历
                                    _labels += '<span class="label">'+ v +'</span>'
                                });
                                _html += '<li> <a href="'+ v.link +'"> <div class="image"> <img class="lazy-img" data-original="'+ v.img +'" alt=""></div> <div class="exp"> <header>'+ v.txt +'</header> <div class="meta"> <div class="txt-labels pull-right">+ _labels +</div> <span class="date">'+ v.date +'</span> </div> </div> </a> </li>'
                            });
                            loadWrap.append(_html);
                            //新加载的dom元素懒加载初始化
                            $.fn.lazyload && $("img.lazy-img").lazyload(swiperLazySetting);
                            //还原加载状态
                            _self.find('.txt').hide().siblings('.icon-load-more').show();
                        } else{ //如果数据为空,没有多余的数据
                            _self.find('.txt').text('已经到底部了！').show().siblings('.icon-load-more').hide();
                        }
                        controller = true;
                    },
                    error: function (xhr, textStatus) {
                        controller = true;
                        alert('数据加载出错！');
                    }
                });
            }
        });
    }(jQuery);
});