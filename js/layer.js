/*!

 @Name：layer mobile v2.0 弹层组件移动版
 @Author：贤心
 @Site：http://layer.layui.com/mobie/
 @License：LGPL

 */

;
! function(win) {

    function whichAnimationEndEvent() {
        var t,
            el = document.createElement("fakeelement");

        var animations = {
            "animation": "animationend",
            "OAnimation": "oAnimationEnd",
            "MozAnimation": "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        }

        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    }

    var animationEndEvent = whichAnimationEndEvent();

    "use strict";

    var doc = document,
        query = 'querySelectorAll',
        claname = 'getElementsByClassName',
        S = function(s) {
            return doc[query](s);
        };

    //默认配置
    var config = {
        type: 0,
        shade: true,
        shadeClose: true,
        fixed: true,
        anim: 'scale' //默认动画类型
    };

    var ready = {
        extend: function(obj) {
            var newobj = JSON.parse(JSON.stringify(config));
            for (var i in obj) {
                newobj[i] = obj[i];
            }
            return newobj;
        },
        timer: {},
        end: {}
    };

    //点触事件
    ready.touch = function(elem, fn) {
        elem.addEventListener('click', function(e) {
            fn.call(this, e);
        }, false);
    };

    var index = 0,
        classs = ['layui-m-layer'],
        Layer = function(options) {
            var that = this;
            that.config = ready.extend(options);
            that.view();
        };

    Layer.prototype.view = function() {
        var that = this,
            config = that.config,
            layerbox = doc.createElement('div');

        that.id = layerbox.id = classs[0] + index;
        layerbox.setAttribute('class', classs[0] + ' ' + classs[0] + (config.type || 0));
        layerbox.setAttribute('index', index);

        //标题区域
        var title = (function() {
            var titype = typeof config.title === 'object';
            return config.title ?
                '<h3 style="' + (titype ? config.title[1] : '') + '">' + (titype ? config.title[0] : config.title) + '</h3>' :
                '';
        }());

        //按钮区域
        var button = (function() {
            typeof config.btn === 'string' && (config.btn = [config.btn]);
            var btns = (config.btn || []).length,
                btndom;
            if (btns === 0 || !config.btn) {
                return '';
            }
            if (config.btn[0] && typeof config.btn[0] === 'string') {
                config.btn[0] = [config.btn[0], ''];
            }
            if (config.btn[1] && typeof config.btn[1] === 'string') {
                config.btn[1] = [config.btn[1], ''];
            }
            btndom = '<span yes style="' + config.btn[0][1] + '" type="1">' + config.btn[0][0] + '</span>';
            if (btns === 2) {
                btndom = '<span no style="' + config.btn[1][1] + '" type="0">' + config.btn[1][0] + '</span>' + btndom;
            }
            return '<div class="layui-m-layerbtn">' + btndom + '</div>';
        }());

        if (!config.fixed) {
            config.top = config.hasOwnProperty('top') ? config.top : 100;
            config.style = config.style || '';
            config.style += ' top:' + (doc.body.scrollTop + config.top) + 'px';
        }

        if (config.type === 2) {
            config.content = '<i></i><i class="layui-m-layerload"></i><i></i><p>' + (config.content || '') + '</p>';
        }

        if (config.skin) config.anim = 'up';
        if (config.skin === 'msg') config.shade = false;

        layerbox.innerHTML = (config.shade ? '<div ' + (typeof config.shade === 'string' ? 'style="' + config.shade + '"' : '') + ' class="layui-m-layershade' + (config.anim ? ' layui-m-anim-fade-in' : '') + '"></div>' : '') +
            '<div class="layui-m-layermain" ' + (!config.fixed ? 'style="position:static;"' : '') + '>' +
            '<div class="layui-m-layersection">' +
            '<div class="layui-m-layerchild ' + (config.skin ? 'layui-m-layer-' + config.skin + ' ' : '') + (config.className ? config.className : '') + ' ' + (config.anim ? 'layui-m-anim-' + config.anim + '-in' : '') + '" ' + (config.style ? 'style="' + config.style + '"' : '') + '>' +
            title +
            '<div class="layui-m-layercont">' + config.content + '</div>' +
            button +
            '</div>' +
            '</div>' +
            '</div>';

        if (!config.type || config.type === 2) {
            var dialogs = doc[claname](classs[0] + config.type),
                dialen = dialogs.length;
            if (dialen >= 1) {
                layer.close(dialogs[0].getAttribute('index'))
            }
        }

        document.body.appendChild(layerbox);
        var elem = that.elem = S('#' + that.id)[0];
        config.success && config.success(elem);

        that.index = index++;
        that.action(config, elem);
    };

    Layer.prototype.action = function(config, elem) {
        var that = this;

        //自动关闭
        if (config.time) {
            ready.timer[that.index] = setTimeout(function() {
                layer.close(that.index);
            }, config.time * 1000);
        }

        //确认取消
        var btn = function() {
            var type = this.getAttribute('type');
            if (type == 0) {
                config.no && config.no();
                layer.close(that.index);
            } else {
                config.yes ? config.yes(that.index) : layer.close(that.index);
            }
        };
        if (config.btn) {
            var btns = elem[claname]('layui-m-layerbtn')[0].children,
                btnlen = btns.length;
            for (var ii = 0; ii < btnlen; ii++) {
                ready.touch(btns[ii], btn);
            }
        }

        //点遮罩关闭
        if (config.shade && config.shadeClose) {
            var shade = elem[claname]('layui-m-layershade')[0];
            ready.touch(shade, function() {
                layer.close(that.index, config.end);
            });
        }

        config.end && (ready.end[that.index] = config.end);
    };

    win.layer = {
        v: '2.0',
        index: index,

        //核心方法
        open: function(options) {
            var o = new Layer(options || {});
            return o.index;
        },

        close: function(index) {
            var ibox = S('#' + classs[0] + index)[0];
            if (!ibox) return;
            clearTimeout(ready.timer[index]);
            delete ready.timer[index];
            if (config.anim) {
                var shadeEl = document.querySelector('#' + classs[0] + index + ' > .layui-m-layershade');
                if (shadeEl !== null) shadeEl.setAttribute('class', 'layui-m-layershade layui-m-anim-fade-out');
                var mainEl = document.querySelector('#' + classs[0] + index + ' > .layui-m-layermain');
                mainEl.setAttribute('class', 'layui-m-layermain layui-m-anim-' + config.anim + '-out');
                var onAnimationEnd = function() {
                    ibox.style.display = 'none';
                    ibox.innerHTML = '';
                    doc.body.removeChild(ibox);
                    typeof ready.end[index] === 'function' && ready.end[index]();
                    delete ready.end[index];
                    if (animationEndEvent) {
                        mainEl.removeEventListener(animationEndEvent, onAnimationEnd);
                    }
                };
                if (animationEndEvent) {
                    mainEl.addEventListener(animationEndEvent, onAnimationEnd);
                } else {
                    setTimeout(onAnimationEnd, 280);
                }
            } else {
                ibox.innerHTML = '';
                doc.body.removeChild(ibox);
                typeof ready.end[index] === 'function' && ready.end[index]();
                delete ready.end[index];
            }
        },

        //关闭所有layer层
        closeAll: function() {
            var boxs = doc[claname](classs[0]);
            for (var i = 0, len = boxs.length; i < len; i++) {
                layer.close((boxs[0].getAttribute('index') | 0));
            }
        }
    };

    'function' == typeof define ? define(function() {
        return layer;
    }) : function() {

    }();

}(window);