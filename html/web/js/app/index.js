/**
 * Created by admin on 2017/7/14.
 */
$(function () {
    /*
     * banner 轮播
     * */
    var bannerSwiper = new Swiper('.banner-swiper-container',{
        autoplay:5000,
        speed:1000,
        loop:true,
        grabCursor: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        resizeReInit : true,
        cssWidthAndHeight : 'height'
    });
    // $('.banner-swiper-container .swiper-arrow-left').on('click', function(e){
    //     e.preventDefault();
    //     bannerSwiper.swipePrev()
    // });
    // $('.banner-swiper-container .swiper-arrow-right').on('click', function(e){
    //     e.preventDefault();
    //     bannerSwiper.swipeNext()
    // });
    /*
    * 滚动加载更多
    * */
    // var options = {
    //     loadingIcon : $('#scrollLoad-1').siblings('.loadingImage'),
    //     posElem : $('#scrollLoad-1'),
    //     ajaxFun : function (obj) {
    //         console.log('加载中......')
    //         options.loadingIcon.fadeIn(350);
    //
    //         // var html = "";
    //         // for(var i = 0 ; i < datas.length; i++){
    //         //     var title = datas[i].title;
    //         //     var meta = datas[i].meta;
    //         //     var imgSrc = datas[i].imgSrc;
    //         //     var linkHref = datas[i].href;
    //         //     html += "<li><a href='"+ linkHref +" class='li-content'><h3>"+ title +"</h3><h4>"+ meta +"</h4><div class='image'><img src='"+ imgSrc +"' alt=''></div></a></li>";
    //         // }
    //         // $html = $(html);
    //         //
    //         //
    //         //
    //         // /* 模拟加载数据：*/
    //         // setTimeout(function () {
    //         //     options.loadingIcon.fadeOut(350);
    //         //     $posElem.append($html);
    //         //     $html.fadeShow();
    //         //     obj.controller = true;
    //         // },800);
    //     }
    // };
    // $('[data-toggle="scrollLoad"]').scrollLoad(options);
});