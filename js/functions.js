/**
 * Created by 867957772@qq.com on 2017/8/8.
 */
// 环境判断
var _runningEnvType = null;
function ua() {
    if (_runningEnvType == null) {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            _runningEnvType = 'wx';
        } else if (ua.match(/ehafo\.app/i) == "ehafo.app" || ua.match(/app\.ehafo/i) == "app.ehafo") {
            _runningEnvType = 'app';
        } else {
            _runningEnvType = 'other';
        }
    }
    return _runningEnvType;
}
// 随机数生成
function randomString(len) {
    len = len || 32;
    var $chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) { pwd += $chars.charAt(Math.floor(Math.random() * maxPos)); }
    return pwd;
}
// 验证手机号
function isPhoneNo(phone) {
    var pattern = /^1[3456789]\d{9}$/;
    return pattern.test(phone);
}
//获取当前时间，格式YYYY-MM-DD
function getTodayDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//判断是否为空
function isNull(o) {
    return o == undefined || o == "undefined" || (o + '').indexOf("undefined") > -1 || o == null || o == '' || o == 'null' || o == [] || o == 0;
}
//layer弹框提示
function notice_msg(msg) {
    YDUI.dialog.toast(msg, 'none', 2000);

}

//YDUI弹框提示
function ydui_msg(msg, msg_time) {
    if (isNull(msg_time)) {
        msg_time = 1000;
    }
    YDUI.dialog.toast(msg, 'none', msg_time);
}


/**
 * 调用一个函数，失败时重复 3 次尝试
 * @param {string} tipText 提示消息，如果设为 false 值，则会在失败后调用 failcb
 * @param {Function} callback 需要调用的函数
 * @param {number} maxCount 最大尝试次数，如果 <= 3 或 false 值，则设为 3
 * @param {Function} failcb 需要自己处理超过最大尝试次数后仍然失败的回调函数
 * @returns {$.Deferred} jQuery 延迟对象
 */
function invokeCounter(tipText, callback, maxCount, failcb) {
    if (!maxCount || maxCount <= 0) { maxCount = 3; }
    var count = 0;
    var context = this;
    var ret = $.Deferred();
    var failCallback = function() {
        count++;
        if (count >= maxCount) {
            if (tipText) {
                if (window.layer) {
                    window.layer.open({
                        content: tipText,
                        btn: ['重试', '取消'],
                        yes: function() { invoker.call(context); },
                        no: function() { ret.reject(); }
                    });
                } else if (window.YDUI) {
                    window.YDUI.dialog.confirm(tipText, [
                        { txt: '取消', color: false, callback: function() { ret.reject(); } },
                        { txt: '重试', color: true, callback: function() { invoker.call(context); } }
                    ]);
                } else {
                    if (window.confirm(tipText)) { invoker.call(context); } else { ret.reject(); }
                }
            } else {
                typeof failcb === 'function' && failcb.call(context);
            }
        } else {
            invoker.call(context);
        }
    };
    var invoker = function() {
        var dorp = callback();
        if (dorp) {
            if (dorp.fail) {
                dorp.done(function() { ret.resolve(); })
                dorp.fail(failCallback);
            } else if (window.Promise && dorp instanceof window.Promise) {
                dorp.then(function() { ret.resolve(); }).catch(failCallback);
            } else {
                ret.resolve();
            }
        } else {
            setTimeout(failCallback);
        }
    };
    invoker.call(context);
    return ret;
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var result = window.location.search.substr(1).match(reg); //匹配目标参数
    if (!isNull(result)) {
        return result[2];
    } else {
        return null;
    }
}
//弹框提示并跳转
function notic_and_jump_url(msg, url, back) {
    if (url == '#/v4/wxlogin') {
        if (ua() == 'wx') {
            location.href = api_domain + '/login_v3.php?loginsys=wx&scope=userinfo&sessionid=' + localStorage.sessionid + '&callback=' + api_domain + '/tiku/wx_callback.php&referer=' + domain + '/?module=v4';
            // return false;
        } else {
            Router.replaceAs("#/v4/wxlogin", false);
        }
    } else {
        if (isNull(back)) {
            Router.replaceAs(url, false);
        } else {
            Router.replace(url, true, true);
        }
    }
    setTimeout(function() {
        YDUI.dialog.toast(msg, 'none', 2000);
    }, 300);
    setTimeout(function() {
        $('body').find('.mask-white-dialog').remove();
    }, 1300);
}
//分享公共方法
// ziliao、partjob、yami、agent、v4、exam
function exam_share(event) {
    if (ua() == 'wx') {
        wx.config(wxconfig);
        wx.ready(function() {
            var pagenow = Router.CurrentRouteState.route.page;
            if (event == 'partjob') {
                share_title = '易哈佛兼职专家系统';
                share_desc = '各个领域专家运用专业的学科知识，帮助易哈佛百万考生解决疑难问题，完成任务将会获得丰厚奖励！';
                share_url = base_url + '&module=partjob';
                share_img = safe_domain + '/static/images/logow.png';
            }
            if (event == 'yami') {
                share_title = '易哈佛考前押密';
                share_desc = '10年名师精准押密，好评率高达96.6%，以易哈佛信誉郑重承诺不过包退';
                share_url = base_url + '&module=yami';
                share_img = safe_domain + '/static/images/logow.png';
            }
            if (event == 'exam') {
                share_title = '易哈佛通关密卷';
                share_desc = '老师强烈推荐的精编高频考题，百万考生的信赖所选，助力轻松提高90%考试通过率';
                share_url = base_url + '&module=exam';
                share_img = safe_domain + '/static/images/logow.png';
                if (!isNull(localStorage.share_title)) {
                    share_title = localStorage.share_title;
                }
                if (!isNull(localStorage.share_desc)) {
                    share_desc = localStorage.share_desc;
                }
                if (!isNull(localStorage.share_url)) {
                    share_url = localStorage.share_url;
                }
                if (!isNull(localStorage.share_img)) {
                    share_img = localStorage.share_img;
                }
            }
            if (event == 'exam_free') {

                if (isNull(localStorage.exam_name)) {
                    share_title = '易哈佛2018年通关点题密卷，考前最后一卷，逆袭就在眼前【全解析】';
                } else {
                    share_title = '易哈佛《' + localStorage.exam_name + '》通关点题密卷，考前最后一卷！【全解析】';
                }
                share_desc = '考前通关全真模拟卷，终极冲刺，最后一卷！';
                share_url = base_url + '&module=exam&page=exam&cid=' + localStorage.day_cid;
                share_img = safe_domain + '/static/images/exam/tongguan_logo.png';
                if (!isNull(localStorage.share_title)) {
                    share_title = localStorage.share_title;
                } else {
                    //删除分享类型
                    localStorage.removeItem('exam_share_type');
                }
                if (!isNull(localStorage.share_desc)) {
                    share_desc = localStorage.share_desc;
                }
                if (!isNull(localStorage.share_url)) {
                    share_url = localStorage.share_url;
                }
                if (!isNull(localStorage.share_img)) {
                    share_img = localStorage.share_img;
                }
            }
            if (event == 'v4') {
                if (isNull(localStorage.tiku_year)) {
                    var now = new Date();
                    localStorage.tiku_year = now.getFullYear();
                }
                var default_title_text = localStorage.tiku_year + '年' + localStorage.exam_name;
                if (share_title.indexOf('##考试') != -1) {
                    share_title = share_title.replace('##考试##', default_title_text);
                } else {
                    share_title = '易哈佛【' + default_title_text + '】永久VIP题库';
                }
                if (!isNull(localStorage.share_title)) {
                    share_title = localStorage.share_title;
                }
                share_title = check_replace_content(share_title);
                share_desc = share_desc;
                if (!isNull(localStorage.share_desc)) {
                    share_desc = localStorage.share_desc;
                }
                share_desc = check_replace_content(share_desc);
                // share_url = share_url;
                share_url = base_url + '&module=v4';
                if (!isNull(localStorage.share_url)) {
                    share_url = localStorage.share_url;
                }
                share_img = safe_domain + '/static/images/logow.png';
                if (!isNull(localStorage.img_url)) {
                    share_img = localStorage.img_url;
                }
                // if (!isNull(activityInfo)) {
                //     share_title = activityInfo.share_title.replace(/\{原标题\}/g, share_title);
                //     // share_img = activityInfo.share_img;
                // }
            }
            if (event == 'shop') {
                share_title = '易哈佛商城';
                share_desc = '考点、小抄、押密、题库、视频，各类考试产品，全方位提供考试服务，助您轻松过考。';
                share_url = base_url + '&module=shop';
                share_img = safe_domain + '/static/images/shop/logow.png';
                var title = share_title;
                if (!isNull(localStorage.share_title)) {
                    share_title = localStorage.share_title;
                }
                share_desc = share_desc;
                if (!isNull(localStorage.share_desc)) {
                    share_desc = localStorage.share_desc;
                }
                share_url = share_url;
                if (!isNull(localStorage.share_url)) {
                    share_url = localStorage.share_url;
                }
                share_img = share_img;
                if (!isNull(localStorage.img_url)) {
                    share_img = localStorage.img_url;
                }
                var hu = ['14', '390', '391'];
                var yao = ['13', '385', '386'];
                var yi = ['2', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
                //if (isInArray(hu, localStorage.pid)) {
                //    share_img = safe_domain + '/static/images/shop_hu.png';
                //} else if (isInArray(yao, localStorage.pid)) {
                //    share_img = safe_domain + '/static/images/shop_yao.png';
                //} else if (isInArray(yi, localStorage.pid)) {
                //    share_img = safe_domain + '/static/images/shop_yi.png';
                //}
                // if (!isNull(activityInfo)) {
                //     share_title = activityInfo.share_title.replace(/\{原标题\}/g, share_title);
                //     // share_img = activityInfo.share_img;
                // }
            }
            // cancel_share_data();
            localStorage.removeItem('share_title');
            localStorage.removeItem('img_url');
            localStorage.removeItem('share_url');
            localStorage.removeItem('share_desc');
            sessionStorage.removeItem('ask_friend');
            var title = share_title,
                desc = share_desc,
                link = share_url,
                imgUrl = share_img;
            if (isNull(event)) {
                if (!isNull(localStorage.share_title) && event != 'partjob') {
                    title = localStorage.share_title;
                }
                if (!isNull(localStorage.share_desc) && event != 'partjob') {
                    desc = localStorage.share_desc;
                }
                if (!isNull(localStorage.share_url) && event != 'partjob') {
                    link = localStorage.share_url;
                }
                if (!isNull(localStorage.img_url) && event != 'partjob') {
                    imgUrl = localStorage.img_url;
                }
            }

            // 分享给朋友
            wx.onMenuShareAppMessage({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    YDUI.dialog.toast('分享成功', 'none', 2000);
                    if (event == 'v4') {

                        share_success_manage('wechat');
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '成功',
                            '渠道': '微信好友',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                            if (pagenow == 'exam_info') {
                                Jump_Page('#/exam/pay');
                                localStorage.exam_is_share = 1;
                            }
                        } else if (event == 'shop') {
                            $('.theme-popover').hide();
                            $('.theme-popover-mask').hide();
                            $('.pop.subject').hide();
                            jqrequest({
                                noretryMessage: true,  // 不显示重试弹框
                                method: 'GET',  // 请求方法
                                url: api_domain + '/other.php?ac=share_statistics&model=shop&channel=friend',  //  请求 url
                                data: {},
                                dataType: 'json' // 返回的数据类型
                            }).then(function(ret) {
                                // TODO 请求成功后，返回的数据 ret
                            });
                            // $.get(api_domain + '/other.php?ac=share_statistics&model=shop&channel=friend');
                            shop_incuSTProj.track('分享', {
                                '状态': '成功',
                                '渠道': '微信好友',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                            if (window.isbuy == true) {
                                window.isbuy = false;
                                var shareBuySuccess = function() {
                                    return jqrequest({
                                                method: 'GET',  // 请求方法
                                                url: api_domain + '/goods.php?ac=share_price&id=' + localStorage.shop_goodsid,  //  请求 url
                                                data: {},
                                                dataType: 'json' // 返回的数据类型
                                            }).then(function(ret) {
                                                // 自动跳转成功，隐藏提示框并跳转
                                                Router.replace(localStorage.share_next_url + '/isshare-1', true, true);
                                                localStorage.removeItem('share_next_url');
                                            });
                                    // return $.get(api_domain + '/goods.php?ac=share_price&id=' + localStorage.shop_goodsid).done(function() {
                                    //     // 自动跳转成功，隐藏提示框并跳转
                                    //     Router.replace(localStorage.share_next_url + '/isshare-1', true, true);
                                    //     localStorage.removeItem('share_next_url');
                                    // });
                                };
                                invokeCounter(null, shareBuySuccess, 3, function() {
                                    YDUI.dialog.alert('分享成功，点击确定进入下一页', function() {
                                        // 自动跳转成功，隐藏提示框并跳转
                                        Router.replace(localStorage.share_next_url + '/isshare-1', true, true);
                                        localStorage.removeItem('share_next_url');
                                    });
                                });
                                // return false;
                            }
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            if (!isNull(localStorage.exam_share_type) && localStorage.exam_share_type == 'share_buy') {
                                localStorage.exam_is_share = 1;
                                localStorage.removeItem('exam_share_type');
                                setTimeout(function() {
                                    Router.replace('#/exam/pay', true, true);
                                }, 250);
                            } else if (!isNull(localStorage.exam_share_type) && localStorage.exam_share_type == 'share_free') {
                                var examAddFreeTrade = function() {
                                    var source = ua() == 'wx' ? '微信试卷' : 'APP试卷';
                                    var param = {
                                        sessionid: localStorage.sessionid,
                                        shop_id: localStorage.exam_shop_id,
                                        total_price: 0,
                                        pkgname: pkgname,
                                        saler: 0,
                                        source: source,
                                        is_share: 1,
                                        channel: '分享免费'
                                    };
                                    return jqrequest({
                                                method: 'POST',  // 请求方法
                                                url: api_domain + '/phalapi/public/?service=Paper.Index.examAddFreeTrade',  //  请求 url
                                                data: param,
                                                dataType: 'json' // 返回的数据类型
                                            }).then(function(ret) {
                                                if (ret.code == 0) {
                                                    localStorage.removeItem('exam_is_share');
                                                }
                                            });
                                    // return $.post(api_domain + '/phalapi/public/?service=Paper.Index.examAddFreeTrade', param, function(ret) {
                                    //     if (ret.code == 0) {
                                    //         localStorage.removeItem('exam_is_share');
                                    //     }
                                    // }, 'json');
                                };
                                localStorage.removeItem('exam_share_type');
                                $('#exam_exam [data-shop_id="' + localStorage.exam_shop_id + '"]').find('.free_btn').removeClass('free_btn btn-warning').addClass('go_btn btn-primary').text('开始考试');
                                $('#exam_exam [data-shop_id="' + localStorage.exam_shop_id + '"]').find('.price').remove();
                                $('#exam_exam').find('.free_btn').removeClass('free_btn').addClass('share_btn').text('立即获取');
                                $('#exam_exam').find('.share_price').removeClass('none');
                                $('#exam_exam').find('.original_name').addClass('none');
                                invokeCounter('创建订单失败', examAddFreeTrade, 3);
                            } else {
                                YDUI.dialog.toast('分享成功', 'none', 2000);
                                return false;
                            }
                        }
                        cancel_share_data();
                    }
                },
                cancel: function() {
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '取消',
                            '渠道': '微信好友',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            localStorage.removeItem('exam_share_type');
                        } else if (event == 'shop') {
                            YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                            shop_incuSTProj.track('分享', {
                                '状态': '取消',
                                '渠道': '微信好友',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                            return false;
                        }
                    }
                },
                fail: function() {
                    YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        v4_incuSTProj.track('分享', {
                            '状态': '失败',
                            '渠道': '微信好友',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            localStorage.removeItem('exam_share_type');
                        } else if (event == 'shop') {
                            YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                            shop_incuSTProj.track('分享', {
                                '状态': '失败',
                                '渠道': '微信好友',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                            return false;
                        }
                    }
                }
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: title,
                link: link,
                desc: desc,
                imgUrl: imgUrl,
                success: function() {
                    YDUI.dialog.toast('分享成功', 'none', 2000);
                    if (event == 'v4') {
                        share_success_manage('timeline');
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '成功',
                            '渠道': '朋友圈',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                            if (pagenow == 'exam_info') {
                                Jump_Page('#/exam/pay');
                                localStorage.exam_is_share = 1;
                            }
                        } else if (event == 'shop') {
                            $('.theme-popover').hide();
                            $('.theme-popover-mask').hide();
                            $('.pop.subject').hide();
                            shop_incuSTProj.track('分享', {
                                '状态': '成功',
                                '渠道': '朋友圈',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                            jqrequest({
                                noretryMessage: true,  // 不显示重试弹框
                                method: 'GET',  // 请求方法
                                url: api_domain + '/other.php?ac=share_statistics&model=shop&channel=timeline',  //  请求 url
                                data: {},
                                dataType: 'json' // 返回的数据类型
                            }).then(function(ret) {
                                // TODO 请求成功后，返回的数据 ret
                            });
                            // $.get(api_domain + '/other.php?ac=share_statistics&model=shop&channel=timeline');
                            if (window.isbuy == true) {
                                window.isbuy = false;
                                var shareBuySuccess = function() {
                                    return jqrequest({
                                                method: 'GET',  // 请求方法
                                                url: api_domain + '/goods.php?ac=share_price&id=' + localStorage.shop_goodsid,  //  请求 url
                                                data: {},
                                                dataType: 'json' // 返回的数据类型
                                            }).then(function(ret) {
                                                // 自动跳转成功，隐藏提示框并跳转
                                                Router.replace(localStorage.share_next_url + '/isshare-1', true, true);
                                                localStorage.removeItem('share_next_url');
                                            });
                                    // return $.get(api_domain + '/goods.php?ac=share_price&id=' + localStorage.shop_goodsid).done(function() {
                                    //     // 自动跳转成功，隐藏提示框并跳转
                                    //     Router.replace(localStorage.share_next_url + '/isshare-1', true, true);
                                    //     localStorage.removeItem('share_next_url');
                                    // });
                                };
                                invokeCounter(null, shareBuySuccess, 3, function() {
                                    YDUI.dialog.alert('分享成功，点击确定进入下一页', function() {
                                        // 自动跳转成功，隐藏提示框并跳转
                                        Router.replace(localStorage.share_next_url + '/isshare-1', true, true);
                                        localStorage.removeItem('share_next_url');
                                    });
                                });
                                // return false;
                            }


                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            if (!isNull(localStorage.exam_share_type) && localStorage.exam_share_type == 'share_buy') {
                                localStorage.exam_is_share = 1;
                                localStorage.removeItem('exam_share_type');
                                setTimeout(function() {
                                    Router.replace('#/exam/pay', true, true);
                                }, 250);
                            } else if (!isNull(localStorage.exam_share_type) && localStorage.exam_share_type == 'share_free') {
                                var examAddFreeTrade = function() {
                                    var source = ua() == 'wx' ? '微信试卷' : 'APP试卷';
                                    var param = {
                                        sessionid: localStorage.sessionid,
                                        shop_id: localStorage.exam_shop_id,
                                        total_price: 0,
                                        pkgname: pkgname,
                                        saler: 0,
                                        source: source,
                                        is_share: 1,
                                        channel: '分享免费'
                                    };
                                    return jqrequest({
                                                method: 'POST',  // 请求方法
                                                url: api_domain + '/phalapi/public/?service=Paper.Index.examAddFreeTrade',  //  请求 url
                                                data: param,
                                                dataType: 'json' // 返回的数据类型
                                            }).then(function(ret) {
                                                if (ret.code == 0) {
                                                    localStorage.removeItem('exam_is_share');
                                                }
                                            });
                                    // return $.post(api_domain + '/phalapi/public/?service=Paper.Index.examAddFreeTrade', param, function(ret) {
                                    //     if (ret.code == 0) {
                                    //         localStorage.removeItem('exam_is_share');
                                    //     }
                                    // }, 'json');
                                };
                                localStorage.removeItem('exam_share_type');
                                $('#exam_exam [data-shop_id="' + localStorage.exam_shop_id + '"]').find('.free_btn').removeClass('free_btn btn-warning').addClass('go_btn btn-primary').text('开始考试');
                                $('#exam_exam [data-shop_id="' + localStorage.exam_shop_id + '"]').find('.price').remove();
                                $('#exam_exam').find('.free_btn').removeClass('free_btn').addClass('share_btn').text('去分享');
                                $('#exam_exam').find('.share_price').removeClass('none');
                                $('#exam_exam').find('.original_name').addClass('none');
                                invokeCounter('创建订单失败', examAddFreeTrade, 3);
                            }
                        }
                        cancel_share_data();
                    }
                },
                cancel: function() {
                    if (event == 'v4') {
                        $('.mask_transition,.hide-mask').click();
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '取消',
                            '渠道': '朋友圈',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            localStorage.removeItem('exam_share_type');
                        } else if (event == 'shop') {
                            YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                            shop_incuSTProj.track('分享', {
                                '状态': '取消',
                                '渠道': '朋友圈',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                        }
                    }
                },
                fail: function() {
                    YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        v4_incuSTProj.track('分享', {
                            '状态': '失败',
                            '渠道': '朋友圈',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            localStorage.removeItem('exam_share_type');
                        } else if (event == 'shop') {
                            YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                            shop_incuSTProj.track('分享', {
                                '状态': '失败',
                                '渠道': '朋友圈',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                        }
                    }
                }
            });
            // 分享到QQ
            wx.onMenuShareQQ({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    YDUI.dialog.toast('分享成功', 'none', 2000);
                    if (event == 'v4') {
                        share_success_manage('qq');
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '成功',
                            '渠道': 'QQ',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                            $('#exam_result .subject.pop').hide();
                            localStorage.removeItem('exam_share_type');
                        } else if (event == 'shop') {
                            YDUI.dialog.toast('分享成功', 'none', 2000);
                            shop_incuSTProj.track('分享', {
                                '状态': '成功',
                                '渠道': 'QQ',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                        }
                        cancel_share_data();
                    }
                },
                cancel: function() {
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '取消',
                            '渠道': 'QQ',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else if (event == 'exam_free') {
                        $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                        $('#exam_result .subject.pop').hide();
                        localStorage.removeItem('exam_share_type');
                    } else if (event == 'shop') {
                        $('.mask_transition,.hide-mask').click();
                        YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                        shop_incuSTProj.track('分享', {
                            '状态': '取消',
                            '渠道': 'QQ',
                            '标签': '商城',
                            'unionid': localStorage.wx_uid
                        });
                    }
                },
                fail: function() {
                    $('#index .mask_transition,.hide-mask').click();
                    YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        v4_incuSTProj.track('分享', {
                            '状态': '失败',
                            '渠道': 'QQ',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else if (event == 'exam_free') {
                        $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                        $('#exam_result .subject.pop').hide();
                        localStorage.removeItem('exam_share_type');
                    } else if (event == 'shop') {
                        $('.mask_transition,.hide-mask').click();
                        YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                        shop_incuSTProj.track('分享', {
                            '状态': '失败',
                            '渠道': 'QQ',
                            '标签': '商城',
                            'unionid': localStorage.wx_uid
                        });
                    }
                }
            });
            wx.onMenuShareQZone({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    YDUI.dialog.toast('分享成功', 'none', 2000);
                    if (event == 'v4') {
                        share_success_manage('qzone');
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '成功',
                            '渠道': 'QZone',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else {
                        if (event == 'exam') {
                            $('.exam_page .pop').hide();
                        } else if (event == 'exam_free') {
                            $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                        } else if (event == 'shop') {
                            YDUI.dialog.toast('分享成功', 'none', 2000);
                            shop_incuSTProj.track('分享', {
                                '状态': '成功',
                                '渠道': 'QZone',
                                '标签': '商城',
                                'unionid': localStorage.wx_uid
                            });
                        }
                        cancel_share_data();
                    }
                },
                cancel: function() {
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        localStorage.removeItem('share_type');
                        v4_incuSTProj.track('分享', {
                            '状态': '取消',
                            '渠道': 'QZone',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else if (event == 'exam_free') {
                        $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                        $('#exam_result .subject.pop').hide();
                        localStorage.removeItem('exam_share_type');
                    } else if (shop == 'shop') {
                        YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                        shop_incuSTProj.track('分享', {
                            '状态': '取消',
                            '渠道': 'QZone',
                            '标签': '商城',
                            'unionid': localStorage.wx_uid
                        });
                    }
                },
                fail: function() {
                    YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                    if (event == 'v4') {
                        $(' .mask_transition,.hide-mask').click();
                        v4_incuSTProj.track('分享', {
                            '状态': '失败',
                            '渠道': 'QZone',
                            '标签': '题库',
                            'unionid': localStorage.wx_uid
                        });
                    } else if (event == 'exam_free') {
                        $('#exam_exam .share-box1,#exam_exam .share-box2,#exam_exam .share-box4,#exam_exam .mask').hide();
                        $('#exam_result .subject.pop').hide();
                        localStorage.removeItem('exam_share_type');
                    } else if (shop == 'shop') {
                        YDUI.dialog.toast('分享失败，请重新尝试', 'none', 2000);
                        shop_incuSTProj.track('分享', {
                            '状态': '失败',
                            '渠道': 'QZone',
                            '标签': '商城',
                            'unionid': localStorage.wx_uid
                        });
                    }
                }
            });
        });
    }
}
//分享完成后,清除分享数据
function cancel_share_data() {
    localStorage.removeItem('share_title');
    localStorage.removeItem('share_type');
    localStorage.removeItem('img_url');
    localStorage.removeItem('share_url');
    localStorage.removeItem('share_desc');
}
//存删缓存的答案信息
function save_delete_answer_temp(qid, answer, temp_type_name) {
    var answer_temp = JSON.parse(localStorage.getItem(temp_type_name));
    if (isNull(answer_temp)) {
        var answer_temp = new Array();
        answer_temp[0] = {
            qid: qid,
            answer: answer
        };
    } else {
        var key = false;
        for (var i in answer_temp) {
            if (answer_temp[i]['qid'] == qid) {
                key = i;
            }
        }
        if (key === false) {
            answer_temp[answer_temp.length] = {
                qid: qid,
                answer: answer
            };
        } else {
            answer_temp[key] = {
                qid: qid,
                answer: answer
            };
        }
        if (answer_temp.length > 5) {
            answer_temp.splice(0, 1);
        }
    }
    localStorage.setItem(temp_type_name, JSON.stringify(answer_temp));
}
// 点击跳转页面
function Jump_Page(url, judge) {
    Router.replace(url, true, true);
}

function openUrl(url, title) {
    if (ua() == 'wx') {
        location.href = url;
    } else {
        title = title || '易哈佛考试';
        if (url.indexOf('?') > -1) {
            url = url + '&sessionid=' + localStorage.sessionid;
        } else {
            url = url + '?sessionid=' + localStorage.sessionid;
        }
        openWebView(url, title);
    }
}
function openNoteUrl() {
    // if (ua() == 'wx') {
    jqrequest({
        method: 'POST',  // 请求方法
        url: api_domain + '/tiku/daydayup.php?ac=get_ziliao_cid',  //  请求 url
        data: { // post 发送的数据
            cid: localStorage.day_cid
        },
        dataType: 'json' // 返回的数据类型
    }).then(function(ret) {
        if (ret.code == 0) {
            Router.replace('#/ziliao/index/cid-' + localStorage.day_cid, true, true);
            // location.href = domain + '/ziliao-index-' + ord + '.html#/ziliao/index/cid-' + localStorage.day_cid;
        } else {
            var jump_cid = '';
            if (localStorage.exam_name.indexOf('主治医师') > -1) {
                jump_cid = 114;
            } else {
                var param = {
                    123: 120,
                    370: 120,
                    181: 109,
                    362: 109,
                    121: 122,
                    363: 122,
                    116: 115,
                    368: 115,
                    110: 180,
                    366: 180,
                    360: '',
                    369: 120,
                    361: 109,
                    364: 122,
                    367: 115,
                    365: 180
                };
                jump_cid = param[localStorage.day_cid];
            }
            if (isNull(jump_cid)) {
                Router.replace('#/ziliao/index', true, true);
                // location.href = domain + '/ziliao-index-' + ord + '.html#/ziliao/index';
            } else {
                Router.replace('#/ziliao/index/cid-' + jump_cid, true, true);
                // location.href = domain + '/ziliao-index-' + ord + '.html#/ziliao/index/cid-' + jump_cid;
            }
        }
    });
    // $.post(api_domain + '/tiku/daydayup.php?ac=get_ziliao_cid', {
    //     cid: localStorage.day_cid
    // }, function(ret) {
    //     if (ret.code == 0) {
    //         Router.replace('#/ziliao/index/cid-' + localStorage.day_cid, true, true);
    //         // location.href = domain + '/ziliao-index-' + ord + '.html#/ziliao/index/cid-' + localStorage.day_cid;
    //     } else {
    //         var jump_cid = '';
    //         if (localStorage.exam_name.indexOf('主治医师') > -1) {
    //             jump_cid = 114;
    //         } else {
    //             var param = {
    //                 123: 120,
    //                 370: 120,
    //                 181: 109,
    //                 362: 109,
    //                 121: 122,
    //                 363: 122,
    //                 116: 115,
    //                 368: 115,
    //                 110: 180,
    //                 366: 180,
    //                 360: '',
    //                 369: 120,
    //                 361: 109,
    //                 364: 122,
    //                 367: 115,
    //                 365: 180
    //             };
    //             jump_cid = param[localStorage.day_cid];
    //         }
    //         if (isNull(jump_cid)) {
    //             Router.replace('#/ziliao/index', true, true);
    //             // location.href = domain + '/ziliao-index-' + ord + '.html#/ziliao/index';
    //         } else {
    //             Router.replace('#/ziliao/index/cid-' + jump_cid, true, true);
    //             // location.href = domain + '/ziliao-index-' + ord + '.html#/ziliao/index/cid-' + jump_cid;
    //         }
    //     }
    // }, 'json');
    // } else {
    //     var token = localStorage.token;
    //     var urlschemes = localStorage.token;
    //     if (token == 'hu') {
    //         token = 'hushi';
    //         urlschemes = 'hushi';
    //     } else if (token == 'account') {
    //         token = 'kuaiji';
    //         urlschemes = 'kuaiji';
    //     } else if (token == 'engineering') {
    //         urlschemes = 'nengineering';
    //     }
    //     var pname = 'app.note.' + token;
    //     var url = 'ehf' + urlschemes + 'note://';
    //     openApp(pname, url);
    // }
}
// 解析Hash参数
function decodeHash(hash) {
    if (isNull(hash)) return {};
    var arr = hash.replace('#', '').split('/');
    var parm = {};
    for (var i in arr) {
        if (arr[i].indexOf('-') > 0) {
            var val = arr[i].split('-');
            parm[val[0]] = val[1];
        }
    }
    return parm;
}
// 修改网址hash并跳转
function changeURL(parm, value, clearParm) {
    var clearParm = clearParm | '';
    var hash = location.hash;
    var parms, parmsArr, isExist;
    isExist = false;
    var hash_arr = hash.split('?');
    var next_url = hash_arr[0] + '?';
    hash = hash_arr[1];
    if (!isNull(hash)) {
        var i;
        parmsArr = hash.replace('#', '').split('&');
        for (i = 0; i <= parmsArr.length - 1; i++) {
            if (parm == parmsArr[i].split('=')[0]) { //原来有参数Parm则改变其值
                parmsArr[i] = parm + '=' + value;
                isExist = true;
                if (String(clearParm) == '') {
                    break;
                } else if (String(clearParm) != '' && clearParm == parmsArr[i].split('=')[0]) { //去掉参数clearParm的值
                    parmsArr[i] = clearParm + '=';
                }
            }
        }
        for (i = 0; i <= parmsArr.length - 1; i++) {
            if (i == 0) {
                parms = parmsArr[i];
            } else {
                parms = parms + '&' + parmsArr[i];
            }
        }
        next_url = next_url + parms;
        if (!isExist) {
            next_url = next_url + '&' + parm + '=' + value;
        }
    } else {
        next_url = next_url + parm + '=' + value;
    }
    return next_url;
}
//获取任意位数的随机数
function get_random_num(min, max) {
    var range = max - min;
    var rand = Math.random();
    return (min + Math.round(rand * range));
}
//商城底栏公共处理方法
function footer_manage(now_webpage, url_data) {
    //处理url地址
    var hash_arr = now_webpage.split('/');
    now_webpage = hash_arr[2];
    var url_string = '/';
    // if (!isNull(url_data['saler']) && url_data['saler'] > 0) {
    //     url_string += 'saler=' + url_data['saler'] + '&';
    // }

    if (!isNull(url_data['channelid']) && url_data['channelid'] > 0) {
        url_string += 'channelid-' + url_data['channelid'] + '/';
    }
    var shop_url = url_string;
    var order_url = url_string;
    shop_url += 'isall-1/model-0/';
    if (!isNull(url_data['model'])) {
        order_url += 'model-' + url_data['model'] + '/';
    }
    if (!isNull(url_data['cid']) && url_data['cid'] > 0) {
        shop_url += 'cid-' + url_data['cid'] + '/';
    }

    $('.shop_index_url').attr('data-target', '#/shop/index' + shop_url.substring(0, shop_url.length - 1));
    $('.shop_myinfo_url').attr('data-target', '#/shop/order' + order_url.substring(0, order_url.length - 1));
    //商城按钮
    if (now_webpage.indexOf('contact') < 0 && now_webpage.indexOf('help') < 0 && now_webpage.indexOf('order') < 0 && now_webpage.indexOf('orderinfo') < 0) {
        $('.shop_index_url').addClass('act');
    } else {
        $('.shop_index_url').removeClass('act');
    }
    if (isNull(localStorage.backLoginUrl)) {
        localStorage.backLoginUrl = '';
    }

    //订单按钮
    if (now_webpage.indexOf('order') >= 0 || now_webpage.indexOf('orderinfo') >= 0) {
        $('.shop_myinfo_url').addClass('act');
    } else {
        $('.shop_myinfo_url').removeClass('act');
    }
    //购买按钮
    if ((now_webpage.indexOf('goods') >= 0 || (now_webpage.indexOf('videos') >= 0 && url_data['sub_goods'] == true)) && localStorage.backLoginUrl.indexOf('order') < 0) {
        //$('#goods .btn_show').removeClass('none');
    } else {
        $('#shop_goods .btn_show').addClass('none');
    }
}
/**
 *商城url跳转
 * @param url_data url参数
 * @param next_url 下次跳转地址
 * @param is_param  url上是否已经有参数
 * @returns {*}
 */
function set_global_param(url_data, next_url, is_param) {
    //处理url地址
    var url_string = '';
    if (!isNull(url_data['channelid']) && url_data['channelid'] > 0) {
        url_string += 'channelid-' + url_data['channelid'] + '/';
    }

    // if (!isNull(url_data['saler']) && url_data['saler'] > 0) {
    //     url_string += 'saler-' + url_data['saler'] + '/';
    // }
    if (!isNull(url_string)) {
        url_string = url_string.substring(0, url_string.length - 1)
        if (is_param == 1) {
            var _href = next_url + '/' + url_string;
            Router.replace(_href, true, false);
        } else {
            var _href = next_url + '/' + url_string;

            Router.replace(_href, true, false);

        }
    } else {
        if (next_url.indexOf('/shop/index') > 0) {
            Router.replaceAs(next_url, false);
        } else {
            Router.replace(next_url, true, false);
        }
    }

}

function user_login() {
    var callback = api_domain + '/tiku/wx_callback.php';
    var referer = domain + '/main.php';
    var login_url = api_domain + '/login_v3.php?loginsys=wx&scope=userinfo&referer=' + referer + '&callback=' + callback + '&sessionid=' + localStorage.sessionid;
    localStorage.loginEntryURL = location.hash;
    window.location.href = login_url;
    return false;
}
/*
 * 处理过长的字符串，截取并添加省略号
 * 注：半角长度为1，全角长度为2
 *
 * pStr:字符串
 * pLen:截取长度
 *
 * return: 截取后的字符串
 */
function autoAddEllipsis(pStr, pLen) {
    var _ret = cutString(pStr, pLen);
    var _cutFlag = _ret.cutflag;
    var _cutStringn = _ret.cutstring;
    if ("1" == _cutFlag) {
        return _cutStringn + "...";
    } else {
        return _cutStringn;
    }
}
/*
 * 取得指定长度的字符串
 * 注：半角长度为1，全角长度为2
 *
 * pStr:字符串
 * pLen:截取长度
 *
 * return: 截取后的字符串
 */
function cutString(pStr, pLen) {
    // 原字符串长度
    var _strLen = pStr.length;
    var _tmpCode;
    var _cutString;
    // 默认情况下，返回的字符串是原字符串的一部分
    var _cutFlag = "1";
    var _lenCount = 0;
    var _ret = false;
    if (_strLen <= pLen / 2) {
        _cutString = pStr;
        _ret = true;
    }
    if (!_ret) {
        for (var i = 0; i < _strLen; i++) {
            if (isFull(pStr.charAt(i))) {
                _lenCount += 2;
            } else {
                _lenCount += 1;
            }
            if (_lenCount > pLen) {
                _cutString = pStr.substring(0, i);
                _ret = true;
                break;
            } else if (_lenCount == pLen) {
                _cutString = pStr.substring(0, i + 1);
                _ret = true;
                break;
            }
        }
    }
    if (!_ret) {
        _cutString = pStr;
        _ret = true;
    }
    if (_cutString.length == _strLen) {
        _cutFlag = "0";
    }
    return {
        "cutstring": _cutString,
        "cutflag": _cutFlag
    };
}
/*
 * 判断是否为全角
 *
 * pChar:长度为1的字符串
 * return: true:全角
 *          false:半角
 */
function isFull(pChar) {
    if (pChar.charCodeAt(0) > 128) {
        return true;
    } else {
        return false;
    }
}

function get_share_info(channel) {
    var param = {
        sessionid: localStorage.sessionid,
        cid: localStorage.day_cid
    };
    jqrequest({
        method: 'POST',  // 请求方法
        url: api_domain + '/phalapi/public/?service=App.Share.GetShareInfo',  //  请求 url
        data: param,
        dataType: 'json' // 返回的数据类型
    }).then(function(ret) {
        if (ret['ret'] == 0) {
            localStorage.share_title = ret.data.share_title;
            localStorage.share_desc = ret.data.share_desc;
            if (ret.data.pic_from == 2 && !isNull(localStorage.headimgurl)) {
                localStorage.img_url = localStorage.headimgurl;
            } else {
                if (!isNull(ret.data.share_pic)) {
                    localStorage.img_url = ret.data.share_pic;
                } else {
                    localStorage.img_url = domain + "/static/images/logow.png";
                }
            }
            localStorage.share_url = base_url + '&module=v4&cktag=mtah5_share.' + channel;
            // }
            if (ua() == 'wx') {
                var shareTarget = null;
                var shareContent = {
                    title: localStorage.share_title,
                    desc: localStorage.share_desc,
                    link: localStorage.share_url,
                    imgUrl: localStorage.img_url
                };
                // if (!isNull(activityInfo)) {
                //     shareContent.title = activityInfo.share_title.replace(/\{原标题\}/g, localStorage.share_title);
                //     // shareContent.imgUrl = activityInfo.share_img;
                // }
                wxbshare(shareTarget, shareContent, function(ret) {
                    v4_incuSTProj.track('积分任务', {
                        '任务类型': ret.toLowerCase(),
                        'unionid': localStorage.wx_uid
                    });
                    MtaH5.clickStat("taskshare")
                    MtaH5.clickShare(ret);
                    var param = {
                        sessionid: localStorage.sessionid
                    };
                    param.share_type = localStorage.share_type;
                    localStorage.removeItem('share_type');
                    localStorage.removeItem('share_title');
                    localStorage.removeItem('img_url');
                    localStorage.removeItem('share_url');
                    localStorage.removeItem('share_desc');
                    invokeCounter(false, function() {
                        return $.post(api_domain + '/tiku/user.php?ac=share_integral_task', param).done(function(ret) {
                            if (typeof ret === 'string') ret = JSON.parse(ret);
                            if (ret.code == 0) {
                                YDUI.dialog.toast(ret.msg, 'none', 2000);
                                userMedalStatistic('4', 0);
                                //积分任务页分享
                                $('#tiku_task .cell-item[data-share_type="' + channel + '"] .cell-right.green').text('完成');
                                $('#tiku_task .cell-item[data-share_type="' + channel + '"]').data('is_get', 1);
                                $('#tiku_task .my_integral').text(ret.integral);
                            } else {
                                YDUI.dialog.toast(ret.msg, 'none', 2000);
                            }
                            $('.mask_transition,.hide-mask').click();
                        });
                    });
                }, function(ret) {
                    YDUI.dialog.toast('分享失败！', 'none', 2000);
                    localStorage.removeItem('share_title');
                    localStorage.removeItem('img_url');
                    localStorage.removeItem('share_url');
                    localStorage.removeItem('share_desc');

                });

            } else {
                if (channel == 'other') {
                    // 点击送积分
                    YDUI.dialog.confirm('好评即送10积分', '只要你一个眼神肯定，我的爱就有意义^^<br>去应用商店给我们鼓励吧！', [{
                        txt: '必须给爱',
                        color: '#43a737',
                        callback: function() {
                            localStorage.share_other = 'other';
                            openMarket(function(e) {
                                // 获得积分失败弹窗
                                YDUI.dialog.confirm('好评失败？', '我们没有收到您的喜爱哎<br>再试一次呗', [{
                                    txt: '好的，再爱一次',
                                    color: '#43a737',
                                    callback: function() {
                                        openMarket();
                                    }
                                }]);
                            });
                        }
                    }]);
                } else if (channel == 'wechat' || channel == 'timeline') {
                    shareWeixinMessage(channel, '积分任务', 0, true);
                } else {
                    shareQQMessage(channel, '积分任务', true);
                }
            }
        }
    });
    // $.post(api_domain + '/phalapi/public/?service=App.Share.GetShareInfo', param, function(ret) {
    //     if (ret['ret'] == 0) {
    //         localStorage.share_title = ret.data.share_title;
    //         localStorage.share_desc = ret.data.share_desc;
    //         if (ret.data.pic_from == 2 && !isNull(localStorage.headimgurl)) {
    //             localStorage.img_url = localStorage.headimgurl;
    //         } else {
    //             if (!isNull(ret.data.share_pic)) {
    //                 localStorage.img_url = ret.data.share_pic;
    //             } else {
    //                 localStorage.img_url = domain + "/static/images/logow.png";
    //             }
    //         }
    //         localStorage.share_url = base_url + '&module=v4&cktag=mtah5_share.' + channel;
    //         // }
    //         if (ua() == 'wx') {
    //             var shareTarget = null;
    //             var shareContent = {
    //                 title: localStorage.share_title,
    //                 desc: localStorage.share_desc,
    //                 link: localStorage.share_url,
    //                 imgUrl: localStorage.img_url
    //             };
    //             // if (!isNull(activityInfo)) {
    //             //     shareContent.title = activityInfo.share_title.replace(/\{原标题\}/g, localStorage.share_title);
    //             //     // shareContent.imgUrl = activityInfo.share_img;
    //             // }
    //             wxbshare(shareTarget, shareContent, function(ret) {
    //                 v4_incuSTProj.track('积分任务', {
    //                     '任务类型': ret.toLowerCase(),
    //                     'unionid': localStorage.wx_uid
    //                 });
    //                 MtaH5.clickStat("taskshare")
    //                 MtaH5.clickShare(ret);
    //                 var param = {
    //                     sessionid: localStorage.sessionid
    //                 };
    //                 param.share_type = localStorage.share_type;
    //                 localStorage.removeItem('share_type');
    //                 localStorage.removeItem('share_title');
    //                 localStorage.removeItem('img_url');
    //                 localStorage.removeItem('share_url');
    //                 localStorage.removeItem('share_desc');
    //                 invokeCounter(false, function() {
    //                     return $.post(api_domain + '/tiku/user.php?ac=share_integral_task', param).done(function(ret) {
    //                         if (typeof ret === 'string') ret = JSON.parse(ret);
    //                         if (ret.code == 0) {
    //                             YDUI.dialog.toast(ret.msg, 'none', 2000);
    //                             userMedalStatistic('4', 0);
    //                             //积分任务页分享
    //                             $('#tiku_task .cell-item[data-share_type="' + channel + '"] .cell-right.green').text('完成');
    //                             $('#tiku_task .cell-item[data-share_type="' + channel + '"]').data('is_get', 1);
    //                             $('#tiku_task .my_integral').text(ret.integral);
    //                         } else {
    //                             YDUI.dialog.toast(ret.msg, 'none', 2000);
    //                         }
    //                         $('.mask_transition,.hide-mask').click();
    //                     });
    //                 });
    //             }, function(ret) {
    //                 YDUI.dialog.toast('分享失败！', 'none', 2000);
    //                 localStorage.removeItem('share_title');
    //                 localStorage.removeItem('img_url');
    //                 localStorage.removeItem('share_url');
    //                 localStorage.removeItem('share_desc');
    //
    //             });
    //
    //         } else {
    //             if (channel == 'other') {
    //                 // 点击送积分
    //                 YDUI.dialog.confirm('好评即送10积分', '只要你一个眼神肯定，我的爱就有意义^^<br>去应用商店给我们鼓励吧！', [{
    //                     txt: '必须给爱',
    //                     color: '#43a737',
    //                     callback: function() {
    //                         localStorage.share_other = 'other';
    //                         openMarket(function(e) {
    //                             // 获得积分失败弹窗
    //                             YDUI.dialog.confirm('好评失败？', '我们没有收到您的喜爱哎<br>再试一次呗', [{
    //                                 txt: '好的，再爱一次',
    //                                 color: '#43a737',
    //                                 callback: function() {
    //                                     openMarket();
    //                                 }
    //                             }]);
    //                         });
    //                     }
    //                 }]);
    //             } else if (channel == 'wechat' || channel == 'timeline') {
    //                 shareWeixinMessage(channel, '积分任务', 0, true);
    //             } else {
    //                 shareQQMessage(channel, '积分任务', true);
    //             }
    //         }
    //     }
    // }, 'json');
}

// 分享减价
function price_share() {
    if (ua() == 'wx') {
        wx.config(wxconfig);
        wx.ready(function() {
            var desc = localStorage.share_desc;
            var title = localStorage.share_title;
            var link = localStorage.share_url;
            var imgUrl = localStorage.img_url;
            localStorage.removeItem('share_title');
            localStorage.removeItem('img_url');
            localStorage.removeItem('share_url');
            localStorage.removeItem('share_desc');
            // 分享给朋友
            wx.onMenuShareAppMessage({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '成功',
                        '渠道': '微信好友',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                    localStorage.share_once = 1;
                    if ($('#tiku_buylist .buy-btn').attr('data-pay_price') <= 0) {
                        localStorage.total_price = 0;
                    } else {
                        localStorage.total_price = $('#tiku_buylist .buy-btn').attr('data-pay_price');
                    }
                    $('#tiku_buylist .mask,#tiku_buylist .share-box1').hide();
                    Jump_Page("#/v4/buy_pay");
                },
                cancel: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '取消',
                        '渠道': '微信好友',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                },
                fail: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '失败',
                        '渠道': '微信好友',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                }
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: title,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '成功',
                        '渠道': '朋友圈',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                    localStorage.share_once = 1;
                    if ($('#tiku_buylist .buy-btn').attr('data-pay_price') <= 0) {
                        localStorage.total_price = 0;
                    } else {
                        localStorage.total_price = $('#tiku_buylist .buy-btn').attr('data-pay_price');
                    }
                    $('#tiku_buylist .mask,#tiku_buylist .share-box1').hide();
                    Jump_Page("#/v4/buy_pay");
                },
                cancel: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '取消',
                        '渠道': '朋友圈',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                },
                fail: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '失败',
                        '渠道': '朋友圈',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                }
            });
            // 分享到QQ
            wx.onMenuShareQQ({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '成功',
                        '渠道': 'QQ',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                },
                cancel: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '取消',
                        '渠道': 'QQ',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                },
                fail: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '失败',
                        '渠道': 'QQ',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                }
            });
            wx.onMenuShareQZone({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '成功',
                        '渠道': 'QZone',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                },
                cancel: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '取消',
                        '渠道': 'QZone',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                },
                fail: function() {
                    v4_incuSTProj.track('分享', {
                        '状态': '失败',
                        '渠道': 'QZone',
                        '标签': '题库',
                        'unionid': localStorage.wx_uid
                    });
                }
            });
        });
    }
}
// 关键词是否存在数组中
function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

//查询分享替换
function check_replace_content(content) {
    content = content.replace('[考试名称]', localStorage.exam_name);
    content = content.replace('[年份]', localStorage.tiku_year);
    return content;
}

/**
 * 处理用户分享成功后操作
 * @param share_way   分享方式
 */
function share_success_manage(share_way) {
    var param = {
        sessionid: localStorage.sessionid
    };
    var api_url = "";
    var share_type = localStorage.share_type;
    if (share_type == 'unlock' && share_way == 'timeline') {
        api_url = api_domain + '/tiku/daydayup.php?ac=unlock_user_exam';
        param.cid = localStorage.day_cid;
    } else if (share_type == 'login_share' && share_way == 'timeline') {
        api_url = api_domain + '/tiku/user.php?ac=share_award_integral';
    } else if (share_type == 'result_share' && share_way == 'timeline') {
        api_url = api_domain + '/tiku/user.php?ac=share_award_integral';
    } else if (share_type == share_way) {
        api_url = api_domain + '/tiku/user.php?ac=share_integral_task';
    }
    param.share_type = share_type;
    if (!isNull(api_url)) { //需要请求接口处理
        invokeCounter(false, function() {
            return $.post(api_url, param).done(function(ret) {
                if (typeof ret === 'string') ret = JSON.parse(ret);
                exam_share('v4');
                if (ret.code == 0) {
                    if (share_type == 'result_share') {
                        YDUI.dialog.toast(ret.msg, 'none', 2000);
                        //每日一练结果页分享
                        $('#tiku_day_result .share-btn span').remove();
                        var result_data = JSON.parse(localStorage.getItem("result_data"));
                        result_data.is_get = 1;
                        localStorage.setItem("result_data", JSON.stringify(result_data));
                    } else if (share_type == share_way) {
                        YDUI.dialog.toast(ret.msg, 'none', 2000);
                        //积分任务页分享
                        $('#tiku_task .cell-item[data-share_type="' + share_type + '"] .cell-right.green').text('完成');
                        $('#tiku_task .cell-item[data-share_type="' + share_type + '"]').data('is_get', 1);
                        $('#tiku_task .my_integral').text(ret.integral);
                        var _share_type = share_way;
                        if (_share_type == 'wechat') {
                            _share_type = 'friend';
                        }
                        userMedalStatistic('4', 0);
                        v4_incuSTProj.track('积分任务', {
                            'unionid': localStorage.wx_uid,
                            '任务类型': _share_type
                        });
                    } else {
                        if (share_type == 'unlock') {
                            //考试解锁跳转做题页
                            //location.href = '#/v4/day_question';
                            Jump_Page('#/v4/tiku_day_question');
                            YDUI.dialog.toast(ret.msg, 'none', 2000);
                            return false;
                        }
                        Jump_Page('#/v4/tiku_index');
                        //location.href = '#/v4/index';
                        YDUI.dialog.toast(ret.msg, 'none', 2000);
                    }
                } else {
                    YDUI.dialog.toast(ret.msg, 'none', 2000);
                }
                $('.mask_transition,.hide-mask').click();
            });
        });
    } else { //关闭遮罩层，提示分享成功
        $('#tiku_index .mask_transition,.hide-mask').click();
        if (share_type == 'unlock') {
            YDUI.dialog.toast('请分享到朋友圈解锁', 'none', 2000);
        } else {
            exam_share('v4');
            YDUI.dialog.toast('分享成功', 'none', 2000);
        }
    }
}

//app题库分享成功后操作
function app_tiku_share_success() {
    var param = {
        sessionid: localStorage.sessionid,
        cid: localStorage.day_cid,
        total_price: $('#tiku_buyinfo .btn_buy').attr('data-pay_price'),
        goods_subject: 'all',
        integral_type: $('#tiku_buyinfo .integral_module input').data('type'),
        balance_type: $('#tiku_buyinfo .balance_module input').data('type'),
        coupon_type: $('#tiku_buyinfo .track_module input').data('type')
    };
    jqrequest({
        method: 'POST',  // 请求方法
        url: api_domain + '/tiku/pay.php?ac=total_fee_compute',  //  请求 url
        data: param,
        dataType: 'json' // 返回的数据类型
    }).then(function(ret) {
        if (ret.code == 0) {
            var order_info = ret.order_info;
            //积分
            if (!isNull(order_info.integral_module)) {
                $('#tiku_buyinfo .integral_module').removeClass('none');
                $('#tiku_buyinfo .integral_price').text(order_info.integral_module.integral_price + '元');
                $('#tiku_buyinfo .integral_module input').data('price', order_info.integral_module.integral_price);
                $('#tiku_buyinfo .integral_module input').data('use_integral', order_info.integral_module.use_integral);
                $('#tiku_buyinfo .integral_module input').data('type', order_info.integral_module.type);
                $('#tiku_buyinfo .integral_text').text(order_info.integral_module.integral_text);
                if (order_info.integral_module.type == 1) {
                    $('#tiku_buyinfo .integral_module input').attr('checked', false);
                } else {
                    $('#tiku_buyinfo .integral_module input').attr('checked', true);
                }
            } else {
                $('#tiku_buyinfo .integral_module input').data('use_integral', 0);
                $('#tiku_buyinfo .integral_module').addClass('none');
                $('#tiku_buyinfo .integral_module input').data('type', 1);
            }

            //题库抵扣券
            if (!isNull(order_info.coupon_value)) {
                $('#tiku_buyinfo .track_module').removeClass('none');
                if (parseInt(order_info.coupon_min) > parseInt(order_info.total_price)) {
                    $('#tiku_buyinfo .track_module input').prop('checked', false);
                    $('#tiku_buyinfo .track_module input').attr('disabled', "disabled");
                    $('#tiku_buyinfo .track_module input').data('type', 1);
                } else {
                    $('#tiku_buyinfo .track_module input').prop('checked', true);
                    $('#tiku_buyinfo .track_module input').removeAttr("disabled");
                    if (order_info.coupon_type == 1) {
                        $('#tiku_buyinfo .track_module input').prop('checked', false);
                    } else {
                        $('#tiku_buyinfo .track_module input').prop('checked', true);
                    }
                    $('#tiku_buyinfo .track_module input').data('type', order_info.coupon_type);
                }
                $('#tiku_buyinfo .track_module input').data('price', order_info.coupon_value);
                $('#tiku_buyinfo .track_module input').data('coupon_id', order_info.coupon_id);
                $('#tiku_buyinfo .coupon_text').text(order_info.coupon_value + '元');
                $('#tiku_buyinfo .track_text').html("满" + order_info.coupon_min + '元可用');
            } else {
                $('#tiku_buyinfo .track_module input').data('price', 0);
                $('#tiku_buyinfo .track_module').addClass('none');
                $('#tiku_buyinfo .track_module input').data('type', 1);
            }

            //余额
            if (!isNull(order_info.use_amounts)) {
                $('#tiku_buyinfo .balance_module').removeClass('none');
                $('#tiku_buyinfo .balance_module input').data('price', order_info.balance_price);
                $('#tiku_buyinfo .balance_module input').data('type', order_info.balance_type);
                $('#tiku_buyinfo .use_amount').text(order_info.balance_price + '元');
                if (order_info.balance_type == 1) {
                    $('#tiku_buyinfo .balance_module input').attr('checked', false);
                } else {
                    $('#tiku_buyinfo .balance_module input').attr('checked', true);
                }
            } else {
                $('#tiku_buyinfo .balance_module input').data('price', 0);
                $('#tiku_buyinfo .balance_module').addClass('none');
                $('#tiku_buyinfo .balance_module input').data('type', 1);
            }

            //如果没有优惠信息，去除分割线
            if (isNull(order_info.ticket_module) && isNull(order_info.integral_module) && isNull(order_info.use_amounts) && isNull(order_info.coupon_value)) {
                $('#tiku_buyinfo .m-cell.sale').addClass('none');
            } else {
                $('#tiku_buyinfo .m-cell.sale').removeClass('none');
            }

            //支付方式-如果是微信公众号，隐藏支付宝支付方式
            if (ua() == 'wx') {
                $('#tiku_buyinfo .apay_pay').addClass('none');
            } else {
                $('#tiku_buyinfo .apay_pay').removeClass('none');
            }
            //总计
            $('#tiku_buyinfo .btn_confirm_buy .count').text(order_info.order_price);
            $('#tiku_buyinfo .btn_confirm_buy').data('order_price', order_info.order_price);
        } else if (ret.code == 4001) {
            YDUI.dialog.toast(ret.msg, 'none', 2000);
            setTimeout(function() {
                if (ua() == 'wx') {
                    location.href = api_domain + '/login_v3.php?loginsys=wx&scope=userinfo&sessionid=' + localStorage.sessionid + '&callback=' + api_domain + '/tiku/wx_callback.php&referer=' + window.location.href;
                } else {
                    Jump_Page('#/v4/wxlogin', '1');
                }
                return false;
            }, 2000)
        } else if (ret.code == 4002) {
            YDUI.dialog.toast(ret.msg, 'none', 2000);
            setTimeout(function() {
                Jump_Page('#/v4/index');
                return false;
            }, 2000)
        }
    });
    // $.post(api_domain + '/tiku/pay.php?ac=total_fee_compute', param, function(ret) {
    //     if (ret.code == 0) {
    //         var order_info = ret.order_info;
    //         //积分
    //         if (!isNull(order_info.integral_module)) {
    //             $('#tiku_buyinfo .integral_module').removeClass('none');
    //             $('#tiku_buyinfo .integral_price').text(order_info.integral_module.integral_price + '元');
    //             $('#tiku_buyinfo .integral_module input').data('price', order_info.integral_module.integral_price);
    //             $('#tiku_buyinfo .integral_module input').data('use_integral', order_info.integral_module.use_integral);
    //             $('#tiku_buyinfo .integral_module input').data('type', order_info.integral_module.type);
    //             $('#tiku_buyinfo .integral_text').text(order_info.integral_module.integral_text);
    //             if (order_info.integral_module.type == 1) {
    //                 $('#tiku_buyinfo .integral_module input').attr('checked', false);
    //             } else {
    //                 $('#tiku_buyinfo .integral_module input').attr('checked', true);
    //             }
    //         } else {
    //             $('#tiku_buyinfo .integral_module input').data('use_integral', 0);
    //             $('#tiku_buyinfo .integral_module').addClass('none');
    //             $('#tiku_buyinfo .integral_module input').data('type', 1);
    //         }
    //
    //         //题库抵扣券
    //         if (!isNull(order_info.coupon_value)) {
    //             $('#tiku_buyinfo .track_module').removeClass('none');
    //             if (parseInt(order_info.coupon_min) > parseInt(order_info.total_price)) {
    //                 $('#tiku_buyinfo .track_module input').prop('checked', false);
    //                 $('#tiku_buyinfo .track_module input').attr('disabled', "disabled");
    //                 $('#tiku_buyinfo .track_module input').data('type', 1);
    //             } else {
    //                 $('#tiku_buyinfo .track_module input').prop('checked', true);
    //                 $('#tiku_buyinfo .track_module input').removeAttr("disabled");
    //                 if (order_info.coupon_type == 1) {
    //                     $('#tiku_buyinfo .track_module input').prop('checked', false);
    //                 } else {
    //                     $('#tiku_buyinfo .track_module input').prop('checked', true);
    //                 }
    //                 $('#tiku_buyinfo .track_module input').data('type', order_info.coupon_type);
    //             }
    //             $('#tiku_buyinfo .track_module input').data('price', order_info.coupon_value);
    //             $('#tiku_buyinfo .track_module input').data('coupon_id', order_info.coupon_id);
    //             $('#tiku_buyinfo .coupon_text').text(order_info.coupon_value + '元');
    //             $('#tiku_buyinfo .track_text').html("满" + order_info.coupon_min + '元可用');
    //         } else {
    //             $('#tiku_buyinfo .track_module input').data('price', 0);
    //             $('#tiku_buyinfo .track_module').addClass('none');
    //             $('#tiku_buyinfo .track_module input').data('type', 1);
    //         }
    //
    //         //余额
    //         if (!isNull(order_info.use_amounts)) {
    //             $('#tiku_buyinfo .balance_module').removeClass('none');
    //             $('#tiku_buyinfo .balance_module input').data('price', order_info.balance_price);
    //             $('#tiku_buyinfo .balance_module input').data('type', order_info.balance_type);
    //             $('#tiku_buyinfo .use_amount').text(order_info.balance_price + '元');
    //             if (order_info.balance_type == 1) {
    //                 $('#tiku_buyinfo .balance_module input').attr('checked', false);
    //             } else {
    //                 $('#tiku_buyinfo .balance_module input').attr('checked', true);
    //             }
    //         } else {
    //             $('#tiku_buyinfo .balance_module input').data('price', 0);
    //             $('#tiku_buyinfo .balance_module').addClass('none');
    //             $('#tiku_buyinfo .balance_module input').data('type', 1);
    //         }
    //
    //         //如果没有优惠信息，去除分割线
    //         if (isNull(order_info.ticket_module) && isNull(order_info.integral_module) && isNull(order_info.use_amounts) && isNull(order_info.coupon_value)) {
    //             $('#tiku_buyinfo .m-cell.sale').addClass('none');
    //         } else {
    //             $('#tiku_buyinfo .m-cell.sale').removeClass('none');
    //         }
    //
    //         //支付方式-如果是微信公众号，隐藏支付宝支付方式
    //         if (ua() == 'wx') {
    //             $('#tiku_buyinfo .apay_pay').addClass('none');
    //         } else {
    //             $('#tiku_buyinfo .apay_pay').removeClass('none');
    //         }
    //         //总计
    //         $('#tiku_buyinfo .btn_confirm_buy .count').text(order_info.order_price);
    //         $('#tiku_buyinfo .btn_confirm_buy').data('order_price', order_info.order_price);
    //     } else if (ret.code == 4001) {
    //         YDUI.dialog.toast(ret.msg, 'none', 2000);
    //         setTimeout(function() {
    //             if (ua() == 'wx') {
    //                 location.href = api_domain + '/login_v3.php?loginsys=wx&scope=userinfo&sessionid=' + localStorage.sessionid + '&callback=' + api_domain + '/tiku/wx_callback.php&referer=' + window.location.href;
    //             } else {
    //                 Jump_Page('#/v4/wxlogin', '1');
    //             }
    //             return false;
    //         }, 2000)
    //     } else if (ret.code == 4002) {
    //         YDUI.dialog.toast(ret.msg, 'none', 2000);
    //         setTimeout(function() {
    //             Jump_Page('#/v4/index');
    //             return false;
    //         }, 2000)
    //     }
    // }, 'json');
}

//封装过期控制代码
function local_set(key, value) {
    var curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ data: value, time: curTime }));
}

//localStorage当天有效获取
function local_today_get(key) {
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if (dataObj == null) {
        return dataObj;
    }
    if (new Date(new Date().setHours(0, 0, 0, 0)) > dataObj.time) {
        console.log('信息已过期');
        return null;
        //alert("信息已过期")
    } else {
        //console.log("data="+dataObj.data);
        //console.log(JSON.parse(dataObj.data));
        var dataObjDatatoJson = JSON.parse(dataObj.data)
        return dataObjDatatoJson;
    }
}

function local_get(key, exp) {
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if (dataObj == null) {
        return dataObj;
    }
    if (new Date().getTime() - dataObj.time > exp) {
        console.log('信息已过期');
        return null;
        //alert("信息已过期")
    } else {
        //console.log("data="+dataObj.data);
        //console.log(JSON.parse(dataObj.data));
        var dataObjDatatoJson = JSON.parse(dataObj.data)
        return dataObjDatatoJson;
    }
}

// 试卷时间
var nowtime = 0,
    timer;

function showtime() {
    var minutes = Math.floor(nowtime / 60);
    var seconds = Math.floor(nowtime % 60);
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    var msg = minutes + ":" + seconds;
    $('#exam_question .times .time').text(msg);
}

function timeout() {
    if (timer != null) {
        return false;
    }

    showtime();

    timer = setInterval(function() {
        ++nowtime;
        showtime();

        if (nowtime == localStorage.exam_time - 1800) {
            time_stop();
            YDUI.dialog.confirm('', '<div class="text-center">剩余考试时间30分钟，请抓紧时间</div>', [{
                txt: '确定',
                color: true,
                callback: function() {
                    time_start();
                }
            }]);
        }
        if (nowtime == localStorage.exam_time) {
            time_stop();
            YDUI.dialog.confirm('', '<div class="text-center">考试时间已结束，是否交卷？</div>', [{
                    txt: '确定交卷',
                    color: '#43a737',
                    /* false:黑色  true:绿色 或 使用颜色值 */
                    callback: function() {
                        var do_time = Math.round(new Date() / 1000) - localStorage.exam_start_time;
                        var param = {
                            examid: localStorage.exam_exam_id,
                            sessionid: localStorage.sessionid,
                            do_time: do_time
                        };
                        jqrequest({
                            method: 'POST',  // 请求方法
                            url: api_domain + '/phalapi/public/?service=Paper.Index.userSubmitExam',  //  请求 url
                            data: param,
                            dataType: 'json' // 返回的数据类型
                        }).then(function(ret) {
                            if (ret.code == 0) {
                                localStorage.removeItem('exam_start_time');
                                nowtime = 0;
                                time_stop();
                                Router.replace('#/exam/result', true, true);
                            } else {
                                ydui_msg(ret.msg, 2000);
                            }
                        });
                        // $.post(api_domain + '/phalapi/public/?service=Paper.Index.userSubmitExam', param, function(ret) {
                        //     if (ret.code == 0) {
                        //         localStorage.removeItem('exam_start_time');
                        //         nowtime = 0;
                        //         time_stop();
                        //         Router.replace('#/exam/result', true, true);
                        //     } else {
                        //         ydui_msg(ret.msg, 2000);
                        //     }
                        // }, 'json');
                    }
                },
                {
                    txt: '继续做题',
                    color: '#43a737',
                    callback: function() {
                        time_start();
                    }
                }
            ]);
        }
    }, 1000);
}

function time_stop() {
    clearInterval(timer);
    timer = null;
}

function time_start() {
    timeout();
}

// 试卷做题页退出弹窗
function Exam_Quit(resolve) {
    if ($('#exam_question .info_box').is(":hidden")) {
        var msg = '确定要退出考试练习？退出后，将保存您当前的考试记录，下次重新进入后可继续做题。';
        var sure_btn = '确定';
        //判断是否是重做错题
        if (!isNull(localStorage.do_wrong) && localStorage.do_wrong == 1) {
            msg = '确定退出错题重做？退出后，将不保存您当前的做题记录';
            sure_btn = '确定退出';
        }

        layer.open({
            content: msg,
            btn: [
                [sure_btn, 'color:#43a737'],
                ['取消', 'color:#000']
            ],
            shadeClose: false,
            yes: function(index) {
                sessionStorage.q_cancel = 0;
                var do_time = Math.round(new Date() / 1000) - localStorage.exam_start_time;
                var param = {
                    sessionid: localStorage.sessionid,
                    examid: localStorage.exam_exam_id,
                    do_time: do_time
                };
                if (!isNull(localStorage.do_wrong) && localStorage.do_wrong == 1) {
                    jqrequest({
                        method: 'POST',  // 请求方法
                        url: api_domain + '/phalapi/public/?service=Paper.Index.clearExamLogs',  //  请求 url
                        data: param,
                        dataType: 'json' // 返回的数据类型
                    }).then(function(ret) {
                        localStorage.removeItem('do_wrong');
                        localStorage.removeItem('exam_log_id');
                        return resolve(false);
                    });
                    // $.post(api_domain + '/phalapi/public/?service=Paper.Index.clearExamLogs', param, function(ret) {
                    //     localStorage.removeItem('do_wrong');
                    //     localStorage.removeItem('exam_log_id');
                    //     return resolve(false);
                    // }, 'json');
                } else {
                    jqrequest({
                        method: 'POST',  // 请求方法
                        url: api_domain + '/phalapi/public/?service=Paper.Index.setUsersuspend',  //  请求 url
                        data: param,
                        dataType: 'json' // 返回的数据类型
                    }).then(function(ret) {
                        if (ret.code == 0 || ret.code == 4003) {
                            if (ret.code == 0) {
                                time_stop();
                                localStorage.exam_do_time = do_time;
                            }
                            return resolve(false);
                        } else {
                            ydui_msg(ret.msg);
                            return false;
                        }
                    });
                    // $.post(api_domain + '/phalapi/public/?service=Paper.Index.setUsersuspend', param, function(ret) {
                    //     if (ret.code == 0 || ret.code == 4003) {
                    //         if (ret.code == 0) {
                    //             time_stop();
                    //             localStorage.exam_do_time = do_time;
                    //         }
                    //         return resolve(false);
                    //     } else {
                    //         ydui_msg(ret.msg);
                    //         return false;
                    //     }
                    // }, 'json');
                }
                layer.close(index);
            },
            no: function(index) {
                sessionStorage.q_cancel = 1;
                resolve(true);
                layer.close(index);
            },
        });
    } else {
        resolve(false);
    }
}

function manage_text(text) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

$('body').on('click', '.back_to_v4', function() {
    back_to_v4('#/v4/index')
});


function back_to_v4(back_url) {
    history.pushState({
        url: Router.CurrentRouteState.url,
        lasturl: (ref = Router.LastRouteState) != null ? ref.url : void 0,
        group: Router.CurrentRouteState.group
    }, null, Router.CurrentRouteState.url);
    Router.back(back_url, true, true).then(function() {
        RouteStack.push(history.state);
    });
}


if (ua() == 'wx') {
    var _readyCalls = [];
    var _wxReady = false;
    wx.config(wxconfig);
    wx.ready(function() {
        while (_readyCalls.length > 0) {
            try {
                _readyCalls.shift()();
            } catch (e) {
                console.warn(e);
            }
        }
        _wxReady = true;
    });
}

/**
 * 微信以及 APP 分享调用
 *
 * @param {string} shareTarget 分享目标
 * @param {object} shareContent  分享内容
 * @param {function} successCallback 成功回调
 * @param {function} failCallback  失败回调, failCallback(cancel: boolean, msg: string)
 * @returns {object} 返回分享控制对象
 */
function wxbshare(shareTarget, shareContent, successCallback, failCallback) {
    if (window.plus) {
        if (shareTarget == null) {
            console.warn('can\'t support null target in app');
            return ret;
        }
        $.plus(function() {
            var sTargetName;
            var scene;
            var shareService;
            switch (shareTarget) {
                case wxbshare.TARGET_TIMELINE:
                    scene = 'WXSceneTimeline';
                    sTargetName = 'weixin';
                    break;
                case wxbshare.TARGET_FRIEND:
                    scene = 'WXSceneSession';
                    sTargetName = 'weixin';
                    break;
                case wxbshare.TARGET_QQ:
                case wxbshare.TARGET_QZone:
                    sTargetName = 'qq';
                    break;
            };
            var share = function() {
                var message = {};
                if (shareContent.type === 'image') {
                    message.type = 'image';
                    message.pictures = shareContent.imgPath;
                } else {
                    message.type = 'web';
                    message.title = shareContent.title;
                    message.content = shareContent.desc;
                    message.href = shareContent.link;
                    message.thumbs = [shareContent.imgUrl];
                    message.pictures = [shareContent.imgUrl];
                }
                message.extra = { scene: scene };
                shareService.send(message, function() {
                    typeof successCallback === 'function' && successCallback(shareTarget);
                }, function(err) {
                    typeof failCallback === 'function' && failCallback(shareTarget, false, err);
                });
            };
            plus.share.getServices(function(s) {
                for (var i in s) {
                    if (sTargetName === s[i].id) {
                        shareService = s[i];
                        share();
                        break;
                    }
                }
            }, function(err) {
                typeof failCallback === 'function' && failCallback(shareTarget, false, err);
            });
        });
        return;
    }
    if (window.navigator.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
        throw new Error('非微信浏览器环境，调用了微信浏览器分享的函数');
    } else if (shareContent.type === 'image') {
        throw new Error('公众号分享不支持分享图片');
    }

    wxbshare.setWXShareContent(shareTarget, shareContent, successCallback, failCallback);
}

wxbshare.TARGET_TIMELINE = 'Timeline'; // 朋友圈
wxbshare.TARGET_FRIEND = 'Friend'; // 微信好友
wxbshare.TARGET_QQ = 'QQ'; // QQ
wxbshare.TARGET_QZone = 'QZone'; // QQ 空间
wxbshare.ALL_TARGETS = [
    wxbshare.TARGET_TIMELINE,
    wxbshare.TARGET_FRIEND,
    wxbshare.TARGET_QQ,
    wxbshare.TARGET_QZone
];


wxbshare.setWXShareContent = function(shareTarget, content, successCallback, failCallback) {
    var readyToShare = function() {
        if (shareTarget == null) {
            shareTarget = wxbshare.ALL_TARGETS;
        } else if (shareTarget.constructor === String) {
            shareTarget = [shareTarget];
        }
        var shareFuncs = (function() {
            var ret = [];
            for (var i = 0; i < wxbshare.ALL_TARGETS.length; i++) {
                var target = wxbshare.ALL_TARGETS[i];
                var _content;
                var _defaultContent = wxbshare.getShareContent(target);
                var _successcb;
                var _failcb;
                if (shareTarget.indexOf(target) === -1) {
                    _content = $.extend({}, content);
                    _successcb = null;
                    _failcb = null;
                } else {
                    _content = $.extend({}, content);
                    _successcb = successCallback;
                    _failcb = failCallback;
                }
                _content.success = _defaultContent && _defaultContent.success;
                _content.fail = _defaultContent && _defaultContent.fail;
                switch (target) {
                    case wxbshare.TARGET_TIMELINE:
                        ret.push([target, _content, wx.updateTimelineShareData || wx.onMenuShareTimeline, _successcb, _failcb]);
                        break;
                    case wxbshare.TARGET_FRIEND:
                        ret.push([target, _content, wx.updateAppMessageShareData || wx.onMenuShareAppMessage, _successcb, _failcb]);
                        break;
                    case wxbshare.TARGET_QQ:
                        ret.push([target, _content, wx.updateAppMessageShareData || wx.onMenuShareQQ, _successcb, _failcb]);
                        break;
                    case wxbshare.TARGET_QZone:
                        ret.push([target, _content, wx.updateTimelineShareData || wx.onMenuShareQZone, _successcb, _failcb]);
                        break;
                }
            }
            return ret;
        })();

        for (var i = 0; i < shareFuncs.length; i++) {
            (function(item) {
                var target = item[0];
                var content = item[1];
                var shareFunc = item[2];
                var successCallback = item[3];
                var failCallback = item[4];
                shareFunc.call(wx, {
                    title: content.title,
                    desc: content.desc,
                    link: content.link,
                    imgUrl: content.imgUrl,
                    success: function() {
                        typeof successCallback === 'function' && successCallback(target);
                        typeof content.success === 'function' && content.success(target);
                    },
                    cancel: function() {
                        typeof failCallback === 'function' && failCallback(target, true);
                        typeof content.fail === 'function' && content.fail(target, true);
                    },
                    fail: function() {
                        typeof failCallback === 'function' && failCallback(target, false);
                        typeof content.fail === 'function' && content.fail(target, false);
                    }
                })
            })(shareFuncs[i]);
        }
    };

    if (_wxReady) {
        readyToShare();
    } else {
        _readyCalls.push(readyToShare);
    }
};


/**
 * 设置默认分享内容 分享成功后不会调用任何回调
 * @param {object} content 默认分享内容
 */
wxbshare.setDefault = function(content) {
    if (window.plus) {
        console.warn('set share default share is not supported in app.');
        return;
    }
    if (wxbshare.shareContent == null) {
        wxbshare.shareContent = {};
    }
    var target = null;
    if (arguments.length == 2) {
        target = content;
        content = arguments[1];
    }
    if (content != null) {
        wxbshare.shareContent[target || 'default'] = content;
    }
    wxbshare.setWXShareContent(target, content);
};

wxbshare.getShareContent = function(target) {
    if (wxbshare.shareContent == null) return null;
    if (target == null) {
        return wxbshare.shareContent['default'];
    }
    if (!wxbshare.shareContent[target]) {
        return wxbshare.shareContent['default'];
    }
    return wxbshare.shareContent[target];
};

/**
 * 重置分享目标为默认分享内容
 * @param {string} target 重置分享目标
 */
wxbshare.reset = function(target) {
    if (window.plus) {
        console.warn('reset share is not supported in app.');
        return;
    }
    if (wxbshare.shareContent) {
        var content = wxbshare.shareContent[target || 'default'];
        wxbshare.setWXShareContent(target, content);
    }
};


// 商城顶部倒计时

var shop_nowtime = 0,
    shop_timer;

function shop_showtime() {
    var minutes = Math.floor(shop_nowtime / 60);
    var seconds = Math.floor(shop_nowtime % 60);
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    var msg = minutes + ":" + seconds;
    $('.page.shop .time-msg .times').text(msg);
}

function shop_time_stop() {
    clearInterval(shop_timer);
    shop_timer = null;
}

function shop_time_start() {
    shop_timeout();
}

function shop_timeout() {
    if (shop_timer != null) {
        return false;
    }
    shop_showtime();
    shop_timer = setInterval(function() {
        --shop_nowtime;
        shop_showtime();
        if (shop_nowtime == 0) {
            clearInterval(shop_timer);
            shop_timer = null;
            $('.page.shop.active .time-msg').addClass('none');
        }
    }, 1000);
}

/**
 * 无网/弱网环境重载提示
 */
function showNetworkError(settings) {
    if (ua() == 'app') {
        if (window.isShowTimeout !== true) {
            window.isShowTimeout = true;
            v4_incuSTProj.track('网络质量差', {
                'unionid': localStorage.wx_uid,
                'url': settings.url,
                'params': settings.data,
                'aweaktime': (Date.parse(new Date()) - sessionStorage.aweaktime) / 1000
            });
            var networkType = plus.networkinfo.getCurrentType();
            var msg = '当前移动网络差，建议连接WIFI后再重试';
            if (networkType == 3) {
                msg = '当前WIFI网络差，建议关闭WIFI使用4G网络后再重试';
            } else if (networkType == 1) {
                msg = '当前设备未连接网络，请连接后重试';
            }
            layer.open({
                content: msg,
                btn: [
                    ['重试', 'color:#0894ec'],
                    ['取消']
                ],
                shadeClose: false,
                yes: function(index) {
                    layer.close(index);
                    window.isShowTimeout = false;
                    location.reload();
                },
                no: function(index) {
                    layer.close(index);
                    window.isShowTimeout = false;
                    var ws = plus.webview.getTopWebview();
                    plus.webview.close(ws);
                }
            });
        }
    }
}

/**
 * 修改微信页面顶部标题
 */
function loadTitle() {
    if (ua() == 'wx') {
        var pagename = Router.CurrentRouteState.route.page || '';
        var pagegroups = {
            tiku_message: '消息中心',
            tiku_difficulty: '难题',
            shop_comments: '已购评价',
            ask_list: '问大家',
            ask_detail: '问答详情',
            tiku_user: '个人中心',
            tiku_note: '我的记录',
            tiku_task: '积分任务',
            shop_order: '我的订单',
            shop_orderinfo: '订单详情',
            tiku_notice: '订阅提醒',
            tiku_msg: '我的纠错',
            tiku_track: '优惠券',
            help: '帮助中心',
            tiku_about: '关于我们',
            tiku_day_result: '易哈佛每日一练',
            tiku_mes_askdetail: '问答详情',
            tiku_suggest: '产品建议',
        };
        var title = pagegroups[pagename] || '易哈佛';
        document.title = title;
    }
}
// // 活动点击跳转
// $('body').on('click', '.elevenIcon', function() {
//     Router.replace('#/acts_shop', true, true);
// });

document.addEventListener('touchmove', function(event) {
    if ($('#medal').length > 0 || $('.modal-new-medal').length > 0) {
        event.preventDefault();
    }
}, false);


function summary_modal(percent, isNum, numWord, word, btnWord, callback) {
    /**
     * percent 正确率的数值
     * isNum 是否显示完成多少题
     * numWord 完成的题数
     * word 激励话语
     * btnWord  按钮上的话语
     * callback 点击按钮的回调函数
     */
    $('#tiku_question #summary-modal .word').html(word);
    $('#tiku_question #summary-modal .btn').html(btnWord);
    $("#tiku_question #summary-modal #per").text(percent).data('counterupTo', percent + '');

    if (isNum) {
        $('#tiku_question #summary-modal .bg-summary').css('margin-top', '.65rem');
        $('#tiku_question #summary-modal .word').css('top', '4.93rem');
        $('#tiku_question #summary-modal .btn').css('bottom', '.64rem');
        $('#tiku_question #summary-modal .num-title').html(numWord);
        $('#tiku_question #summary-modal .num').show();
    } else {
        $('#tiku_question #summary-modal .bg-summary').css('margin-top', '.91rem');
        $('#tiku_question #summary-modal .word').css('top', '4.59rem');
        $('#tiku_question #summary-modal .btn').css('bottom', '.8rem');
        $('#tiku_question #summary-modal .num').hide();
    }
    var waveTime = null;
    var waveHeight = 0;
    var waveNum = percent;

    function waves() {
        if (waveHeight <= waveNum) {
            $("#tiku_question #summary-modal .wave").css("height", (waveHeight + 10) + '%');
            waveHeight++;
            waveTime = setTimeout(function() {
                waves()
            }, 15);
        } else {
            clearTimeout(waveTime);
            waveTime = null;
        }
    }
    waves();
    $('#tiku_question #summary-modal #per').countUp({
        delay: 10,
        time: 1000
    });
    $('#tiku_question .mask-summary').fadeIn();
    $('#tiku_question .mask-summary').removeClass('none');
}

function imgTogether(url, nickname, type, lev, word, exciteWord, callback) {
    /**
     * headimg 头像地址
     * nickname 用户昵称
     * type 勋章类型: hundred-百发百中 study-学习领袖 note-笔记侠 person-社交达人 cat-夜猫子 bird-早起鸟 fist-锲而不舍 sunday-末末耕耘 exam-逢考必过
     * lev 勋章等级 none-没有 bronze-铜级 silver-银级 golden-金级
     * word 当前等级勋章的获取条件
     */
    var decWord = [];
    var canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1334;
    var context = canvas.getContext('2d');

    var imgBg = document.getElementById('medal_bg');
    var imgStar = document.getElementById('medal_star');
    var imgUpload = document.getElementById('medal_headimg');
    var imgCrown = document.getElementById('medal_crown');
    var imgVip = document.getElementById('medal_vip');

    var imgType = new Image();
    imgType.onload = function() {}
    imgType.src = '/static/images/medal/' + type + '.png';
    var imgLev = new Image();
    imgLev.onload = function() {}
    imgLev.src = '/static/images/medal/bg-golden.png';

    context.drawImage(imgBg, 0, 0, canvas.width, canvas.height);
    context.save();
    context.arc(canvas.width / 2, 889 + 50, 50, 0, 2 * Math.PI);
    // 从画布上裁剪出这个圆形
    context.clip();
    context.drawImage(imgUpload, canvas.width / 2 - 50, 889, 100, 100);
    context.restore();
    context.drawImage(imgLev, 53, 121, 643, 645);
    context.drawImage(imgType, canvas.width / 2 - imgType.width / 2, 276, 433, 356);
    switch (lev) {
        case 'bronze':
            decWord = getBronzeWord(type);
            context.drawImage(imgStar, canvas.width / 2 - 41, 651, 82, 80);
            break;
        case 'silver':
            decWord = getSilverWord(type);
            context.drawImage(imgStar, 273, 651, 82, 80);
            context.drawImage(imgStar, 395, 651, 82, 80);
            break;
        case 'golden':
            decWord = getGoldenWord(type);
            context.drawImage(imgStar, 211, 651, 82, 80);
            context.drawImage(imgStar, 333, 651, 82, 80);
            context.drawImage(imgStar, 455, 651, 82, 80);
            break;
        default:
            break;
    }


    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillStyle = '#000';
    context.font = '30px Adobe Ming Std';
    var nickWidth = context.measureText(nickname).width;
    context.fillText(nickname, canvas.width / 2, 1015);
    if (sessionStorage.vip == '是' || sessionStorage.isShowMedalVip == '是') {
        context.drawImage(imgCrown, canvas.width / 2 + nickWidth / 2 + 8, 1016, 43, 35);
        context.drawImage(imgVip, 317, 962, 32, 32);
    }

    context.textBaseline = "top";
    context.fillStyle = '#fff';
    context.font = 'bold 52px Adobe Ming Std';
    context.fillText(getMedalName(type), canvas.width / 2, 146);

    if (type != 'exam') {
        context.textAlign = "start";
        context.font = '36px Adobe Ming Std';
        var wordLeft = context.measureText($.trim(decWord[0])).width;
        var wordRight = context.measureText($.trim(decWord[2])).width;
        context.font = '40px Adobe Ming Std';
        var wordMiddle = context.measureText($.trim(decWord[1])).width;
        var wordWidth = wordLeft + wordMiddle + wordRight;
        context.fillStyle = '#fff';
        context.font = '36px Adobe Ming Std';
        context.fillText($.trim(decWord[0]), (canvas.width - wordWidth) / 2, 781);

        context.fillStyle = '#FEDB4D';
        context.font = '40px Adobe Ming Std';
        context.fillText($.trim(decWord[1]), ((canvas.width - wordWidth) / 2) + wordLeft + 4, 778);

        context.fillStyle = '#fff';
        context.font = '36px Adobe Ming Std';
        context.fillText($.trim(decWord[2]), (canvas.width - wordWidth) / 2 + wordLeft + wordMiddle + 8, 781);
    } else {
        context.textAlign = "center";
        context.fillText(decWord[0], canvas.width / 2, 781);
    }

    context.textAlign = "start";
    context.textBaseline = "top";
    context.fillStyle = '#000';
    context.font = '34px Adobe Ming Std';
    if (exciteWord.length > 14) {
        context.fillText(exciteWord.substring(0, 14), 68, 1147, 445);
        context.fillText(exciteWord.substring(14, exciteWord.length), 68, 1200, 445);
    } else {
        context.fillText(exciteWord, 68, 1147, 445);
    }
    // 回调
    callback(canvas.toDataURL('image/png'));
};

function getBronzeWord(type) {
    var word = [];
    switch (type) {
        case 'hundred':
            word[0] = '连续答对';
            word[1] = '5';
            word[2] = '题';
            break;
        case 'study':
            word[0] = '累计做题数';
            word[1] = '50';
            word[2] = '题';
            break;
        case 'note':
            word[0] = '累计添加笔记';
            word[1] = '10';
            word[2] = '条';
            break;
        case 'person':
            word[0] = '累计分享好友';
            word[1] = '10';
            word[2] = '次';
            break;
        case 'cat':
            word[0] = '晚上11点后累计学习';
            word[1] = '10';
            word[2] = '天';
            break;
        case 'bird':
            word[0] = '早上8点前累计学习';
            word[1] = '10';
            word[2] = '天';
            break;
        case 'fist':
            word[0] = '连续';
            word[1] = '7';
            word[2] = '天坚持做题';
            break;
        case 'sunday':
            word[0] = '周末累计学习';
            word[1] = '2';
            word[2] = '天';
            break;
        case 'exam':
            word[0] = '集齐全部勋章，定能逢考必过';
            break;
        default:
            break;
    }
    return word;
}

function getSilverWord(type) {
    var word = [];
    switch (type) {
        case 'hundred':
            word[0] = '连续答对';
            word[1] = '15';
            word[2] = '题';
            break;
        case 'study':
            word[0] = '累计做题数';
            word[1] = '500';
            word[2] = '题';
            break;
        case 'note':
            word[0] = '累计添加笔记';
            word[1] = '30';
            word[2] = '条';
            break;
        case 'person':
            word[0] = '累计分享好友';
            word[1] = '30';
            word[2] = '次';
            break;
        case 'cat':
            word[0] = '晚上11点后累计学习';
            word[1] = '20';
            word[2] = '天';
            break;
        case 'bird':
            word[0] = '早上8点前累计学习';
            word[1] = '20';
            word[2] = '天';
            break;
        case 'fist':
            word[0] = '连续';
            word[1] = '15';
            word[2] = '天坚持做题';
            break;
        case 'sunday':
            word[0] = '周末累计学习';
            word[1] = '10';
            word[2] = '天';
            break;
        case 'exam':
            word[0] = '集齐全部勋章，定能逢考必过';
            break;
        default:
            break;
    }
    return word;
}

function getGoldenWord(type) {
    var word = [];
    switch (type) {
        case 'hundred':
            word[0] = '连续答对';
            word[1] = '30';
            word[2] = '题';
            break;
        case 'study':
            word[0] = '累计做题数';
            word[1] = '2000';
            word[2] = '题';
            break;
        case 'note':
            word[0] = '累计添加笔记';
            word[1] = '100';
            word[2] = '条';
            break;
        case 'person':
            word[0] = '累计分享好友';
            word[1] = '100';
            word[2] = '次';
            break;
        case 'cat':
            word[0] = '晚上11点后累计学习';
            word[1] = '30';
            word[2] = '天';
            break;
        case 'bird':
            word[0] = '早上8点前累计学习';
            word[1] = '30';
            word[2] = '天';
            break;
        case 'fist':
            word[0] = '连续';
            word[1] = '30';
            word[2] = '天坚持做题';
            break;
        case 'sunday':
            word[0] = '周末累计学习';
            word[1] = '30';
            word[2] = '天';
            break;
        case 'exam':
            word[0] = '集齐全部勋章，定能逢考必过';
            break;
        default:
            break;
    }
    return word;
}

function getMedalName(medal_type) {
    var name = '';
    switch (medal_type) {
        case 'hundred':
            name = '百发百中';
            break;
        case 'study':
            name = '学习领袖';
            break;
        case 'note':
            name = '笔记侠';
            break;
        case 'person':
            name = '社交达人';
            break;
        case 'cat':
            name = '夜猫子';
            break;
        case 'bird':
            name = '早起鸟';
            break;
        case 'fist':
            name = '锲而不舍';
            break;
        case 'sunday':
            name = '“末末”耕耘';
            break;
        case 'exam':
            name = '逢考必过';
            break;
        default:
            break;
    }
    return name;
}

function getMedalType(medal_id) {
    var type = '';
    if (medal_id == 1) {
        type = 'hundred';
    } else if (medal_id == 2) {
        type = 'study'
    } else if (medal_id == 3) {
        type = 'note'
    } else if (medal_id == 4) {
        type = 'person'
    } else if (medal_id == 5) {
        type = 'cat'
    } else if (medal_id == 6) {
        type = 'bird'
    } else if (medal_id == 7) {
        type = 'sunday'
    } else if (medal_id == 8) {
        type = 'fist'
    } else if (medal_id == 9) {
        type = 'exam'
    }
    return type;
}


function userMedalStatistic(medal_ids, tiku_info) {
    if (!isNull(tiku_info)) {
        sessionStorage.isShowMedalVip = '是';
        //如果开启了连对提醒
        if (isNull(localStorage.is_right) && tiku_info.is_next == false) {
            //计算连对数量
            if (tiku_info.is_true == 1 && tiku_info.model != 'subjectives' && tiku_info.model != 'objectives') {
                if (!isNull(sessionStorage.do_right_num)) {
                    sessionStorage.do_right_num = parseInt(sessionStorage.do_right_num) + 1;
                } else {
                    sessionStorage.do_right_num = 1;
                }
                //初始化
                //$('#tiku_question .music')[0].pause();
                //$('#tiku_question .music')[0].load();
            } else {
                if (tiku_info.model != 'subjectives' && tiku_info.model != 'objectives') {
                    sessionStorage.do_right_num = 0;
                }

            }
        }

        if (tiku_info.is_true == 1 && tiku_info.model != 'subjectives' && tiku_info.model != 'objectives') {
            if (!isNull(sessionStorage.medal_do_right_num)) {
                sessionStorage.medal_do_right_num = parseInt(sessionStorage.medal_do_right_num) + 1;
            } else {
                sessionStorage.medal_do_right_num = 1;
            }
            //初始化
            //$('#tiku_question .music')[0].pause();
            //$('#tiku_question .music')[0].load();
        } else {
            if (tiku_info.model != 'subjectives' && tiku_info.model != 'objectives') {
                sessionStorage.medal_do_right_num = 0;
            }
        }

        if (tiku_info.isdo == 1 && tiku_info.model != 'subjectives' && tiku_info.model != 'objectives') {
            //统计小结数据
            var round_ten_right = isNull(sessionStorage.round_ten_right) ? 0 : parseInt(sessionStorage.round_ten_right);
            var round_ten_error = isNull(sessionStorage.round_ten_error) ? 0 : parseInt(sessionStorage.round_ten_error);
            var round_do_num = round_ten_right + round_ten_error;
            // var last_round_ten_right = parseInt(sessionStorage.last_round_ten_right);
            // var last_round_ten_error = parseInt(sessionStorage.last_round_ten_error);
            if (isNull(local_today_get('today_do_nums'))) {
                local_set('today_do_nums', 1);
            } else {
                local_set('today_do_nums', parseInt(local_today_get('today_do_nums')) + 1);
            }
            if (round_do_num < 10) {
                if (tiku_info.is_true == 1) { //正确
                    if (isNull(round_ten_right)) {
                        sessionStorage.round_ten_right = 1;
                    } else {
                        sessionStorage.round_ten_right = round_ten_right + 1;
                    }
                } else { //错误
                    if (isNull(round_ten_error)) {
                        sessionStorage.round_ten_error = 1;
                    } else {
                        sessionStorage.round_ten_error = round_ten_error + 1;
                    }
                }
                round_do_num++;
            } else {
                sessionStorage.last_round_ten_right = round_ten_right;
                sessionStorage.last_round_ten_error = round_ten_error;
                if (tiku_info.is_true) { //正确
                    sessionStorage.round_ten_right = 1;
                    sessionStorage.round_ten_error = 0;
                } else { //错误
                    sessionStorage.round_ten_error = 1;
                    sessionStorage.round_ten_right = 0;
                }
                round_do_num = 1;
            }
        }
    }
    jqrequest({
        method: 'POST',
        url: api_domain + '/phalapi/public/?service=App.Medal.userMedalStatistic',
        data: {
            sessionid: localStorage.sessionid,
            medal_ids: medal_ids,
            continue_right_num: sessionStorage.medal_do_right_num
        },
        dataType: 'json'
    }).then(function(medalret) {
        var medal_flag = 0;
        if (medalret.code == 0) {
            medal_flag = 1;
            v4_incuSTProj.track('勋章获取', {
                'unionid': localStorage.wx_uid,
            });
            var data = medalret.data;
            var iswx = ua() == 'wx' ? true : false;
            var medal_id = data[0]['medal_id'];
            //hundred-百发百中 study-学习领袖 note-笔记侠 person-社交达人 cat-夜猫子 bird-早起鸟 fist-锲而不舍 sunday-末末耕耘 exam-逢考必过
            var type = getMedalType(medal_id);
            newMedalModal(localStorage.headimgurl, localStorage.nickname, type, data[0]['level'], data[0]['medal_num_index'], data[0]['medal_description'], iswx);
            data.splice(0, 1);
            console.log(data);
            if (data.length > 0) {
                sessionStorage.setItem("medals_info", JSON.stringify(data));
            }
            //有勋章获得
        }
        if (tiku_info.isdo == 1) {
            if (round_do_num == 10 && isNull(localStorage.is_knobble)) { //出现小结
                //计算正确率
                var round_ten_right = isNull(sessionStorage.round_ten_right) ? 0 : parseInt(sessionStorage.round_ten_right);
                var last_round_ten_right = isNull(sessionStorage.last_round_ten_right) ? 0 : parseInt(sessionStorage.last_round_ten_right);
                var percent = parseInt((round_ten_right / round_do_num) * 100);
                var word = '';
                var btn_word = '';
                var last_percent = parseInt((last_round_ten_right / round_do_num) * 100);
                var today_do_nums = parseInt(local_today_get('today_do_nums'));
                var num_word = today_do_nums;
                var is_num = today_do_nums >= 50 ? true : false;
                if (percent < 60) {
                    var word_arr = [
                        '同学，这肯定不是你的真实水平，再试一次！',
                        '通过考试没什么秘诀，就是不断的练习，你还有很大的提升空间！加油',
                        '失误在所难免，没有人能一步登天，继续加油！',
                        '别气馁，认真静心做题，继续努力，一定能快速提升成绩！',
                        '基础练习非常重要，量变引起质变的道理你肯定明白',
                        '相信你可以的，再认真想一想，别着急，你一定行！'
                    ];
                    btn_word = '接受挑战';
                } else if (percent >= 60 && percent <= 80) {
                    if (today_do_nums < 100 && percent <= last_percent) {
                        var word_arr = [
                            '很好！成功都是源于不懈的努力，保持你的学习劲头！',
                            '还不错，再仔细一些，会做的更好，坚持就是胜利！',
                            '很不错，你的正确率已经超过了80%的考生了，轻松过考没问题！',
                            '现在的你那么努力复习，将来考试就会轻松很多，加油！'
                        ];
                    } else if (today_do_nums < 100 && percent > last_percent) {
                        var percent_up = percent - last_percent;
                        var word_arr = [
                            '非常好！比上一轮的正确率提升了&nbsp;<span style=\"color: #000;"\>' + percent_up + '%</span>&nbsp;，老师非常看好你！',
                            '很棒！比上一轮的正确率提升了&nbsp;<span style=\"color: #000;"\>' + percent_up + '%</span>&nbsp;，进步明显，再接再厉！',
                            '非常棒，你的正确率在稳步提升中，继续努力！'
                        ];
                    } else {
                        var word_arr = [
                            '学习是很枯燥，但是比起挂科的懊恼不算什么，继续加油',
                            '只有度过了一段连自己都被感动了的日子，才会变成那个最好的自己',
                            '现在的你这么努力，将来的你不会心累',
                            '努力就能成功，坚持是制胜法宝',
                            '做得到和做不到，只在一念之间',
                            '黎明前是最黑暗的，熬过这段时间就好了，加油！'
                        ];
                    }
                    btn_word = '再来10题';
                } else if (percent == 90) {
                    var word_arr = [
                        '你太棒了，正确率已经超过99%的考生，肯定逢考必过！',
                        '厉害了，差一点就全对了，乘胜追击，再来10题！'
                    ];
                    btn_word = '继续挑战';
                } else {
                    var word_arr = [
                        '全对！不简单，继续保持，你在考试的时候肯定也能取得高分',
                        '满分！厉害了，你这么努力，进入考场肯定能够从容面对'
                    ];
                    btn_word = '继续挑战';
                }
                var index = Math.floor((Math.random() * word_arr.length));
                word = word_arr[index];
                //出现小结
                if (medal_flag) { //先出现勋章
                    var summary_data = {};
                    summary_data.percent = percent;
                    summary_data.is_num = is_num;
                    summary_data.num_word = num_word;
                    summary_data.word = word;
                    summary_data.btn_word = btn_word;
                    sessionStorage.summary_data = JSON.stringify(summary_data);
                } else { //出现小结
                    summary_modal(percent, is_num, num_word, word, btn_word, function() {

                    });
                }
            } else {
                if (sessionStorage.do_right_num <= 1) {
                    //$('#tiku_question .music')[0].play();//取消声音
                } else {
                    if (medalret.code != 0 && localStorage.is_right != 1) {
                        $('#tiku_question .right-model').removeClass('right-6 right-4 right-2');
                        $('#tiku_question .right-model .right_num').text(sessionStorage.do_right_num);
                        if (sessionStorage.do_right_num > 1 && sessionStorage.do_right_num < 4) {
                            $('#tiku_question .right-model .word').text('很棒');
                            $('#tiku_question .right-model').addClass('right-2');
                        } else if (sessionStorage.do_right_num > 3 && sessionStorage.do_right_num < 6) {
                            $('#tiku_question .right-model .word').text('优秀');
                            $('#tiku_question .right-model').addClass('right-4');
                        } else {
                            $('#tiku_question .right-model .word').text('完美');
                            $('#tiku_question .right-model').addClass('right-6');
                        }
                        // $('#tiku_question .music')[0].play();
                        $('#tiku_question .right-model').fadeIn();

                        setTimeout(function() {
                            $('#tiku_question .right-model').fadeOut();
                        }, 1000);
                    }
                }
            }
        }
    });
}

/**
 * 获取激励语
 * **/
function getExciteWord(type) {
    var excite_word_arr = [];
    if (type == 'hundred') {
        excite_word_arr = [
            "想要不被别人超越，先超越昨天的自己。",
            "幸运不过是顽强的努力而获得的奖赏。",
            "未经一番寒彻骨，哪得梅花扑鼻香。"
        ];
    } else if (type == 'study') {
        excite_word_arr = [
            "永不放弃是你梦想实现的唯一秘诀。",
            "任何成绩的质变，都来自于量变的积累。",
            "千淘万浪虽辛苦，吹尽黄沙始到金。"
        ];
    } else if (type == 'note') {
        excite_word_arr = [
            "命运不是机遇，而是选择。命运不靠等待，而凭争取。",
            "永远别放弃自己，哪怕所有人都放弃了你。",
            "愿你像那石灰，别人越是浇你冷水，你越是沸腾。"
        ];
    } else if (type == 'person') {
        excite_word_arr = [
            "成功就是简单的事情不断地重复做。",
            "当你把快乐与别人分享时，你就拥有两份快乐。",
            "一日读书一日功，一日不读十日空。"
        ];
    } else if (type == 'cat') {
        excite_word_arr = [
            "与其身处黑暗，不如提灯前行。",
            "坚持走过黑暗，定能见到了那夺目的曙光。",
            "在每一丝曙光破晓之前，一定是快要窒息的漫长黑夜。"
        ];
    } else if (type == 'bird') {
        excite_word_arr = [
            "只要如向日葵般坚持仰望，就一定会找到暖阳。",
            "盛年不再来，一日难再晨，及时当勉励，岁月不待人。",
            "每天早晨，叫醒自己的不是闹钟，而是梦想。"
        ];
    } else if (type == 'sunday') {
        excite_word_arr = [
            "理想的路总是为默默努力的人预备着。",
            "愿你像那石灰，别人越是浇你冷水，你越是沸腾。",
            "发奋努力，必有加倍赏赐。",
            '命运总是光临在那些有准备的人身上。',
            '成功就是简单的事情不断地重复做。',
            '你不是为别人而活，你要为自己奋斗出一片蓝天。',
            '永不放弃是你梦想实现的唯一秘诀。',
            '如果你觉得现在走的辛苦，那就证明你在走上坡路。'
        ];
    } else if (type == 'fist') {
        excite_word_arr = [
            "生命的闪耀，不坚持怎能看到。",
            "只要坚持走下去，属于你的风景终会出现。",
            "每个牛逼的人，都有一段苦逼的坚持。"
        ];
    } else if (type == 'exam') {
        excite_word_arr = [
            "将来的你，一定会感激现在拼命的自己。"
        ];
    }
    var index = Math.floor((Math.random() * excite_word_arr.length));
    return excite_word_arr[index];
}

function sharePicWeixinMessage(pic, scene) {
    sharewx.send({ type: 'image', pictures: [pic], extra: { scene: scene } }, function() {
        // alert("分享成功！");
        plus.nativeUI.toast('分享成功', { type: 'text' });
    }, function(e) {
        plus.nativeUI.toast('分享失败', { type: 'text' });
        // alert("分享失败："+e.message);
    });
}



/**
 * 获得新勋章的弹窗
 *
 */
function newMedalModal(headimg, nickname, type, lev, num, word, iswx) {
    /**
     * headimg 头像地址
     * nickname 用户昵称
     * type 勋章类型: hundred-百发百中 study-学习领袖 note-笔记侠 person-社交达人 cat-夜猫子 bird-早起鸟 fist-锲而不舍 sunday-末末耕耘 exam-逢考必过
     * lev 勋章等级 0-没有 1-铜级 2-银级 3-金级
     * num 获得的第几个勋章
     * word 当前等级勋章的获取条件
     * iswx 是否是微信环境 true-是 false-不是
     * exciteWord 激励语 生成图片用
     */

    headimg = api_domain + '/phalapi/public/?service=App.Medal.getHeadImg&img_url=' + localStorage.headimgurl;
    var exciteWord = localStorage.tiku_year + '年' + localStorage.exam_name + '考试';
    $('body').append("<img src='/static/images/medal/medal-bg.jpg' id='medal_bg' style='position: absolute;clip: rect(0, 0, 0, 0);'>");
    $('body').append("<img src='/static/images/medal/star.png' id='medal_star' style='position: absolute;clip: rect(0, 0, 0, 0);'>");
    $('body').append("<img src='" + headimg + "' id='medal_headimg' style='position: absolute;clip: rect(0, 0, 0, 0);' crossOrigin='anonymous'>");
    $('body').append("<img src='/static/images/medal/crown.png' id='medal_crown' style='position: absolute;clip: rect(0, 0, 0, 0);'>");
    $('body').append("<img src='/static/images/medal/vip.png' id='medal_vip' style='position: absolute;clip: rect(0, 0, 0, 0);'>");

    $("script[src='/static/js/mo.min.js']").remove();
    $("script[src='/static/js/medal_star.js']").remove();
    $('body').append("<script src='/static/js/mo.min.js' type='text/javascript'></script>");
    $('body').append("<script src='/static/js/medal_star.js' type='text/javascript'></script>");
    lev += '';
    var starStr = "";
    switch (lev) {
        case '0':
            lev = 'none';
            break;
        case '1':
            lev = 'bronze';
            starStr = "<i class='i-main'></i>";
            break;
        case '2':
            lev = 'silver';
            starStr = "<i class='i-main'></i>" +
                "<i class='i-main'></i>";
            break;
        case '3':
            lev = 'golden';
            starStr = "<i class='i-main'></i>" +
                "<i class='i-main'></i>" +
                "<i class='i-main'></i>";
            break;
        default:
            break;
    }
    var btnDomStr = iswx ? '' : "<li data-type='friends'><div class='wx-friend'><i class='i-main i-wx-friends'></i>微信朋友圈</div></li>";
    var modalDomStr = "<div class='mask-black new-medal-modal'></div>" +
        "<div class='modal-new-medal'>" +
        "<div class='new-medal'>" +
        "<div class='word'>恭喜获得新勋章</div>" +
        "<div class='bg-light' style=\"background-image: url('/static/images/medal/bg-golden.png')\"></div>" +
        "<div class='icon-medal' style=\"background-image: url('/static/images/medal/" + type + ".png')\"></div>" +
        "<div class='star'>" + starStr +
        "</div>" +
        "</div>" +
        "<div class='medal-num'>" + word + "</div>" +
        "<div class='medal-share-num'>分享记录每一次进步</div>" +
        "<ul>" +
        "<li data-type='friend'>" +
        "<div class='wx-friend'>" +
        "<i class='i-main i-wx-friend'></i>" +
        "微信好友" +
        "</div>" +
        "</li>" +
        btnDomStr +
        "<li data-type='save'>" +
        "<div class='wx-friend'>" +
        "<i class='i-main i-save-img'></i>" +
        "保存图片" +
        "</div>" +
        "</li>"
    "</ul>" +
    "</div>";

    $('body').append(modalDomStr);
    $('.modal-new-medal').animate({
        opacity: 1
    }, 'linear');
    var favicon = $('.modal-new-medal .star i')[0];
    medal_star(favicon, { cancelable: true, className: 'i-mstar', classElement: favicon }, function(ret) {});
    if ($('.modal-new-medal .star i')[1]) {
        setTimeout(function() {
            favicon = $('.modal-new-medal .star i')[1];
            medal_star(favicon, { cancelable: true, className: 'i-mstar', classElement: favicon }, function(ret) {});
        }, 800);
    }
    if ($('.modal-new-medal .star i')[2]) {
        setTimeout(function() {
            favicon = $('.modal-new-medal .star i')[2];
            medal_star(favicon, { cancelable: true, className: 'i-mstar', classElement: favicon }, function(ret) {});
        }, 1600);
    }
    $('.mask-black.new-medal-modal').click(function() {
        deleteMedalDom(function() {
            $('.modal-new-medal').remove(); //获得删除新勋章弹窗
            var medal_infos = JSON.parse(sessionStorage.getItem("medals_info"));
            if (!isNull(medal_infos)) {
                var iswx = ua() == 'wx' ? true : false;
                if (medal_infos.length > 0) {
                    var info = medal_infos.shift();
                    console.log(medal_infos);
                    var type = getMedalType(info['medal_id']);
                    newMedalModal(localStorage.headimgurl, localStorage.nickname, type, info['level'], info['medal_num_index'], info['medal_description'], iswx);
                    if (medal_infos.length > 0) {
                        sessionStorage.setItem("medals_info", JSON.stringify(medal_infos));
                    } else {
                        sessionStorage.removeItem('medals_info');
                    }
                }
            } else {
                if (!isNull(sessionStorage.summary_data)) {
                    var summary_data = JSON.parse(sessionStorage.summary_data);
                    summary_modal(summary_data.percent, summary_data.is_num, summary_data.num_word, summary_data.word, summary_data.btn_word, function() {});
                    sessionStorage.removeItem('summary_data');
                }
            }

        });
    });

    $('.modal-new-medal li').click(function(e) {
        var $this = $(this);
        var typeBtn = $this.attr('data-type');
        var eleImgUploadX = document.getElementById('imgUploadX');
        switch (typeBtn) {
            case 'friend':
                //分享朋友
                imgTogether(headimg, nickname, type, lev, word, exciteWord, function(url) {
                    v4_incuSTProj.track('勋章分享', {
                        'unionid': localStorage.wx_uid,
                        '分享类型': '分享好友'
                    });
                    $('#loading').show();
                    // 保存到本地

                    // 判断是否是app环境 app时保存到本地 否则展示图片
                    if (ua() == 'app') {
                        // 保存到本地
                        var bitmap = new plus.nativeObj.Bitmap("test");
                        bitmap.loadBase64Data(url, function() {
                            console.log("加载Base64图片数据成功");
                            var timestamp = (new Date()).getTime();
                            var pic = '_doc/' + timestamp + localStorage.wx_uid + '.png';
                            bitmap.save(pic, {
                                overwrite: true,
                                format: 'png'
                            }, function() {
                                plus.gallery.save('_doc/' + timestamp + localStorage.wx_uid + '.png', function() {
                                    console.log("保存图片到相册成功");
                                    // sharePicWeixinMessage(pic,'WXSceneSession');
                                    wxbshare('Friend', { type: 'image', imgPath: [pic] }, function() {
                                        plus.nativeUI.toast('分享成功', { type: 'text' });
                                    }, function() {
                                        plus.nativeUI.toast('分享失败', { type: 'text' });
                                    });
                                    bitmap.clear();
                                });
                                console.log('保存成功');
                            }, function(e) {
                                console.log('保存失败', e);
                            });
                        }, function() {
                            console.log('加载Base64图片数据失败：' + JSON.stringify(e));
                        });
                    } else {
                        $('#medal').remove();
                        $('body').append("<div class='mask-black medal-poster' style='z-index: 505;'></div><div id='medal' style='z-index: 507;'><p id='imgUploadX'></p><div hidden><p>已生成勋章海报，长按图片即可保存</p></div></div>");
                        $('#medal div').fadeIn();
                        if (iswx) {
                            $('#medal #imgUploadX').css('top', $('.modal-new-medal').offset().top);
                            $('#medal div').css({
                                'top': $('#medal #imgUploadX').offset().top + $('#medal #imgUploadX').height() - $('#medal div').height() * 4,
                                'z-index': 511
                            });
                        }
                        setTimeout(function() {
                            $('#medal div').fadeOut();
                        }, 1500);
                        eleImgUploadX = document.getElementById('imgUploadX');
                        // 预览
                        eleImgUploadX.innerHTML = '<img src="' + url + '">';
                        $('.medal-poster').click(function() {
                            $('#medal').remove();
                            $(this).remove();
                        });
                    }
                    $('#loading').hide();
                });
                break;
            case 'friends':
                // 分享朋友圈
                imgTogether(headimg, nickname, type, lev, word, exciteWord, function(url) {
                    v4_incuSTProj.track('勋章分享', {
                        'unionid': localStorage.wx_uid,
                        '分享类型': '分享朋友圈'
                    });
                    $('#loading').show();
                    // 保存到本地
                    var bitmap = new plus.nativeObj.Bitmap("test");
                    bitmap.loadBase64Data(url, function() {
                        console.log("加载Base64图片数据成功");
                        var timestamp = (new Date()).getTime();
                        var pic = '_doc/' + timestamp + localStorage.wx_uid + '.png';
                        bitmap.save(pic, {
                            overwrite: true,
                            format: 'png'
                        }, function() {
                            plus.gallery.save(pic, function() {
                                console.log('保存成功');
                                // sharePicWeixinMessage(pic,'WXSceneTimeline');
                                wxbshare('Timeline', { type: 'image', imgPath: [pic] }, function() {
                                    plus.nativeUI.toast('分享成功', { type: 'text' });
                                }, function() {
                                    plus.nativeUI.toast('分享失败', { type: 'text' });
                                });
                            });
                        }, function(e) {
                            console.log('保存失败', e);
                        });
                    }, function() {
                        console.log('加载Base64图片数据失败：' + JSON.stringify(e));
                    });
                    $('#loading').hide();
                });
                break;
            case 'save':
                // 保存图片
                imgTogether(headimg, nickname, type, lev, word, exciteWord, function(url) {
                    v4_incuSTProj.track('勋章分享', {
                        'unionid': localStorage.wx_uid,
                        '分享类型': '保存图片'
                    });
                    $('#loading').show();
                    if (ua() == 'app') {
                        var bitmap = new plus.nativeObj.Bitmap("test");
                        bitmap.loadBase64Data(url, function() {
                            console.log("加载Base64图片数据成功");
                            var timestamp = (new Date()).getTime();
                            var pic = '_doc/' + timestamp + localStorage.wx_uid + '.png';
                            bitmap.save(pic, {
                                overwrite: true,
                                format: 'png'
                            }, function() {
                                plus.gallery.save(pic, function() {
                                    console.log('保存成功');
                                    plus.nativeUI.toast('图片已保存至相册', { type: 'text' });
                                });
                            }, function(e) {
                                console.log('保存失败', e);
                            });
                        }, function() {
                            console.log('加载Base64图片数据失败：' + JSON.stringify(e));
                        });
                    } else {
                        $('#medal').remove();
                        $('body').append("<div class='mask-black medal-poster' style='z-index: 505;'></div><div id='medal' style='z-index: 507;'><p id='imgUploadX'></p><div hidden><p>已生成勋章海报，长按图片即可保存</p></div></div>");
                        $('#medal div').fadeIn();
                        if (iswx) {
                            $('#medal #imgUploadX').css('top', $('.modal-new-medal').offset().top);
                            $('#medal div').css({
                                'top': $('#medal #imgUploadX').offset().top + $('#medal #imgUploadX').height() - $('#medal div').height() * 4,
                                'z-index': 511
                            });
                        }
                        setTimeout(function() {
                            $('#medal div').fadeOut();
                        }, 1500);
                        eleImgUploadX = document.getElementById('imgUploadX');
                        // 预览
                        eleImgUploadX.innerHTML = '<img src="' + url + '">';
                        $('.medal-poster').click(function() {
                            $('#medal').remove();
                            $(this).remove();
                        });
                    }
                    $('#loading').hide();
                });
                break;

            default:
                break;
        }
        $('#imgUploadX').css('background-color', '#fff');
        e.preventDefault();
        e.stopPropagation();
    });
}

// 删除勋章弹窗dom
function deleteMedalDom(callback) {
    $('#medal_bg').remove(); //海报背景
    $('#medal_star').remove(); //海报的星星
    $('#medal_headimg').remove(); //海报的头像
    $('.modal-new-medal').animate({
        opacity: 0
    }, 'linear', callback);
    $('#medal').remove(); //海报弹窗
    $('.medal-poster').remove(); //背景蒙层
    $('.new-medal-modal').remove();
}

document.addEventListener('page_load', function(event) {
    deleteMedalDom(function() {
        $('.modal-new-medal').remove(); //删除新勋章弹窗
    });
    loadTitle();
});

// 取消 API 相关的统计
// // API 统计
// (function (g) {
//     // 非 APP 环境暂不做统计
//     if (navigator.userAgent.toLowerCase().indexOf('app.ehafo') === -1) return;
//     var xhrProp = g.XMLHttpRequest.prototype;
//     var xhrOpen = xhrProp.open;
//     var xhrSend = xhrProp.send;
//     var xhrSetRequestHeader = xhrProp.setRequestHeader;
//
//     xhrProp.open = function (method, url, _async, user, password) {
//         var xhr = this;
//         var _track = xhr._track = { method: method, url: url, sync: !_async, header:{} };
//         if (!_async) {
//             console.warn('同步请求警告：', method, url);
//         }
//         var postTrackData = function (trackData) {
//             if (sessionStorage.aweaktime) {
//                 var ssawaktime = parseInt(sessionStorage.aweaktime);
//                 if (!isNaN(ssawaktime)) {
//                     trackData.aweaktime = (+new Date()) - ssawaktime;
//                 }
//             }
//             if (url.indexOf('=Track.Index') === -1) {
//                 if (window.yami_incuSTProj != null) {
//                     yami_incuSTProj.track('API_REQUEST', trackData);
//                 }
//             }
//         };
//         xhr.addEventListener('load', function (e) {
//             _track.endTime = +new Date;
//             _track.success = true;
//             _track.status = xhr.status;
//             _track.elapsedTime = _track.endTime - _track.startTime;
//             _track.success = true;
//             // console.log('请求时间：', _track.elapsedTime, 'ms', url);
//             postTrackData({});
//         });
//         xhr.addEventListener('timeout', function (e) {
//             xhr._track.timeout = true;
//             _track.endTime = +new Date;
//             _track.elapsedTime = _track.endTime - _track.startTime;
//             _track.success = false;
//             if (xhr.ignoreTrack) return;
//             postTrackData(_track);
//             console.log('timeout', xhr);
//         });
//         xhr.addEventListener('error', function (e) {
//             xhr._track.error = true;
//             _track.endTime = +new Date;
//             _track.elapsedTime = _track.endTime - _track.startTime;
//             _track.success = false;
//             if (xhr.ignoreTrack) return;
//             postTrackData(_track);
//             console.log('error', xhr);
//         });
//         xhr.addEventListener('abort', function (e) {
//             xhr._track.abort = true;
//             _track.endTime = +new Date;
//             _track.elapsedTime = _track.endTime - _track.startTime;
//             _track.success = false;
//             if (xhr.ignoreTrack) return;
//             postTrackData(_track);
//             console.log('abort', xhr);
//         });
//         return xhrOpen.call(xhr, method, url, _async, user, password);
//     };
//
//     xhrProp.send = function (data) {
//         this._track.startTime = +new Date;
//         this._track.sendData = typeof data === 'string' ? decodeURIComponent(data) : data;
//         return xhrSend.call(this, data);
//     };
//
//     xhrProp.xhrSetRequestHeader = function (header, value) {
//         this._track.header[header] = value;
//         return xhrSetRequestHeader.call(this, header, value);
//     };
// })(window);


var _requestRetryID = null;
var _requestRetryCallback = [];

function showRequestRetryMessage () { return new Promise(function (resolve, reject) {
    if (_requestRetryID == null) {
        var networkType = plus.networkinfo.getCurrentType();
        var msg = '当前移动网络差，建议连接WIFI后再重试';
        if (networkType == 3) {
            msg = '当前WIFI网络差，建议关闭WIFI使用4G网络后再重试';
        } else if (networkType == 1) {
            msg = '当前设备未连接网络，请连接后重试';
        }
        _requestRetryID = layer.open({
            content: msg,
            btn: plus.os.name.toLowerCase() === 'ios'
                ? [['重试', 'color:#0894ec']]
                : [['重试', 'color:#0894ec'], ['取消']],
            shadeClose: false,
            yes: function(index) {
                layer.close(index);
                _requestRetryID = null;
                var callbacks = _requestRetryCallback;
                _requestRetryCallback = [];
                for (var i = 0; i < callbacks.length; i++) {
                    var callback = callbacks[i];
                    callback[0]();
                }
            },
            no: function(index) {
                layer.close(index);
                _requestRetryID = null;
                var callbacks = _requestRetryCallback;
                _requestRetryCallback = [];
                for (var i = 0; i < callbacks.length; i++) {
                    var callback = callbacks[i];
                    callback[1]();
                }
            }
        });
    }
    _requestRetryCallback.push([resolve, reject]);
});}

/** jQuery Ajax 封装入失败重试的功能 */
var _jqrequestOptionKeys = [
    // 重试计数
    'retryCounter',
    // 不做重试处理
    'noretry',
    // 自动重试延迟毫秒数 默认 500 毫秒, 初始值
    'retryDelay',
    // 自动重试延迟计时翻倍
    // 该状态下，重试时间自动翻倍
    'stepDoubleRetryDelay',
    // 翻倍上限值
    'stepDoubleRetryDelayMax',
    // 不显示重试信息
    'noretryMessage',
    // 超时计数
    'timeoutCounter',
    // 连续超时计数
    'consecutiveTimeoutCounter'
];
function jqrequest (opts) {
    var userAgent = navigator.userAgent.toLowerCase();
    if (ua() === 'wx' || opts.noretry === true) {
        // 微信环境
        return new Promise(function (resolve, reject) {
            var option = {};
            for (var key in opts) {
                if (_jqrequestOptionKeys.indexOf(key) === -1) {
                    option[key] = opts[key];
                }
            }
            $.ajax(option).fail(function (xhr, statusText, error) {
                if (error != "") {
                    reject(error);
                } else {
                    reject(statusText);
                }
            }).done(function (data, statusText, xhr) {
                resolve(data);
            });
        });
    } else {
        // 非微信环境
        var counter = opts.retryCounter;
        if (counter == null) {
            counter = 0;
        }
        opts.global = false;
        if (opts.noretryMessage !== true && counter !== 0 && counter % 3 === 0) {
            if (window.isShowTimeout !== true) {
                window.isShowTimeout = true;
//              v4_incuSTProj.track('网络质量差', {
//                  'unionid': localStorage.wx_uid,
//                  'url': opts.url,
//                  'params': opts.data,
//                  'aweaktime': (Date.parse(new Date()) - sessionStorage.aweaktime) / 1000,
//                  'notglobal': true
//              });
            }
            return showRequestRetryMessage().then(function () {
                opts.retryCounter = counter + 1;
                return jqrequest(opts);
            }).catch(function () {
                var ws = plus.webview.getTopWebview();
                plus.webview.close(ws);
                // 取消 API 相关的统计
                // var options = {};
                // for (var key in opts) {
                //     if (typeof opts[key] !== 'function') {
                //         options[key] = opts[key];
                //     } else {
                //         options['fn_' + key] = true;
                //     }
                // }
                // if (window.yami_incuSTProj != null) {
                //     yami_incuSTProj.track('API_REQUEST_EXIT', options);
                // }
            });
        }
        var option = {};
        for (var key in opts) {
            if (_jqrequestOptionKeys.indexOf(key) === -1) {
                option[key] = opts[key];
            }
        }
        if (typeof opts.retryDelay !== 'number') {
            opts.retryDelay = 500;
        }
        return new Promise(function (resolve, reject) {
            // 添加 ignoreTrack 不统计这一部分
            option.xhrFields = { ignoreTrack: true };
            $.ajax(option).fail(function (xhr, statusText, error) {
                if (error === 'timeout') {
                    opts.timeoutCounter = (opts.timeoutCounter || 0) + 1;
                    opts.consecutiveTimeoutCounter = (opts.consecutiveTimeoutCounter || 0) + 1;
                } else {
                    opts.consecutiveTimeoutCounter = 0;
                }
                var delayVal = opts.retryDelay;
                if (opts.stepDoubleRetryDelay === true) {
                    delayVal = delayVal * Math.pow(2, counter);
                    if (opts.stepDoubleRetryDelayMax && delayVal > opts.stepDoubleRetryDelayMax) {
                        delayVal = opts.stepDoubleRetryDelayMax;
                    }
                }
                setTimeout(function () {
                    opts.retryCounter = counter + 1;
                    resolve(jqrequest(opts));
                }, delayVal);
            }).done(function (data, statusText, xhr) {
                resolve(data);
            });
        });
    }
}
