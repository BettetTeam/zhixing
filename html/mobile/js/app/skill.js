/**
 * Created by admin on 2017/7/15.
 */
$(function () {
    /*
     * 列表加载更多
     * */
    +function ($) {
        var loadNum = 1,
            controller = true,
            loadMore = $('#load-more-1'),
            loadWrap = $(loadMore.data('target'));
        loadMore.on('click.load', function () {
            if (loadNum <= 10 && controller == true) {
                /*
                 * 数据没有加载完
                 * */
                //阻止多次点击加载
                controller = false;
                //加载中状态显示
                $(this).find('.txt').text('加载中 ...').show().siblings('.icon-load-more').hide();
                /*
                 * 静态数据模拟
                 * */
                var $self = $(this);
                var timer = setTimeout(function () {
                    //加载数据
                    loadWrap.append('<li> <a href="detail.html"> <div class="image"> <img class="lazy-img" data-original="images/upload/figureList01.png" alt=""> <span class="img-mark">行政那些事</span> </div> <div class="exp"> <header>如何面对办公室空调“冷暴力”</header> <div class="meta"> <div class="txt-labels pull-right"><span class="label">#小技巧</span><span class="label">#办公室</span><span class="label">#日常</span></div> <span class="date">王妮美·1小时前</span> </div> </div> </a> </li>');
                    //新加载的dom元素懒加载初始化
                    $.fn.lazyload && $("img.lazy-img").lazyload(swiperLazySetting);
                    //数据加载完成之后
                    clearTimeout(timer);
                    timer = null;
                    //还原加载状态
                    $self.find('.txt').hide().siblings('.icon-load-more').show();
                    loadNum++;//加载数据增加一
                    /*
                     * 数据数据加载完成
                     * */
                    if (loadNum > 10) {
                        $self.find('.txt').text('已经到底部了！').show().siblings('.icon-load-more').hide();
                    }
                    controller = true;
                }, 1000);
            }
        });
    }(jQuery);
});