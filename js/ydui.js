/*! YDUI Touch v0.0.1 by YDCSS (c) 2017 Licensed MIT */ ! function(t) {
    "use strict";

    function e(t) { return { set: function(e, i) { t.setItem(e, o.serialize(i)) }, get: function(e) { return o.deserialize(t.getItem(e)) }, remove: function(e) { t.removeItem(e) }, clear: function() { t.clear() } } }
    var i = t.document,
        n = {};
    t.getCurrentPage = function() { var t = $(".page.active"); return 0 == t.length && (t = $(i.body)), t }, $(t).on("load", function() { "function" == typeof FastClick && FastClick.attach(i.body) });
    var o = n.util = {
        parseOptions: function(t) {
            if ($.isPlainObject(t)) return t;
            var e = t ? t.indexOf("{") : -1,
                i = {};
            if (e != -1) try { i = new Function("", "var json = " + t.substr(e) + "; return JSON.parse(JSON.stringify(json));")() } catch (n) {}
            return i
        },
        pageScroll: function() {
            var t = function(t) { t.preventDefault(), t.stopPropagation() },
                e = !1;
            return { lock: function() { e || (e = !0, i.addEventListener("touchmove", t)) }, unlock: function() { e = !1, i.removeEventListener("touchmove", t) } }
        }(),
        localStorage: function() { return e(t.localStorage) }(),
        sessionStorage: function() { return e(t.sessionStorage) }(),
        serialize: function(t) { return "string" == typeof t ? t : JSON.stringify(t) },
        deserialize: function(t) { if ("string" == typeof t) try { return JSON.parse(t) } catch (e) { return t || void 0 } }
    };
    $.fn.emulateTransitionEnd = function(t) {
        var e = !1,
            i = this;
        $(this).one("webkitTransitionEnd", function() { e = !0 });
        var n = function() { e || $(i).trigger("webkitTransitionEnd") };
        setTimeout(n, t)
    }, "function" == typeof define ? define(n) : t.YDUI = n
}(window), ! function(t) {
    "use strict";

    function e(t, e) { this.$element = $(t), this.closeElement = e, this.toggleClass = "actionsheet-toggle" }

    function i(t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var n = $(this),
                o = n.data("ydui.actionsheet");
            o || (n.data("ydui.actionsheet", o = new e(this, t.closeElement)), t && "object" != typeof t || o.open()), "string" == typeof t && o[t] && o[t].apply(o, i)
        })
    }
    var n = t.document,
        o = $(n),
        a = $('<div class="mask-black"></div>');
    e.prototype.open = function() {
        YDUI.device.isIOS && $(".g-scrollview").addClass("g-fix-ios-overflow-scrolling-bug");
        var t = this;
        getCurrentPage().append(a), a.on("click.ydui.actionsheet.mask", function() { t.close() }), t.closeElement && o.on("click.ydui.actionsheet", t.closeElement, function() { t.close() }), t.$element.addClass(t.toggleClass).trigger("open.ydui.actionsheet")
    }, e.prototype.close = function() {
        var t = this;
        YDUI.device.isIOS && $(".g-scrollview").removeClass("g-fix-ios-overflow-scrolling-bug"), a.off("click.ydui.actionsheet.mask").remove(), t.$element.removeClass(t.toggleClass).trigger("close.ydui.actionsheet")
    }, o.on("click.ydui.actionsheet.data-api", "[data-ydui-actionsheet]", function(e) {
        e.preventDefault();
        var n = t.YDUI.util.parseOptions($(this).data("ydui-actionsheet")),
            o = $(n.target),
            a = o.data("ydui.actionsheet") ? "open" : n;
        i.call(o, a)
    }), $.fn.actionSheet = i
}(window), ! function(t) { t.document.addEventListener("touchstart", function(t) {}, !1) }(window), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

    function i(t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var n = $(this),
                o = n.data("ydui.cityselect");
            o || n.data("ydui.cityselect", o = new e(this, t)), "string" == typeof t && o[t] && o[t].apply(o, i)
        })
    }
    e.DEFAULTS = { provance: "", city: "", area: "" }, e.prototype.init = function() {
        var t = this,
            e = t.options;
        return "undefined" == typeof YDUI_CITYS ? void console.error("请在ydui.js前引入ydui.citys.js。下载地址：http://cityselect.ydui.org") : (t.citys = YDUI_CITYS, t.createDOM(), void(t.defaultSet = { provance: e.provance, city: e.city, area: e.area }))
    }, e.prototype.open = function() {
        var t = this;
        getCurrentPage().append(t.$mask), YDUI.device.isMozilla && t.$element.blur(), t.$mask.on("click.ydui.cityselect.mask", function() { t.close() });
        var e = t.$cityElement,
            i = t.defaultSet;
        e.find(".cityselect-content").removeClass("cityselect-move-animate cityselect-next cityselect-prev"), t.loadProvance(), i.provance ? t.setNavTxt(0, i.provance) : e.find(".cityselect-nav a").eq(0).addClass("crt").html("请选择"), i.city && (t.loadCity(), t.setNavTxt(1, i.city)), i.area && (t.loadArea(), t.ForwardView(!1), t.setNavTxt(2, i.area)), e.addClass("brouce-in")
    }, e.prototype.close = function() {
        var t = this;
        t.$mask.remove(), t.$cityElement.removeClass("brouce-in").find(".cityselect-nav a").removeClass("crt").html(""), t.$itemBox.html("")
    }, e.prototype.createDOM = function() {
        var t = this;
        t.$mask = $('<div class="mask-black"></div>'), t.$cityElement = $('<div class="m-cityselect">    <div class="cityselect-header">        <p class="cityselect-title">所在地区</p>        <div class="cityselect-nav">            <a href="javascript:;" ></a>            <a href="javascript:;"></a>            <a href="javascript:;"></a>        </div>    </div>    <ul class="cityselect-content">        <li class="cityselect-item">            <div class="cityselect-item-box"></div>        </li>        <li class="cityselect-item">            <div class="cityselect-item-box"></div>        </li>        <li class="cityselect-item">            <div class="cityselect-item-box"></div>        </li>    </ul></div>'), getCurrentPage().append(t.$cityElement), t.$itemBox = t.$cityElement.find(".cityselect-item-box"), t.$cityElement.on("click.ydui.cityselect", ".cityselect-nav a", function() {
            var e = $(this);
            e.addClass("crt").siblings().removeClass("crt"), e.index() < 2 ? t.backOffView() : t.ForwardView(!0)
        })
    }, e.prototype.setNavTxt = function(t, e) {
        var i = this.$cityElement.find(".cityselect-nav a");
        t < 2 && i.removeClass("crt"), i.eq(t).html(e), i.eq(t + 1).addClass("crt").html("请选择"), i.eq(t + 2).removeClass("crt").html("")
    }, e.prototype.backOffView = function() { this.$cityElement.find(".cityselect-content").removeClass("cityselect-next").addClass("cityselect-move-animate cityselect-prev") }, e.prototype.ForwardView = function(t) { this.$cityElement.find(".cityselect-content").removeClass("cityselect-move-animate cityselect-prev").addClass((t ? "cityselect-move-animate" : "") + " cityselect-next") }, e.prototype.bindItemEvent = function() {
        var t = this,
            e = t.$cityElement;
        e.on("click.ydui.cityselect", ".cityselect-item-box a", function() {
            var i = $(this);
            if (!i.hasClass("crt")) {
                i.addClass("crt").siblings().removeClass("crt");
                var n = i.data("tag");
                t.setNavTxt(n, i.text());
                var o = e.find(".cityselect-nav a"),
                    a = t.defaultSet;
                if (0 == n) {
                    if (!i.data('citys') || i.data('citys').length == 0) {
                        a.provance = o.eq(0).html();
                        a.city = '';
                        a.area = '';
                        t.returnValue();
                    } else {
                        t.loadCity();
                        e.find(".cityselect-item-box").eq(1).find("a").removeClass("crt");
                    }
                } else if (1 == n) {
                    if (!i.data('citys') || i.data('citys').length == 0) {
                        t.ForwardView(0);
                        a.provance = o.eq(0).html();
                        a.city = o.eq(1).html();;
                        a.area = '';
                        t.returnValue();
                    } else {
                        t.loadArea();
                        t.ForwardView(!0);
                        e.find(".cityselect-item-box").eq(2).find("a").removeClass("crt");
                    }
                } else {
                    a.provance = o.eq(0).html();
                    a.city = o.eq(1).html();
                    a.area = o.eq(2).html();
                    t.returnValue();
                }
            }
        })
    }, e.prototype.returnValue = function() {
        var t = this,
            e = t.defaultSet;
        t.$element.trigger($.Event("done.ydui.cityselect", { provance: e.provance, city: e.city, area: e.area })), t.close()
    }, e.prototype.scrollPosition = function(t) {
        var e = this,
            i = e.$itemBox.eq(t),
            n = i.find("a.crt").height(),
            o = i.parent().height();
        i.parent().animate({ scrollTop: i.find("a.crt").index() * n - o / 3 }, 0, function() { e.bindItemEvent() })
    }, e.prototype.fillItems = function(t, e) {
        var i = this;
        i.$itemBox.eq(t).html(e).parent().animate({ scrollTop: 0 }, 10), i.scrollPosition(t)
    }, e.prototype.loadProvance = function() {
        var t = this,
            e = [];
        $.each(t.citys, function(i, n) { e.push($('<a class="' + (n.n == t.defaultSet.provance ? "crt" : "") + '" href="javascript:;"><span>' + n.n + "</span></a>").data({ citys: n.c, tag: 0 })) }), t.fillItems(0, e)
    }, e.prototype.loadCity = function() {
        var t = this,
            e = t.$itemBox.eq(0).find("a.crt").data("citys"),
            i = [];
        $.each(e, function(e, n) { i.push($('<a class="' + (n.n == t.defaultSet.city ? "crt" : "") + '" href="javascript:;"><span>' + n.n + "</span></a>").data({ citys: n.a, tag: 1 })) }), t.fillItems(1, i)
    }, e.prototype.loadArea = function() {
        var t = this,
            e = t.$itemBox.eq(1).find("a.crt").data("citys"),
            i = [];
        $.each(e, function(e, n) { i.push($('<a class="' + (n == t.defaultSet.area ? "crt" : "") + '" href="javascript:;"><span>' + n + "</span></a>").data({ tag: 2 })) }), i.length <= 0 && i.push($('<a href="javascript:;"><span>全区</span></a>').data({ tag: 2 })), t.fillItems(2, i)
    }, $.fn.citySelect = i
}(window), ! function(t) {
    var e = t.document,
        i = t.YDUI,
        n = t.navigator && t.navigator.userAgent || "",
        o = !!n.match(/(iPad).*OS\s([\d_]+)/),
        a = !!n.match(/(iPod)(.*OS\s([\d_]+))?/),
        r = !o && !!n.match(/(iPhone\sOS)\s([\d_]+)/);
    i.device = { isMobile: !!n.match(/AppleWebKit.*Mobile.*/) || "ontouchstart" in e.documentElement, isIOS: !!n.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), isAndroid: !!n.match(/(Android);?[\s\/]+([\d.]+)?/), isIpad: o, isIpod: a, isIphone: r, isWebView: (r || o || a) && !!n.match(/.*AppleWebKit(?!.*Safari)/i), isWeixin: n.indexOf("MicroMessenger") > -1, isMozilla: /firefox/.test(navigator.userAgent.toLowerCase()), pixelRatio: t.devicePixelRatio || 1 }
}(window), ! function(t, e) {
    "use strict";
    var i = e.dialog = e.dialog || {};
    i.confirm = function(t, i, n) {
        var o = "YDUI_CONFRIM";
        $("#" + o).remove();
        var a = arguments.length;
        if (a < 2) return void console.error("From YDUI's confirm: Please set two or three parameters!!!");
        if ("function" != typeof arguments[1] && 2 == a && !arguments[1] instanceof Array) return void console.error("From YDUI's confirm: The second parameter must be a function or array!!!");
        2 == a && (n = i, i = t, t = "提示");
        var r = n;
        "function" == typeof n && (r = [{ txt: "取消", color: !1 }, { txt: "确定", color: !0, callback: function() { n && n() } }]);
        var s = $('<div class="mask-black-dialog" id="' + o + '">   <div class="m-confirm">       <div class="confirm-hd"><strong class="confirm-title">' + t + '</strong></div>       <div class="confirm-bd">' + i + "</div>   </div></div>"),
            c = $('<div class="confirm-ft"></div>');
        $.each(r, function(t, i) {
            var n;
            "boolean" == typeof i.color ? n = $('<a href="javascript:;" class="confirm-btn ' + (i.color ? "primary" : "default") + '">' + (i.txt || "") + "</a>") : "string" == typeof i.color && (n = $('<a href="javascript:;" style="color: ' + i.color + '">' + (i.txt || "") + "</a>")),
                function(t) { n.on("click", function(i) { i.stopPropagation(), r[t].stay || (e.util.pageScroll.unlock(), s.remove()), r[t].callback && r[t].callback() }) }(t), c.append(n)
        }), s.find(".m-confirm").append(c), e.util.pageScroll.lock(), getCurrentPage().append(s)
    }, i.alert = function(t, i) {
        var n = "YDUI_ALERT";
        $("#" + n).remove();
        var o = $('<div id="' + n + '">   <div class="mask-black-dialog">       <div class="m-confirm m-alert">           <div class="confirm-bd">' + (t || "YDUI Touch") + '</div>           <div class="confirm-ft">               <a href="javascript:;" class="confirm-btn primary">确定</a>           </div>       </div>   </div></div>');
        e.util.pageScroll.lock(), getCurrentPage().append(o), o.find("a").on("click", function() { o.remove(), e.util.pageScroll.unlock(), "function" == typeof i && i() })
    }, i.toast = function() {
        var t = null;
        return function(i, n, o, a) {
            clearTimeout(t);
            var r = "YDUI_TOAST";
            $("#" + r).remove();
            var s = arguments.length;
            if (s < 2) return void console.error("From YDUI's toast: Please set two or more parameters!!!");
            var c = "";
            "success" != n && "error" != n || (c = '<div class="' + ("error" == n ? "toast-error-ico" : "toast-success-ico") + '"></div>');
            var l = $('<div class="mask-white-dialog" id="' + r + '">    <div class="m-toast ' + ("" == c ? "none-icon" : "") + '">' + c + '        <p class="toast-content">' + (i || "") + "</p>    </div></div>");
            e.util.pageScroll.lock(), getCurrentPage().append(l), "function" == typeof o && arguments.length >= 3 && (a = o, o = 2e3), t = setTimeout(function() { clearTimeout(t), e.util.pageScroll.unlock(), l.remove(), "function" == typeof a && a() }, (~~o || 2e3) + 100)
        }
    }(), i.notify = function() {
        var t = null;
        return function(e, i, n) {
            clearTimeout(t);
            var o = "YDUI_NOTIFY";
            $("#" + o).remove();
            var a = $('<div id="' + o + '"><div class="m-notify">' + (e || "") + "</div></div>");
            getCurrentPage().append(a);
            var r = function() { a.remove(), "function" == typeof n && n() },
                s = function() { clearTimeout(t), a.find(".m-notify").addClass("notify-out"), a.one("webkitTransitionEnd", r).emulateTransitionEnd(150) };
            a.on("click", s), ~~i > 0 && (t = setTimeout(s, i + 200))
        }
    }(), i.loading = function() {
        var t = "YDUI_LOADING";
        return {
            open: function(i) {
                $("#" + t).remove();
                var n = $('<div class="mask-white-dialog" id="' + t + '">   <div class="m-loading">       <div class="loading-icon"></div>       <div class="loading-txt">' + (i || "数据加载中") + "</div>   </div></div>").remove();
                e.util.pageScroll.lock(), getCurrentPage().append(n)
            },
            close: function() { e.util.pageScroll.unlock(), $("#" + t).remove() }
        }
    }()
}(window, YDUI),
function() {
    "use strict";

    function t(e, n) {
        function o(t, e) { return function() { return t.apply(e, arguments) } }
        var a;
        if (n = n || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = n.touchBoundary || 10, this.layer = e, this.tapDelay = n.tapDelay || 200, this.tapTimeout = n.tapTimeout || 700, !t.notNeeded(e)) {
            for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], s = this, c = 0, l = r.length; c < l; c++) s[r[c]] = o(s[r[c]], s);
            i && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, i, n) { var o = Node.prototype.removeEventListener; "click" === t ? o.call(e, t, i.hijacked || i, n) : o.call(e, t, i, n) }, e.addEventListener = function(t, i, n) { var o = Node.prototype.addEventListener; "click" === t ? o.call(e, t, i.hijacked || (i.hijacked = function(t) { t.propagationStopped || i(t) }), n) : o.call(e, t, i, n) }), "function" == typeof e.onclick && (a = e.onclick, e.addEventListener("click", function(t) { a(t) }, !1), e.onclick = null)
        }
    }
    var e = navigator.userAgent.indexOf("Windows Phone") >= 0,
        i = navigator.userAgent.indexOf("Android") > 0 && !e,
        n = /iP(ad|hone|od)/.test(navigator.userAgent) && !e,
        o = n && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        a = n && /OS [6-7]_\d/.test(navigator.userAgent),
        r = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function(t) {
        switch (t.nodeName.toLowerCase()) {
            case "button":
            case "select":
            case "textarea":
                if (t.disabled) return !0;
                break;
            case "input":
                if (n && "file" === t.type || t.disabled) return !0;
                break;
            case "label":
            case "iframe":
            case "video":
                return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }, t.prototype.needsFocus = function(t) {
        switch (t.nodeName.toLowerCase()) {
            case "textarea":
                return !0;
            case "select":
                return !i;
            case "input":
                switch (t.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "image":
                    case "radio":
                    case "submit":
                        return !1
                }
                return !t.disabled && !t.readOnly;
            default:
                return /\bneedsfocus\b/.test(t.className)
        }
    }, t.prototype.sendClick = function(t, e) {
        var i, n;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(), n = e.changedTouches[0], i = document.createEvent("MouseEvents"), i.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null), i.forwardedTouchEvent = !0, t.dispatchEvent(i)
    }, t.prototype.determineEventType = function(t) { return i && "select" === t.tagName.toLowerCase() ? "mousedown" : "click" }, t.prototype.focus = function(t) {
        var e;
        n && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
    }, t.prototype.updateScrollParent = function(t) {
        var e, i;
        if (e = t.fastClickScrollParent, !e || !e.contains(t)) {
            i = t;
            do {
                if (i.scrollHeight > i.offsetHeight) { e = i, t.fastClickScrollParent = i; break }
                i = i.parentElement
            } while (i)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }, t.prototype.getTargetElementFromEventTarget = function(t) { return t.nodeType === Node.TEXT_NODE ? t.parentNode : t }, t.prototype.onTouchStart = function(t) {
        var e, i, a;
        if (t.targetTouches.length > 1) return !0;
        if (e = this.getTargetElementFromEventTarget(t.target), i = t.targetTouches[0], n) {
            if (a = window.getSelection(), a.rangeCount && !a.isCollapsed) return !0;
            if (!o) {
                if (i.identifier && i.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
                this.lastTouchIdentifier = i.identifier, this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = i.pageX, this.touchStartY = i.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
    }, t.prototype.touchHasMoved = function(t) {
        var e = t.changedTouches[0],
            i = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > i || Math.abs(e.pageY - this.touchStartY) > i
    }, t.prototype.onTouchMove = function(t) { return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) }, t.prototype.findControl = function(t) { return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea") }, t.prototype.onTouchEnd = function(t) {
        var e, r, s, c, l, u = this.targetElement;
        if (!this.trackingClick) return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, r = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, a && (l = t.changedTouches[0], u = document.elementFromPoint(l.pageX - window.pageXOffset, l.pageY - window.pageYOffset) || u, u.fastClickScrollParent = this.targetElement.fastClickScrollParent), s = u.tagName.toLowerCase(), "label" === s) {
            if (e = this.findControl(u)) {
                if (this.focus(u), i) return !1;
                u = e
            }
        } else if (this.needsFocus(u)) return t.timeStamp - r > 100 || n && window.top !== window && "input" === s ? (this.targetElement = null, !1) : (this.focus(u), this.sendClick(u, t), n && "select" === s || (this.targetElement = null, t.preventDefault()), !1);
        return !(!n || o || (c = u.fastClickScrollParent, !c || c.fastClickLastScrollTop === c.scrollTop)) || (this.needsClick(u) || (t.preventDefault(), this.sendClick(u, t)), !1)
    }, t.prototype.onTouchCancel = function() { this.trackingClick = !1, this.targetElement = null }, t.prototype.onMouse = function(t) { return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1)))) }, t.prototype.onClick = function(t) { var e; return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail || (e = this.onMouse(t), e || (this.targetElement = null), e) }, t.prototype.destroy = function() {
        var t = this.layer;
        i && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, t.notNeeded = function(t) { var e, n, o, a; if ("undefined" == typeof window.ontouchstart) return !0; if (n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) { if (!i) return !0; if (e = document.querySelector("meta[name=viewport]")) { if (e.content.indexOf("user-scalable=no") !== -1) return !0; if (n > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0 } } if (r && (o = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), o[1] >= 10 && o[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) { if (e.content.indexOf("user-scalable=no") !== -1) return !0; if (document.documentElement.scrollWidth <= window.outerWidth) return !0 } return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (a = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], !!(a >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (e.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth))) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction)) }, t.attach = function(e, i) { return new t(e, i) }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() { return t }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}(), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

    function i(t) { return this.each(function() { new e(this, t) }) }
    var n = t.YDUI.util;
    e.DEFAULTS = { binder: t, initLoad: !0, pageSize: 0, loadingHtml: "加载中...", doneTxt: "没有更多数据了", backposition: !1, jumpLink: "", loadListFn: null, loadStorageListFn: null }, e.prototype.init = function() {
        var e = this,
            i = e.options,
            o = t.location;
        if (~~i.pageSize <= 0) return void console.error("[YDUI warn]: 需指定pageSize参数【即每页请求数据的长度】");
        var a = o.pathname.toUpperCase().replace(/\/?\.?/g, "");
        a || (a = "YDUI_" + o.host.toUpperCase().replace(/\/?\.?:?/g, "")), e.backParamsKey = a + "_BACKPARAMS", e.backParamsListKey = a + "_LIST_", e.$element.append(e.$tag = $('<div class="J_InfiniteScrollTag"></div>')), e.listOffsetTop = e.$element.offset().top, e.initLoadingTip(), i.initLoad && (i.backposition ? !n.sessionStorage.get(e.backParamsKey) && e.loadList() : e.loadList()), e.bindScrollEvent(), i.backposition && (e.loadListFromStorage(), e.bindLinkEvent())
    }, e.prototype.initLoadingTip = function() {
        var t = this;
        t.$element.append(t.$loading = $('<div class="list-loading">' + t.options.loadingHtml + "</div>"))
    }, e.prototype.scrollPosition = function() {
        var t = this,
            e = t.options,
            i = $(e.binder),
            o = n.sessionStorage.get(t.backParamsKey);
        o && i.stop().animate({ scrollTop: o.offsetTop }, 0, function() { t.scrolling = !1 }), e.backposition && t.bindLinkEvent(), n.pageScroll.unlock(), n.sessionStorage.remove(t.backParamsKey)
    }, e.prototype.bindScrollEvent = function() {
        var e = this,
            i = $(e.options.binder),
            n = i.get(0) === t,
            o = n ? $(t).height() : i.height();
        i.on("scroll.ydui.infinitescroll", function() {
            if (!e.loading && !e.isDone) {
                var a = n ? $(t).scrollTop() : i.offset().top;
                e.$tag.offset().top <= a + o + o / 10 && e.loadList()
            }
        })
    }, e.prototype.bindLinkEvent = function() {
        var t = this,
            e = t.options;
        return e.jumpLink ? void $(t.options.binder).on("click.ydui.infinitescroll", t.options.jumpLink, function(e) {
            e.preventDefault();
            var i = $(this),
                o = i.data("page");
            return o ? (n.sessionStorage.set(t.backParamsKey, { offsetTop: $(t.options.binder).scrollTop() + i.offset().top - t.listOffsetTop, page: o }), void(location.href = i.attr("href"))) : void console.error('[YDUI warn]: 跳转链接元素需添加属性[data-page="其所在页码"]')
        }) : void console.error("[YDUI warn]: 需指定跳转详情页链接元素")
    }, e.prototype.loadList = function() {
        var t = this,
            e = t.options;
        t.loading = !0, t.$loading.show(), "function" == typeof e.loadListFn && e.loadListFn().done(function(i, o) { var a = i.length; return ~~a <= 0 ? void console.error("[YDUI warn]: 需在 resolve() 方法里回传本次获取记录集合") : (a < e.pageSize && (t.$element.append('<div class="list-donetip">' + e.doneTxt + "</div>"), t.isDone = !0), t.$loading.hide(), t.loading = !1, void(e.backposition && n.sessionStorage.set(t.backParamsListKey + o, i))) })
    }, e.prototype.loadListFromStorage = function() {
        var t = this,
            e = n.sessionStorage.get(t.backParamsKey);
        if (e) {
            n.pageScroll.lock();
            for (var i = e.page, o = [], a = 1; a <= i; a++) {
                var r = n.sessionStorage.get(t.backParamsListKey + a);
                o.push({ page: a, list: r }), a == i && r.length < t.options.pageSize && (t.$element.append('<div class="list-donetip">' + t.options.doneTxt + "</div>"), t.$loading.hide(), t.loading = !1, t.isDone = !0)
            }
            t.options.loadStorageListFn(o, i + 1).done(function() { t.scrollPosition() })
        }
    }, $.fn.infiniteScroll = i
}(window), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

    function i(t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var n = $(this),
                o = n.data("ydui.keyboard");
            o || n.data("ydui.keyboard", o = new e(this, t)), "string" == typeof t && o[t] && o[t].apply(o, i)
        })
    }
    var n = !!(t.navigator && t.navigator.userAgent || "").match(/AppleWebKit.*Mobile.*/) || "ontouchstart" in t.document.documentElement,
        o = n ? "touchstart" : "click";
    e.DEFAULTS = { disorder: !1, title: "安全键盘" }, e.prototype.init = function() {
        function t() { for (var t = "", e = 0; e < 6; e++) t += "<li><i></i></li>"; return t }
        var e = this;
        e.inputNums = "", e.toggleClass = "keyboard-show";
        var i = '<div class="keyboard-head"><strong>输入数字密码</strong></div><div class="keyboard-error"></div><ul class="keyboard-password J_FillPwdBox">' + t() + "</ul>",
            n = '<div class="keyboard-content">   <div class="keyboard-title">' + e.options.title + '</div>   <ul class="keyboard-numbers"></ul></div>';
        e.$element.prepend(i).append(n), e.$numsBox = e.$element.find(".keyboard-numbers"), e.$mask = $('<div class="mask-black"></div>')
    }, e.prototype.open = function() {
        var t = this,
            e = t.$element,
            i = t.$numsBox;
        YDUI.device.isIOS && $(".g-scrollview").addClass("g-fix-ios-overflow-scrolling-bug"), e.addClass(t.toggleClass), (t.options.disorder || 1 != i.data("loaded-nums")) && i.data("loaded-nums", 1).html(t.createNumsHtml()), getCurrentPage().append(t.$mask), t.bindEvent()
    }, e.prototype.close = function() {
        var t = this;
        YDUI.device.isIOS && $(".g-scrollview").removeClass("g-fix-ios-overflow-scrolling-bug"), t.$mask.remove(), t.$element.removeClass(t.toggleClass), t.unbindEvent(), t.inputNums = "", t.fillPassword(), t.clearError()
    }, e.prototype.bindEvent = function() {
        var t = this,
            e = t.$element;
        t.$mask.on(o + ".ydui.keyboard.mask", function(e) { e.preventDefault(), t.close() }), e.on(o + ".ydui.keyboard.nums", ".J_Nums", function(e) { t.inputNums.length >= 6 || (t.inputNums = t.inputNums + $(this).html(), t.clearError(), t.fillPassword()) }), e.on(o + ".ydui.keyboard.backspace", ".J_Backspace", function(e) { e.preventDefault(), t.backspace() }), e.on(o + ".ydui.keyboard.cancel", ".J_Cancel", function(e) { e.preventDefault(), t.close() })
    }, e.prototype.unbindEvent = function() { this.$element.off(o + ".ydui.keyboard"), $(t).off("hashchange.ydui.keyboard") }, e.prototype.fillPassword = function() {
        var t = this,
            e = t.inputNums,
            i = e.length,
            n = t.$element.find(".J_FillPwdBox").find("li");
        n.find("i").hide(), n.filter(":lt(" + i + ")").find("i").css("display", "block"), i >= 6 && t.$element.trigger($.Event("done.ydui.keyboard", { password: e }))
    }, e.prototype.clearError = function() { this.$element.find(".keyboard-error").html("") }, e.prototype.error = function(t) {
        var e = this;
        e.$element.find(".keyboard-error").html(t), e.inputNums = "", e.fillPassword()
    }, e.prototype.backspace = function() {
        var t = this,
            e = t.inputNums;
        e && (t.inputNums = e.substr(0, e.length - 1)), t.fillPassword()
    }, e.prototype.createNumsHtml = function() {
        var t = this,
            e = t.createNums();
        t.options.disorder && t.upsetOrder(e);
        var i = [];
        return $.each(e, function(t) { t % 3 == 0 && (t >= e.length - 2 ? i.push('<li><a href="javascript:;" class="J_Cancel">取消</a>' + e.slice(t, t + 3).join("") + '<a href="javascript:;" class="J_Backspace"></a></li>') : i.push("<li>" + e.slice(t, t + 3).join("") + "</li>")) }), i.join("")
    }, e.prototype.createNums = function() {
        var t = this,
            e = t.options.disorder;
        if (e && t.cacheNums) return t.cacheNums;
        for (var i = [], n = 1; n <= 10; n++) i.push('<a href="javascript:;" class="J_Nums">' + n % 10 + "</div>");
        return e || (t.cacheNums = i), i
    }, e.prototype.upsetOrder = function(t) { for (var e, i, n, o = Math.floor, a = Math.random, r = t.length, s = o(r / 2) + 1; s--;) e = o(a() * r), i = o(a() * r), e !== i && (n = t[e], t[e] = t[i], t[i] = n); return t }, $.fn.keyBoard = i
}(window), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }
    e.DEFAULTS = { attr: "data-url", binder: t, placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQIHWN4BQAA7ADrKJeAMwAAAABJRU5ErkJggg==" }, e.prototype.init = function() {
        var e = this;
        e.bindImgEvent(), e.loadImg(), $(e.options.binder).on("scroll.ydui.lazyload", function() { e.loadImg() }), $(t).on("resize.ydui.lazyload", function() { e.loadImg() })
    }, e.prototype.loadImg = function() {
        var e = this,
            i = e.options,
            n = $(i.binder),
            o = n.height(),
            a = n.get(0) === t ? $(t).scrollTop() : n.offset().top;
        e.$element.each(function() {
            var t = $(this),
                e = t.offset().top - a,
                i = e + t.height();
            (e >= 0 && e < o || i > 0 && i <= o) && t.trigger("appear.ydui.lazyload")
        })
    }, e.prototype.bindImgEvent = function() {
        var t = this,
            e = t.options;
        t.$element.each(function() {
            var t = $(this);
            t.is("img") && !t.attr("src") && t.attr("src", e.placeholder), t.one("appear.ydui.lazyload", function() { t.is("img") && t.attr("src", t.attr(e.attr)) })
        })
    }, $.fn.lazyLoad = function(t) { new e(this, t) }
}(window), ! function(t) {
    "use strict";

    function e(t, e) { this.pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}", n.apply(this, arguments) }

    function i(t, e) { this.pathTemplate = "M 0,{center} L 100,{center}", n.apply(this, arguments) }

    function n(t, e) { this.$element = $(t), this.options = $.extend({}, n.DEFAULTS, e || {}) }

    function o(t) {
        var n = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var o = $(this),
                a = o.data("ydui.progressbar");
            a || ("line" == t.type ? o.data("ydui.progressbar", a = new i(this, t)) : o.data("ydui.progressbar", a = new e(this, t)), t && "object" != typeof t || a.appendView()), "string" == typeof t && a[t] && a[t].apply(a, n)
        })
    }
    var a = t.document,
        r = t.YDUI.util;
    e.prototype = new n, e.prototype.getPathString = function(t) {
        var e = this,
            i = 50 - t / 2;
        return e.render(e.pathTemplate, { radius: i, "2radius": 2 * i })
    }, e.prototype.initSvg = function(t) { t.setAttribute("viewBox", "0 0 100 100"), t.style.display = "block", t.style.width = "100%" }, i.prototype = new n, i.prototype.getPathString = function(t) { var e = this; return e.render(e.pathTemplate, { center: t / 2 }) }, i.prototype.initSvg = function(t, e) { t.setAttribute("viewBox", "0 0 100 " + e.strokeWidth), t.setAttribute("preserveAspectRatio", "none"), t.style.width = "100%", t.style.height = "100%" }, n.DEFAULTS = { type: "circle", strokeWidth: 0, strokeColor: "#E5E5E5", trailWidth: 0, trailColor: "#646464", fill: "", progress: 0, delay: !0, binder: t }, n.prototype.set = function(t) {
        var e = this,
            i = e.trailPath.getTotalLength();
        t || (t = e.options.progress), t > 1 && (t = 1), e.trailPath.style.strokeDashoffset = i - t * i
    }, n.prototype.appendView = function() {
        var e = this,
            i = e.options,
            n = i.progress,
            o = e.createSvgView(),
            a = e.$element;
        e.$binder = i.binder === t || "window" == i.binder ? $(t) : $(i.binder);
        var r = o.trailPath,
            s = r.getTotalLength();
        r.style.strokeDasharray = s + " " + s;
        var c = $(o.svg);
        return c.one("appear.ydui.progressbar", function() { e.set(n) }), a.append(c), i.delay ? (e.checkInView(c), e.$binder.on("scroll.ydui.progressbar", function() { e.checkInView(c) }), $(t).on("resize", function() { e.checkInView(c) })) : c.trigger("appear.ydui.progressbar"), this
    }, n.prototype.checkInView = function(e) {
        var i = this,
            n = i.$binder,
            o = n.height(),
            a = n.get(0) === t ? $(t).scrollTop() : n.offset().top,
            r = e.offset().top - a,
            s = r + e.height();
        (r >= 0 && r < o || s > 0 && s <= o) && e.trigger("appear.ydui.progressbar")
    }, n.prototype.createSvgView = function() {
        var t = this,
            e = t.options,
            i = a.createElementNS("http://www.w3.org/2000/svg", "svg");
        t.initSvg(i, e);
        var n = t.createPath(e);
        i.appendChild(n);
        var o = null;
        return (e.trailColor || e.trailWidth) && (o = t.createTrailPath(e), o.style.strokeDashoffset = o.getTotalLength(), i.appendChild(o)), t.svg = i, t.trailPath = o, { svg: i, trailPath: o }
    }, n.prototype.createTrailPath = function(t) {
        var e = this;
        0 == t.trailWidth && (t.trailWidth = t.strokeWidth);
        var i = e.getPathString(t.trailWidth);
        return e.createPathElement(i, t.trailColor, t.trailWidth)
    }, n.prototype.createPath = function(t) {
        var e = this,
            i = t.strokeWidth;
        t.trailWidth && t.trailWidth > t.strokeWidth && (i = t.trailWidth);
        var n = e.getPathString(i);
        return e.createPathElement(n, t.strokeColor, t.strokeWidth, t.fill)
    }, n.prototype.createPathElement = function(t, e, i, n) { var o = a.createElementNS("http://www.w3.org/2000/svg", "path"); return o.setAttribute("d", t), o.setAttribute("stroke", e), o.setAttribute("stroke-width", i), n ? o.setAttribute("fill", n) : o.setAttribute("fill-opacity", "0"), o }, n.prototype.render = function(t, e) {
        var i = t;
        for (var n in e)
            if (e.hasOwnProperty(n)) {
                var o = e[n],
                    a = "\\{" + n + "\\}",
                    r = new RegExp(a, "g");
                i = i.replace(r, o)
            }
        return i
    }, $("[data-ydui-progressbar]").each(function() {
        var t = $(this);
        o.call(t, r.parseOptions(t.data("ydui-progressbar")))
    }), $.fn.progressBar = o
}(window), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

    function i(t) {
        return this.each(function() {
            var i = this;
            new e(i, t)
        })
    }
    e.DEFAULTS = { loadListFn: null, initLoad: !0, distance: 100 }, e.prototype.init = function() {
        var t = this,
            e = t.touches;
        t.$dragTip = $('<div class="pullrefresh-dragtip"><span></span></div>'), t.$element.after(t.$dragTip), t.offsetTop = t.$element.offset().top, t.initTip(), t.bindEvent(), t.options.initLoad && (e.loading = !0, "function" == typeof t.options.loadListFn && t.options.loadListFn().done(function() { e.loading = !1 }))
    }, e.prototype.bindEvent = function() {
        var t = this;
        t.$element.on("touchstart.ydui.pullrefresh", function(e) { t.onTouchStart(e) }).on("touchmove.ydui.pullrefresh", function(e) { t.onTouchMove(e) }).on("touchend.ydui.pullrefresh", function(e) { t.onTouchEnd(e) }), t.stopWeixinDrag()
    }, e.prototype.touches = { loading: !1, startClientY: 0, moveOffset: 0, isDraging: !1 }, e.prototype.stopWeixinDrag = function() {
        var t = this;
        $(document.body).on("touchmove.ydui.pullrefresh", function(e) { t.touches.isDraging && e.preventDefault() })
    }, e.prototype.onTouchStart = function(t) {
        var e = this;
        return e.touches.loading ? void t.preventDefault() : void(e.$element.offset().top < e.offsetTop || (e.touches.startClientY = t.originalEvent.touches[0].clientY));
    }, e.prototype.onTouchMove = function(t) {
        var e = this,
            i = t.originalEvent.touches[0];
        if (e.touches.loading) return void t.preventDefault();
        if (!(e.touches.startClientY > i.clientY || e.$element.offset().top < e.offsetTop || e.touches.loading)) {
            e.touches.isDraging = !0;
            var n = i.clientY - e.touches.startClientY;
            e.$dragTip.find("span").css("opacity", n / 100), n >= e.options.distance && (n = e.options.distance), e.$dragTip.find("span").css("transform", "rotate(" + n / .25 + "deg)"), e.touches.moveOffset = n, e.moveDragTip(n)
        }
    }, e.prototype.onTouchEnd = function(t) {
        var e = this,
            i = e.touches;
        if (i.loading) return void t.preventDefault();
        if (!(e.$element.offset().top < e.offsetTop)) {
            if (e.$dragTip.addClass("pullrefresh-animation-timing"), i.moveOffset >= e.options.distance) return e.moveDragTip(e.options.distance / 1.5), e.$dragTip.find("span").addClass("pullrefresh-loading"), void e.triggerLoad();
            e.touches.isDraging = !1, e.resetDragTip(), e.resetLoading()
        }
    }, e.prototype.triggerLoad = function() {
        var t = this,
            e = t.touches;
        e.loading = !0, "function" == typeof t.options.loadListFn && t.options.loadListFn().done(function() { setTimeout(function() { t.$dragTip.css({ transform: "translate3d(0px, " + t.options.distance / 1.5 + "px, 0px) scale(0)" }), t.resetDragTip() }, 200) })
    }, e.prototype.resetLoading = function() {
        var t = this;
        t.moveDragTip(0), t.$dragTip.find("span").removeClass("pullrefresh-loading").css({ opacity: .5, transform: "rotate(0deg)" })
    }, e.prototype.resetDragTip = function() {
        var t = this,
            e = t.touches;
        setTimeout(function() { e.isDraging = !1, e.loading = !1, e.moveOffset = 0, t.moveDragTip(0), t.resetLoading(), t.$dragTip.removeClass("pullrefresh-animation-timing") }, 150)
    }, e.prototype.moveDragTip = function(t) { this.$dragTip.css({ transform: "translate3d(0," + t + "px,0) scale(1)" }) }, e.prototype.initTip = function() {
        var e = this,
            i = t.localStorage;
        "YDUI" != i.getItem("LIST-PULLREFRESH-TIP") && (e.$tip = $('<div class="pullrefresh-draghelp"><div><span>下拉更新</span></div></div>'), e.$tip.on("click.ydui.pullrefresh", function() { $(this).remove() }), e.$element.after(e.$tip), i.setItem("LIST-PULLREFRESH-TIP", "YDUI"), setTimeout(function() { e.$tip.remove() }, 5e3))
    }, $.fn.pullRefresh = i
}(window),
// ! function(t) {
//     "use strict";

//     function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

//     function i(t) {
//         var i = Array.prototype.slice.call(arguments, 1);
//         return this.each(function() {
//             var n = this,
//                 o = $(n),
//                 a = o.data("ydui.scrolltab");
//             a || o.data("ydui.scrolltab", a = new e(n, t)), "string" == typeof t && a[t] && a[t].apply(a, i)
//         })
//     }
//     e.DEFAULTS = { navItem: ".scrolltab-item", content: ".scrolltab-content", contentItem: ".scrolltab-content-item", initIndex: 0 }, e.prototype.init = function() {
//         var t = this,
//             e = t.$element,
//             i = t.options;
//         t.$navItem = e.find(i.navItem), t.$content = e.find(i.content), t.$contentItem = e.find(i.contentItem), t.scrolling = !1, t.contentOffsetTop = t.$content.offset().top, t.bindEvent(), t.movePosition(t.options.initIndex, !1)
//     }, e.prototype.bindEvent = function() {
//         var t = this;
//         t.$content.on("resize.ydui.scrolltab scroll.ydui.scrolltab", function() { t.checkInView() }), t.$navItem.on("click.ydui.scrolltab", function() { t.movePosition($(this).index(), !0) })
//     }, e.prototype.movePosition = function(t, e) {
//         var i = this;
//         if (!i.scrolling) {
//             i.scrolling = !0, i.$navItem.removeClass("crt"), i.$navItem.eq(t).addClass("crt");
//             var n = i.$contentItem.eq(t);
//             if (n[0]) {
//                 var o = n.offset().top,
//                     a = o + i.$content.scrollTop() - i.contentOffsetTop + 1;
//                 i.$content.stop().animate({ scrollTop: a }, e ? 200 : 0, function() { i.scrolling = !1 })
//             }
//         }
//     }, e.prototype.checkInView = function() {
//         var t = this;
//         if (!t.scrolling) return t.isScrollTop() ? void t.setClass(0) : t.isScrollBottom() ? void t.setClass(t.$navItem.length - 1) : void t.$contentItem.each(function() {
//             var e = $(this);
//             e.offset().top <= t.contentOffsetTop && t.setClass(e.index())
//         })
//     }, e.prototype.setClass = function(t) { this.$navItem.removeClass("crt").eq(t).addClass("crt") }, e.prototype.isScrollTop = function() { return 0 == this.$content.scrollTop() }, e.prototype.isScrollBottom = function() { var t = this; return t.$content.scrollTop() + 3 >= t.$contentItem.height() * t.$contentItem.length - t.$content.height() }, $(t).on("load.ydui.scrolltab", function() {
//         $("[data-ydui-scrolltab]").each(function() {
//             var e = $(this);
//             e.scrollTab(t.YDUI.util.parseOptions(e.data("ydui-scrolltab")))
//         })
//     }), $.fn.scrollTab = i
// }(window)
/**
 * ScrollTab Plugin
 */
! function(window) {
    "use strict";

    function ScrollTab(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, ScrollTab.DEFAULTS, options || {});
        this.init();
    }

    ScrollTab.DEFAULTS = {
        navItem: '.scrolltab-item',
        content: '.scrolltab-content',
        contentItem: '.scrolltab-content-item',
        initIndex: 0
    };

    ScrollTab.prototype.init = function() {
        var _this = this,
            $element = _this.$element,
            options = _this.options;

        _this.$navItem = $element.find(options.navItem);
        _this.$content = $element.find(options.content);
        _this.$contentItem = $element.find(options.contentItem);

        _this.scrolling = false;
        _this.contentOffsetTop = _this.$content.offset().top;

        _this.bindEvent();

        _this.movePosition(_this.options.initIndex, false);
    };

    ScrollTab.prototype.bindEvent = function() {
        var _this = this;

        _this.$content.on('resize.ydui.scrolltab scroll.ydui.scrolltab', function() {
            _this.checkInView();
        });

        _this.$navItem.on('click.ydui.scrolltab', function() {
            _this.movePosition($(this).index(), true);
        });
    };

    ScrollTab.prototype.movePosition = function(index, animate) {
        var _this = this;

        if (_this.scrolling) return;
        _this.scrolling = true;

        _this.$navItem.removeClass('crt');
        _this.$navItem.eq(index).addClass('crt');

        var $item = _this.$contentItem.eq(index);
        if (!$item[0]) return;

        var offset = $item.offset().top;

        var top = offset + _this.$content.scrollTop() - _this.contentOffsetTop + 1;


        _this.$content.stop().animate({ scrollTop: top }, animate ? 200 : 0, function() {
            _this.scrolling = false;
        });
    };

    ScrollTab.prototype.checkInView = function() {
        var _this = this;

        if (_this.scrolling) return;

        if (_this.isScrollTop()) {
            _this.setClass(0);
            return;
        }

        if (_this.isScrollBottom()) {
            _this.setClass(_this.$navItem.length - 1);
            return;
        }

        _this.$contentItem.each(function() {
            var $this = $(this);

            if ($this.offset().top <= _this.contentOffsetTop) {
                _this.setClass($this.index());
            }
        });
    };

    ScrollTab.prototype.setClass = function(index) {
        this.$navItem.removeClass('crt').eq(index).addClass('crt');
    };

    ScrollTab.prototype.isScrollTop = function() {
        return this.$content.scrollTop() == 0;
    };

    ScrollTab.prototype.isScrollBottom = function() {
        var _this = this;

        return _this.$content.scrollTop() + 3 >= _this.$contentItem.height() * _this.$contentItem.length - _this.$content.height();
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var target = this,
                $this = $(target),
                scrollTab = $this.data('ydui.scrolltab');

            if (!scrollTab) {
                $this.data('ydui.scrolltab', (scrollTab = new ScrollTab(target, option)));
            }

            if (typeof option == 'string') {
                scrollTab[option] && scrollTab[option].apply(scrollTab, args);
            }
        });
    }

    $(window).on('load.ydui.scrolltab', function() {
        $('[data-ydui-scrolltab]').each(function() {
            var $this = $(this);
            $this.scrollTab(window.YDUI.util.parseOptions($this.data('ydui-scrolltab')));
            console.log(2222222222);
        });
    });

    $.fn.scrollTab = Plugin;

}(window)

, ! function() {
    "use strict";

    function t(e, i) { this.$btn = $(e), this.options = $.extend({}, t.DEFAULTS, i || {}) }

    function e(e) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var n = $(this),
                o = n.data("ydui.sendcode");
            o || (n.data("ydui.sendcode", o = new t(this, e)), "object" == typeof e && e.run && o.start()), "string" == typeof e && o[e] && o[e].apply(o, i)
        })
    }
    t.DEFAULTS = { run: !1, secs: 60, disClass: "", runStr: "{%s}秒后重新获取", resetStr: "重新获取验证码" }, t.timer = null, t.prototype.start = function() {
        var t = this,
            e = t.options,
            i = e.secs;
        t.$btn.html(t.getStr(i)).css("pointer-events", "none").addClass(e.disClass), t.timer = setInterval(function() { i--, t.$btn.html(t.getStr(i)), i <= 0 && (t.resetBtn(), clearInterval(t.timer)) }, 1e3)
    }, t.prototype.getStr = function(t) { return this.options.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, t) }, t.prototype.resetBtn = function() {
        var t = this,
            e = t.options;
        t.$btn.html(e.resetStr).css("pointer-events", "auto").removeClass(e.disClass)
    }, $.fn.sendCode = e
}(), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

    function i(t) {
        return this.each(function() {
            var i = $(this),
                n = i.data("ydui.slider");
            n || i.data("ydui.slider", new e(this, t))
        })
    }
    e.DEFAULTS = { speed: 300, autoplay: 3e3, lazyLoad: !1, pagination: ".slider-pagination", wrapperClass: "slider-wrapper", slideClass: "slider-item", bulletClass: "slider-pagination-item", bulletActiveClass: "slider-pagination-item-active" }, e.prototype.init = function() {
        var t = this,
            e = t.options,
            i = t.$element;
        t.index = 1, t.autoPlayTimer = null, t.$pagination = i.find(e.pagination), t.$wrapper = i.find("." + e.wrapperClass), t.itemNums = t.$wrapper.find("." + e.slideClass).length, e.lazyLoad && t.loadImage(0), t.createBullet(), t.cloneItem().bindEvent()
    }, e.prototype.bindEvent = function() {
        var e = this,
            i = e.touchEvents();
        e.$wrapper.find("." + e.options.slideClass).on(i.start, function(t) { e.onTouchStart(t) }).on(i.move, function(t) { e.onTouchMove(t) }).on(i.end, function(t) { e.onTouchEnd(t) }), $(t).on("resize.ydui.slider", function() { e.setSlidesSize() }), ~~e.options.autoplay > 0 && e.autoPlay(), e.$wrapper.on("click.ydui.slider", function(t) { e.touches.allowClick || t.preventDefault() })
    }, e.prototype.cloneItem = function() {
        var t = this,
            e = t.$wrapper,
            i = t.$wrapper.find("." + t.options.slideClass),
            n = i.filter(":first-child").clone(),
            o = i.filter(":last-child").clone();
        return e.prepend(o), e.append(n), t.setSlidesSize(), t
    }, e.prototype.createBullet = function() {
        var t = this;
        if (t.$pagination[0]) {
            var e = '<span class="' + (t.options.bulletClass + " " + t.options.bulletActiveClass) + '"></span>';
            t.$pagination.append(e + new Array(t.itemNums).join('<span class="' + t.options.bulletClass + '"></span>'))
        }
    }, e.prototype.activeBullet = function() {
        var t = this;
        if (t.$pagination[0]) {
            var e = t.itemNums,
                i = t.index % e >= e ? 0 : t.index % e - 1,
                n = t.options.bulletActiveClass;
            !!t.$pagination[0] && t.$pagination.find("." + t.options.bulletClass).removeClass(n).eq(i).addClass(n)
        }
    }, e.prototype.setSlidesSize = function() {
        var t = this,
            e = t.$wrapper.width();
        t.$wrapper.css("transform", "translate3d(-" + e + "px,0,0)"), t.$wrapper.find("." + t.options.slideClass).css({ width: e })
    }, e.prototype.autoPlay = function() {
        var t = this;
        t.autoPlayTimer = setInterval(function() { t.index > t.itemNums && (t.index = 1, t.setTranslate(0, -t.$wrapper.width())), t.setTranslate(t.options.speed, -(++t.index * t.$wrapper.width())) }, t.options.autoplay)
    }, e.prototype.stopAutoplay = function() { var t = this; return clearInterval(t.autoPlayTimer), t }, e.prototype.loadImage = function(t) {
        var e = this,
            i = e.$wrapper.find("." + e.options.slideClass).eq(t).find("img"),
            n = i.data("src");
        1 != i.data("load") && !!n && i.attr("src", n).data("load", 1)
    }, e.prototype.setTranslate = function(t, e) {
        var i = this;
        i.options.lazyLoad && i.loadImage(i.index), i.activeBullet(), i.$wrapper.css({ transitionDuration: t + "ms", transform: "translate3d(" + e + "px,0,0)" })
    }, e.prototype.touches = { moveTag: 0, startClientX: 0, moveOffset: 0, touchStartTime: 0, isTouchEvent: !1, allowClick: !1 }, e.prototype.onTouchStart = function(t) {
        t.originalEvent.touches && (t = t.originalEvent.touches[0]);
        var e = this,
            i = e.touches;
        if (i.allowClick = !0, i.isTouchEvent = "touchstart" === t.type, (i.isTouchEvent || !("which" in t) || 3 !== t.which) && 0 == i.moveTag) {
            i.moveTag = 1, i.startClientX = t.clientX, i.touchStartTime = Date.now();
            var n = e.itemNums;
            if (0 == e.index) return e.index = n, void e.setTranslate(0, -n * e.$wrapper.width());
            e.index > n && (e.index = 1, e.setTranslate(0, -e.$wrapper.width()))
        }
    }, e.prototype.onTouchMove = function(t) {
        t.preventDefault(), t.originalEvent.touches && (t = t.originalEvent.touches[0]);
        var e = this,
            i = e.touches;
        if (i.allowClick = !1, !i.isTouchEvent || "mousemove" !== t.type) {
            var n = i.moveOffset = t.clientX - i.startClientX;
            0 != n && 0 != i.moveTag && (1 == i.moveTag && (e.stopAutoplay(), i.moveTag = 2), 2 == i.moveTag && e.setTranslate(0, -e.index * e.$wrapper.width() + n))
        }
    }, e.prototype.onTouchEnd = function() {
        var t = this,
            e = t.options.speed,
            i = t.$wrapper.width(),
            n = t.touches,
            o = n.moveOffset;
        if (setTimeout(function() { n.allowClick = !0 }, 0), 1 == n.moveTag && (n.moveTag = 0), 2 == n.moveTag) {
            n.moveTag = 0;
            var a = Date.now() - n.touchStartTime;
            a > 300 && Math.abs(o) <= .5 * t.$wrapper.width() ? t.setTranslate(e, -t.index * t.$wrapper.width()) : t.setTranslate(e, -((o > 0 ? --t.index : ++t.index) * i)), t.autoPlay()
        }
    }, e.prototype.touchEvents = function() { var e = t.Modernizr && !!t.Modernizr.touch || function() { return !!("ontouchstart" in t || t.DocumentTouch && document instanceof DocumentTouch) }(); return { start: e ? "touchstart.ydui.slider" : "mousedown.ydui.slider", move: e ? "touchmove.ydui.slider" : "mousemove.ydui.slider", end: e ? "touchend.ydui.slider" : "mouseup.ydui.slider" } }, $(t).on("load.ydui.slider", function() {
        $("[data-ydui-slider]").each(function() {
            var e = $(this);
            e.slider(t.YDUI.util.parseOptions(e.data("ydui-slider")))
        })
    }), $.fn.slider = i
}(window), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init() }

    function i(t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var n = $(this),
                o = n.data("ydui.spinner");
            o || n.data("ydui.spinner", o = new e(this, t)), "string" == typeof t && o[t] && o[t].apply(o, i)
        })
    }
    e.DEFAULTS = { input: ".J_Input", add: ".J_Add", minus: ".J_Del", unit: 1, max: 0, min: -1, longpress: !0, callback: null }, e.prototype.init = function() {
        var t = this,
            e = t.options;
        t.$input = $(e.input, t.$element), t.$add = $(e.add, t.$element), t.$minus = $(e.minus, t.$element), t.changeParameters(), t.checkParameters(), t.bindEvent()
    }, e.prototype.tapParams = {}, e.prototype.isNumber = function(t) { return /^\d*$/.test(t) }, e.prototype.FixNumber = function(t) { return parseInt(t) }, e.prototype.changeParameters = function() {
        var t = this,
            e = t.options,
            i = [{ param: "unit", "default": 1 }, { param: "max", "default": 0 }];
        $.each(i, function(i, n) {
            var o = e[n.param],
                a = t.$input.data(n.param);
            if (a) o = a, t.isNumber(a) || (o = e[n.param], "function" == typeof o && (o = o()));
            else if ("function" == typeof e[n.param]) {
                var r = e[n.param]();
                o = r, t.isNumber(r) || (o = e[n.param])
            }
            t.isNumber(o) || (o = n["default"]), e[n.param] = t.FixNumber(o)
        })
    }, e.prototype.checkParameters = function() {
        var t = this,
            e = t.options,
            i = t.$input.val();
        i ? t.setValue(i) : (e.max < e.min && 0 != e.max && (e.max = e.min), e.min < e.unit && e.min > 0 && (e.min = e.unit), e.min % e.unit != 0 && e.min > 0 && (e.min = e.min - e.min % e.unit), e.max < e.unit && 0 != e.max && (e.max = e.unit), e.max % e.unit != 0 && (e.max = e.max - e.max % e.unit), e.min < 0 && (e.min = e.unit), t.setValue(e.min))
    }, e.prototype.calculation = function(t) {
        var e = this,
            i = e.options,
            n = i.max,
            o = i.unit,
            a = i.min,
            r = e.$input,
            s = e.FixNumber(r.val());
        if (!r.attr("readonly") && !r.attr("disabled")) {
            var c;
            if ("add" == t) { if (c = s + o, 0 != n && c > n) return } else if (c = s - o, c < a) return;
            e.setValue(c), i.longpress && e.longpressHandler(t)
        }
    }, e.prototype.longpressHandler = function(t) {
        var e = this,
            i = (new Date).getTime() / 1e3,
            n = i - e.tapStartTime;
        n < 1 && (n = .5);
        var o = 10 * n;
        30 == n && (o = 50), n >= 40 && (o = 100), e.tapParams.timer = setTimeout(function() { e.calculation(t) }, 1e3 / o)
    }, e.prototype.setValue = function(t) {
        var e = this,
            i = e.options,
            n = i.max,
            o = i.unit,
            a = i.min < 0 ? o : i.min;
        /^(([1-9]\d*)|0)$/.test(t) || (t = n), t > n && 0 != n && (t = n), t % o > 0 && (t = t - t % o + o, t > n && 0 != n && (t -= o)), t < a && (t = a - a % o), e.$input.val(t), "function" == typeof i.callback && i.callback(t, e.$input)
    }, e.prototype.bindEvent = function() {
        var t = this,
            e = t.options,
            i = YDUI.device.isMobile,
            n = "mousedown.ydui.spinner",
            o = "mouseup.ydui.spinner";
        i && (n = "touchstart.ydui.spinner", o = "touchend.ydui.spinner"), t.$add.on(n, function(i) { e.longpress && (i.preventDefault(), i.stopPropagation(), t.tapStartTime = (new Date).getTime() / 1e3, t.$add.on(o, function() { t.clearTapTimer() })), t.calculation("add") }), t.$minus.on(n, function(i) { e.longpress && (i.preventDefault(), i.stopPropagation(), t.tapStartTime = (new Date).getTime() / 1e3, t.$minus.on(o, function() { t.clearTapTimer() })), t.calculation("minus") }), t.$input.on("change.ydui.spinner", function() { t.setValue($(this).val()) }).on("keydown", function(e) { if (13 == e.keyCode) return t.setValue($(this).val()), !1 })
    }, e.prototype.clearTapTimer = function() {
        var t = this;
        clearTimeout(t.tapParams.timer)
    }, $(t).on("load.ydui.spinner", function() {
        $("[data-ydui-spinner]").each(function() {
            var e = $(this);
            e.spinner(t.YDUI.util.parseOptions(e.data("ydui-spinner")))
        })
    }), $.fn.spinner = i
}(window), ! function(t) {
    "use strict";

    function e(t, i) { this.$element = $(t), this.options = $.extend({}, e.DEFAULTS, i || {}), this.init(), this.bindEvent(), this.transitioning = !1 }

    function i(t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var n = this,
                o = $(n),
                a = o.data("ydui.tab");
            a || o.data("ydui.tab", a = new e(n, t)), "string" == typeof t && a[t] && a[t].apply(a, i)
        })
    }
    e.TRANSITION_DURATION = 150, e.DEFAULTS = { nav: ".tab-nav-item", panel: ".tab-panel-item", activeClass: "tab-active" }, e.prototype.init = function() {
        var t = this,
            e = t.$element;
        t.$nav = e.find(t.options.nav), t.$panel = e.find(t.options.panel)
    }, e.prototype.bindEvent = function() {
        var t = this;
        t.$nav.each(function(e) { $(this).on("click.ydui.tab", function() { t.open(e) }) })
    }, e.prototype.open = function(t) {
        var e = this;
        t = "number" == typeof t ? t : e.$nav.filter(t).index();
        var i = e.$nav.eq(t);
        e.transitioning || i.hasClass(e.options.activeClass) || (e.transitioning = !0, i.trigger($.Event("open.ydui.tab", { index: t })), e.active(i, e.$nav), e.active(e.$panel.eq(t), e.$panel, function() { i.trigger({ type: "opened.ydui.tab", index: t }), e.transitioning = !1 }))
    }, e.prototype.active = function(t, i, n) {
        function o() { "function" == typeof n && n() }
        var a = this,
            r = a.options.activeClass,
            s = i.filter("." + r);
        t.one("webkitTransitionEnd", o).emulateTransitionEnd(e.TRANSITION_DURATION), s.removeClass(r), t.addClass(r)
    }, $(t).on("load.ydui.tab", function() {
        $("[data-ydui-tab]").each(function() {
            var e = $(this);
            e.tab(t.YDUI.util.parseOptions(e.data("ydui-tab")))
        })
    }), $.fn.tab = i
}(window), ! function(window) {
    "use strict";
    var util = window.YDUI.util = window.YDUI.util || {},
        doc = window.document;
    util.timestampTotime = function(t, e) {
        var i = {},
            n = Math.floor;
        i.f = e % 1e3, e = n(e / 1e3), i.s = e % 60, e = n(e / 60), i.m = e % 60, e = n(e / 60), i.h = e % 24, i.d = n(e / 24);
        var o = function(t) { return t <= 0 ? "" : "$1" + (t < 10 ? "0" + t : t) + "$2" };
        return t = t.replace(/\{([^{]*?)%d(.*?)\}/g, o(i.d)), t = t.replace(/\{([^{]*?)%h(.*?)\}/g, o(i.h)), t = t.replace(/\{([^{]*?)%m(.*?)\}/g, o(i.m)), t = t.replace(/\{([^{]*?)%s(.*?)\}/g, o(i.s)), t = t.replace(/\{([^{]*?)%f(.*?)\}/g, o(i.f))
    }, util.countdown = function(t, e, i, n) {
        var o = this,
            a = setInterval(function() {
                var i = e - (new Date).getTime();
                i > 0 ? n(o.timestampTotime(t, i)) : (clearInterval(a), "function" == typeof n && n(""))
            }, i)
    }, util.calc = function(arg1, op, arg2) {
        var ra = 1,
            rb = 1,
            m;
        try { ra = arg1.toString().split(".")[1].length } catch (e) {}
        try { rb = arg2.toString().split(".")[1].length } catch (e) {}
        switch (m = Math.pow(10, Math.max(ra, rb)), op) {
            case "+":
            case "-":
                arg1 = Math.round(arg1 * m), arg2 = Math.round(arg2 * m);
                break;
            case "*":
                ra = Math.pow(10, ra), rb = Math.pow(10, rb), m = ra * rb, arg1 = Math.round(arg1 * ra), arg2 = Math.round(arg2 * rb);
                break;
            case "/":
                arg1 = Math.round(arg1 * m), arg2 = Math.round(arg2 * m), m = 1
        }
        try { var result = eval("((" + arg1 + ")" + op + "(" + arg2 + "))/" + m) } catch (e) {}
        return result
    }, util.getImgBase64 = function(t, e) {
        var i = this,
            n = "",
            o = t.files[0];
        if (o) {
            if (!/image\/\w+/.test(o.type)) return void i.tipMes("请上传图片文件", "error");
            var a = new FileReader;
            a.readAsDataURL(o), a.onload = function() { n = this.result, "function" == typeof e && e(n) }
        }
    }, util.getQueryString = function(t) {
        var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
            i = window.location.search.substr(1).match(e),
            n = "";
        return null != i && (n = decodeURIComponent(i[2])), n
    }, util.cookie = function() {
        return {
            get: function(t) { var e = doc.cookie.match("(?:^|;)\\s*" + t + "=([^;]*)"); return e && e[1] ? decodeURIComponent(e[1]) : "" },
            set: function(t, e, i, n, o, a) {
                var r = String(encodeURIComponent(e)),
                    s = i;
                "number" == typeof s && (s = new Date, s.setTime(s.getTime() + 1e3 * i)), s instanceof Date && (r += "; expires=" + s.toUTCString()), !!n && (r += "; domain=" + n), r += "; path=" + (o || "/"), a && (r += "; secure"), doc.cookie = t + "=" + r
            }
        }
    }()
}(window);