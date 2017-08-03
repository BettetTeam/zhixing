window.requestNextAnimationFrame = (function () {
    var originalWebkitRequestAnimationFrame = undefined,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;
    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        wrapper = function (time) {
            if (time === undefined) {
                time = +new Date();
            }
            self.callback(time);
        };

        // Make the switch

        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            originalWebkitRequestAnimationFrame(wrapper, element);
        }
    }
    if (window.mozRequestAnimationFrame) {
        index = userAgent.indexOf('rv:');
        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);
            if (geckoVersion === '2.0') {
                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback, element) {
            var start,
                finish;

            window.setTimeout(function () {
                start = +new Date();
                callback(start);
                finish = +new Date();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
}());
window.cancelNextRequestAnimationFrame = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.webkitCancelRequestAnimationFrame
    || window.mozCancelRequestAnimationFrame
    || window.oCancelRequestAnimationFrame
    || window.msCancelRequestAnimationFrame
    || clearTimeout;
(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }
    function getRect (element) {

        var rect = element.getBoundingClientRect();

        var top = document.documentElement.clientTop;

        var left= document.documentElement.clientLeft;
        return{

            top    :   rect.top - top,

            bottom :   rect.bottom - top,

            left   :   rect.left - left,

            right  :   rect.right - left

        }

    }
    function refreshRem(){
        var width =  docEl.getBoundingClientRect().right;
        //var width = getRect(docEl).right;
        if (width / dpr > 750) {
            width = 750 * dpr;
        }
        if (width / dpr < 320) {
            width = 320 * dpr
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }
    /*
    * 解决页面初始化的时候字体由大变小的突然变化
    * body 默认透明度为 0 ，设置完 font-size 后 添加 initialized 类名 该类名透明图设为1
    * */
    function reg (name){
        return new RegExp('(^|\\s)'+name+'(\\s+|$)');
    }
    function hasClass(obj,cname){
        return reg(cname).test(obj.className);
    }
    function addClass (obj,cname){
        if(!hasClass(obj,cname)){
            obj.className=obj.className+' '+cname;
        }
    }
    /*
    * DOMContentLoaded 的兼容写法
    * */
    function ready(fn){

        // 目前Mozilla、Opera和webkit 525+内核支持DOMContentLoaded事件
        if(document.addEventListener) {
            document.addEventListener('DOMContentLoaded', function() {
                document.removeEventListener('DOMContentLoaded',arguments.callee, false);
                fn();
            }, false);
        }

        // 如果IE
        else if(document.attachEvent) {
            // 确保当页面是在iframe中加载时，事件依旧会被安全触发
            document.attachEvent('onreadystatechange', function() {
                if(document.readyState == 'complete') {
                    document.detachEvent('onreadystatechange', arguments.callee);
                    fn();
                }
            });

            // 如果是IE且页面不在iframe中时，轮询调用doScroll 方法检测DOM是否加载完毕
            if(document.documentElement.doScroll && typeof window.frameElement === "undefined") {
                try{
                    document.documentElement.doScroll('left');
                }
                catch(error){
                    return setTimeout(arguments.callee, 20);
                }
                fn();
            }
        }
    }
    if(win.attachEvent){
        win.attachEvent('onresize',function () {
            win.cancelNextRequestAnimationFrame(tid);
            tid = win.requestNextAnimationFrame(refreshRem);
        })
    }else{
        win.addEventListener('resize', function() {
            win.cancelNextRequestAnimationFrame(tid);
            tid = win.requestNextAnimationFrame(refreshRem);
            // clearTimeout(tid);
            //tid = setTimeout(refreshRem, 300);
        }, false);
        win.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                win.cancelNextRequestAnimationFrame(tid);
                tid = win.requestNextAnimationFrame(refreshRem);
                // clearTimeout(tid);
                // tid = setTimeout(refreshRem, 300);
            }
        }, false);
    }
    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 14 * dpr + 'px';
        addClass(doc.body,'initialized')
    } else {
        ready(function () {
            doc.body.style.fontSize = 14 * dpr + 'px';
            addClass(doc.body,'initialized')
        });
        // doc.addEventListener('DOMContentLoaded', function(e) {
        //     doc.body.style.fontSize = 12 * dpr + 'px';
        //     addClass(doc.body,'initialized')
        // }, false);
    }
    

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));