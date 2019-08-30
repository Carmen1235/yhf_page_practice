document.addEventListener('page_load', function(e) { e.target.style.overflow = 'hidden'; });
window.settime1, window.settime2, window.settime3, window.settime4;
window.seeShop = null;
// 当前页增加active
$('body').on('page_loadend', '.page', function(e) {
    $(this).addClass('active');
});
$('body').on('page_unload', '.page', function() {
    $(this).removeClass('active');
});
// 跳转
$('body').on('click', '.page-jump', function() {
    var _target = $(this).attr('data-target');
    var group = RouteStack.currentState().group;
    if (Router.getCurrentURL() == _target) {
        return false;
    }
    // 商城判断
    if ($(this).hasClass('shop_contact_url')) {
        var myDate = new Date();
        var now_day = myDate.getDate();
        var user_click = 0;
        if (isNull(localStorage.help_day) || localStorage.help_day != now_day) {
            user_click = 1;
            localStorage.help_day = now_day;
        }
        localStorage.help_from_page = Router.CurrentRouteState.route.page; //帮助来源页
        localStorage.help_source = 'shop'; //点击帮助来源
        // 统计
        $.post(wxcustomer_domain + '/service_set.php?ac=help_statistic', {
            click_kefu: 1,
            source: 'shop',
            from_page: Router.CurrentRouteState.route.page,
            user_click: user_click
        }, function(ret) {}, 'json');
    }
    if ($(this).hasClass('err_statistic')) {
        if (isNull(sessionStorage.err_statistic)) {
            v4_incuSTProj.track('查看错题', {
                '考试': localStorage.exam_name,
                'VIP': sessionStorage.vip,
                'unionid': localStorage.wx_uid,
                'CID': localStorage.day_cid
            });
            sessionStorage.err_statistic = 1;
        }
        localStorage.setItem('error_msg_' + localStorage.day_cid, 1);
    } else if ($(this).hasClass('difficulty')) {
        if (isNull(sessionStorage.difficulty)) {
            v4_incuSTProj.track('查看难题', {
                '考试': localStorage.exam_name,
                'VIP': sessionStorage.vip,
                'unionid': localStorage.wx_uid,
                'CID': localStorage.day_cid
            });
            sessionStorage.difficulty = 1;
        }
    } else if ($(this).hasClass('elevenIcon')) {
        if (isNull(sessionStorage.elevenIcon)) {
            v4_incuSTProj.track('开屏角标点击', {
                'unionid': localStorage.wx_uid,
                '场景': sessionStorage.scene
            });
            sessionStorage.elevenIcon = 1;
        }
    }
    Router.replace(_target, true, true);
});
// nav
$('body').on('click', '.page-nav', function() {
    var _target = $(this).attr('data-target');
    if (Router.getCurrentURL() == _target) {
        return false;
    }
    Router.replace(_target, false, false);
});
// 点击首页底栏跳转
$('body').on('click', '.page-foot', function() {
    var _target = $(this).attr('data-target');
    if (Router.getCurrentURL() == _target) {
        return false;
    }
    Router.replaceAs(_target, false);
});
// 页面后退
$('body').on('click', '.page-back', function() {
    Router.back();
});
//资料页面底部导航点击资料指向首页且所有浮层去掉
$('body').on('click', '.ziliao-footer .tabbar-item', function() {
    if ($(this).data('backtag') == "doc") {
        Router.replaceAs('#/ziliao/index', false);

        $('.tab-nav').removeClass('none');
        $('.ziliao-footer').removeClass('none');
        $('.searchfunction').addClass('none');
        $('.searchrusult').addClass('none');
        $('#ziliao_index .list-top .search input').val('');
        $('#ziliao_index .list-top .search input').blur();
        $('#ziliao_index .g-scrollview').removeClass('none');
        $('#ziliao_index .g-scrollview .m-tab').removeClass('none');
        $('#ziliao_index .g-scrollview').removeClass('searchview');
        $('#ziliao_index .list-top .right .change').removeClass('none');
        $('#ziliao_index .list-top .right .cancel').addClass('none');

    }
})
$('body').on('click', '.task_lip .i-close', function() {
    local_set('hideIntegral', 1);
    $('.task_lip').addClass('none');
});
$('body').on('click', '.task_lip .task_lip_msg', function() {
    local_set('hideIntegral', 1);
    $('.task_lip').addClass('none');
    Router.replace('#/v4/task', true, true);
});

$('body').on('click', '.every_lip .i-close', function(e) {
    e.stopPropagation();
    local_set('dayup_done', 1);
    $('.every_lip').addClass('none');
});

$('body').on('click', '.page-parziliao .every_lip', function() {
    $('.page-parziliao .every_lip').addClass('none');
    local_set('dayup_done', 1);
    Router.replace('#/v4/index', true, false);
});


//获取用户可获得的积分
function tagShow() {
    if (localStorage.jfshow == 1 || local_today_get('hideIntegral') == 1) {
        $('.new_jftip').addClass('none');
    } else {
        $('.new_jftip').removeClass('none');
    }
    if (local_today_get('hideIntegral') != 1) {
        jqrequest({
            method: 'POST',
            url: api_domain + '/phalapi/public/?service=App.Integral.getUngetIntegral',
            data: { sessionid: localStorage.sessionid },
            dataType: 'json'
        }).then(function(ret) {
            if (ret.code == 0) {
                $('.unget_integral').html(ret.data.unget_integral);
                $('.task_lip').removeClass('none');
            }
        });
    } else {
        $('.task_lip').addClass('none');
    }
}
var _istip = true;

// page_load
window.page_load = function(e) {
    _istip = true;
    var rule = e.detail.route.rule;
    var group = e.detail.group;
    if (group == 'partjob') {
        if (rule == '/money' || rule == '/user' || rule == '/index') {
            $('.page.page-' + group + ' .page-foot[data-target="#/' + group + rule + '"]').addClass('tabbar-active').siblings().removeClass('tabbar-active');
        }
    } else if (group == 'agent') {
        if (rule == '/index' || rule == '/list' || rule == '/agent' || rule == '/user') {
            $('.page.page-' + group + ' .page-foot[data-target="#/' + group + rule + '"]').addClass('tabbar-active').siblings().removeClass('tabbar-active');
        }
    }
}

var double_activiyState = {
    active: false,
    elevenEl: null,
    startTime: 0,
    endTime: 0,
    act_img: '',
    act_name: '',
    share_desc: '',
    share_img: '',
    share_title: '',
    share_url: '',
    tiku_discount: '',
    isClose: false
};

function double_activiyInit() { //初始化
    if (double_activiyState.active == true) {
        return;
    } else {
        double_activiyState.active = true;
        double_activiyState.elevenEl = $('<div class="elevenIcon page-jump none" data-target="#/v4/buy_info"><i class="icon-error-outline none"></i></div>').css({ 'height': '1.2rem', 'width': '1.2rem', 'position': 'fixed', 'z-index': '999', 'right': '.2rem', 'bottom': '2rem', 'background': 'url(/static/images/tiku/new_year.png) no-repeat center center', 'background-size': '100%', });
        // $('i', double_activiyState.elevenEl).after('<div class="dmoney moneyupdown"></div>');
    }
}

function double_activiyTerm() {
    if (double_activiyState.active == false) {
        return;
    } else {
        double_activiyState.active = false;
        double_activiyState.elevenEl.remove();
        double_activiyState.elevenEl = null;
    }
}

function double_activiyShow() {
    localStorage.removeItem('act_status');
    // localStorage.act_status = 1;
    if (double_activiyState.active == false) {
        double_activiyInit();
    }
    if (double_activiyState.isClose == false) {
        double_activiyState.elevenEl.removeClass('none').appendTo('.page.active .g-flexview');
    }
}

function double_activiyHide() {

    if (isNull(activityInfo) || activityInfo.tiku_buy == 1) {
        tagShow();
    }
    localStorage.removeItem('act_status');
    //localStorage.act_status = 1;
    if (double_activiyState.active == true) {
        double_activiyState.elevenEl.addClass('none');
    }
}

window.doubleActivity = { show: double_activiyShow, hide: double_activiyHide };


// function GetActivityTag(cid) {
//     var load_page = Router.CurrentRouteState.route.page;

//     var param = {
//         cid: cid
//     }
//     if (!isNull(localStorage.te_id)) {
//         param.te_id = localStorage.te_id
//     }
//     if (!isNull(activityInfo)) {
//         // if (!isNull(activityInfo) && (isNull(activityInfo.tiku_buy) || activityInfo.tiku_buy == 0)) {
//         // double_activiyShow();
//         $.post(api_domain + '//tiku/daydayup.php?ac=get_activity_tag', param, function(ret) {
//             if (ret.code == 0) {
//                 double_activiyShow();
//                 $('.task_lip').addClass('none');
//                 $('.page.active .elevenIcon').attr('data-target', ret.act_info.jump_url).css({
//                     'background': 'url(' + ret.act_info.tag_pic + ') no-repeat center center',
//                     'background-size': '100% 100%',
//                 });
//                 if (load_page == 'ziliao_view') {
//                     $('#ziliao_view .fix_box .gufen_box').addClass('none');
//                     $('#ziliao_view .elevenIcon').css('right', '0');
//                 }
//                 activityInfo = {
//                     // share_img: 'https:' + ret.act_info.share_img,
//                     share_title: ret.act_info.share_title
//                 }
//             } else {
//                 GetIcon(cid);
//                 // if (RouteStack.currentState().url != '#/v4/index') {
//                 //     double_activiyHide();
//                 // }
//             }
//         }, 'json');
//     } else {
//         // double_activiyHide();
//         GetIcon(cid);
//     }

// }
// ************新春活动注释************
// document.addEventListener('page_loadend', function(e) {
//     if (RouteStack.currentState().url == '#/v4/index') {
//         GetActivityTag(localStorage.day_cid);
//     } else {
//         if (RouteStack.currentState().group == 'chongci' && !isNull(localStorage.day_cid)) {
//             GetActivityTag(localStorage.day_cid);
//         } else if (RouteStack.currentState().group == 'ziliao' && !isNull(localStorage.localcid)) {
//             GetActivityTag(localStorage.localcid);
//         } else {
//             double_activiyHide();
//         }
//     }
// })

// 获取右下角标
function GetIcon(cid) {
    if (sessionStorage.isRequestOpenAd == cid) return false;
    sessionStorage.isRequestOpenAd = cid;
    var load_page = Router.CurrentRouteState.route.page;
    var param = {
        sessionid: localStorage.sessionid,
        cid: cid,
    };
    jqrequest({
        method: 'POST',  // 请求方法
        url: api_domain + '/tiku/daydayup.php?ac=get_tiku_ad',  //  请求 url
        data: param,
        dataType: 'json' // 返回的数据类型
    }).then(function(ret) {
        if (ret.code == 0) {
            if (!isNull(ret.act_info)) {
                activityInfo = {
                    share_img: 'https:' + ret.act_info.share_img,
                    share_title: ret.act_info.share_title
                }
                localStorage.te_id = ret.act_info.te_id;
                if (ret.act_info.is_tag == 1) {
                    $('.task_lip').addClass('none');
                    doubleActivity.show();
                    $('.page.active .elevenIcon').attr('data-target', ret.act_info['jump_url']).css({
                        'background': 'url(' + ret.act_info.tag_pic + ') no-repeat center center',
                        'background-size': '100% 100%',
                    });
                    if (load_page == 'ziliao_view') {
                        $('#ziliao_view .fix_box .gufen_box').addClass('none');
                        $('#ziliao_view .elevenIcon').css('right', '0');
                    }
                }
            } else {
                if (ret.ad_info.icon_show == 1 && (ret.ad_info['location'] == 'all' || ret.ad_info['location'] == ua())) {
                    double_activiyShow();
                    $('.page.active .elevenIcon').attr('data-target', ret.ad_info.url).css({
                        'background': 'url(' + ret.ad_info.icon_img + ') no-repeat center center',
                        'background-size': '100% 100%',
                    });
                    if (load_page == 'ziliao_view') {
                        $('#ziliao_view .fix_box .gufen_box').addClass('none');
                        $('#ziliao_view .elevenIcon').css('right', '.1rem');
                    }
                } else {
                    double_activiyHide();
                }
            }

        }
    });
    // $.post(api_domain + '/tiku/daydayup.php?ac=get_tiku_ad', param, function(ret) {
    //     if (ret.code == 0) {
    //         if (!isNull(ret.act_info)) {
    //             activityInfo = {
    //                 share_img: 'https:' + ret.act_info.share_img,
    //                 share_title: ret.act_info.share_title
    //             }
    //             localStorage.te_id = ret.act_info.te_id;
    //             if (ret.act_info.is_tag == 1) {
    //                 $('.task_lip').addClass('none');
    //                 doubleActivity.show();
    //                 $('.page.active .elevenIcon').attr('data-target', ret.act_info['jump_url']).css({
    //                     'background': 'url(' + ret.act_info.tag_pic + ') no-repeat center center',
    //                     'background-size': '100% 100%',
    //                 });
    //                 if (load_page == 'ziliao_view') {
    //                     $('#ziliao_view .fix_box .gufen_box').addClass('none');
    //                     $('#ziliao_view .elevenIcon').css('right', '0');
    //                 }
    //             }
    //         } else {
    //             if (ret.ad_info.icon_show == 1 && (ret.ad_info['location'] == 'all' || ret.ad_info['location'] == ua())) {
    //                 double_activiyShow();
    //                 $('.page.active .elevenIcon').attr('data-target', ret.ad_info.url).css({
    //                     'background': 'url(' + ret.ad_info.icon_img + ') no-repeat center center',
    //                     'background-size': '100% 100%',
    //                 });
    //                 if (load_page == 'ziliao_view') {
    //                     $('#ziliao_view .fix_box .gufen_box').addClass('none');
    //                     $('#ziliao_view .elevenIcon').css('right', '.1rem');
    //                 }
    //             } else {
    //                 double_activiyHide();
    //             }
    //         }
    //
    //     }
    // }, 'json');
}
document.addEventListener('page_loadend', function(e) {
    var load_page = Router.CurrentRouteState.route.page;
    //---------------------- load_page == 'tiku_index' 题库首页在v4/index.js中进行操作

    if (load_page == 'ziliao_index' || load_page == 'ziliao_view') {
        // GetActivityTag(localStorage.day_cid);
        GetIcon(localStorage.day_cid);
    } else {
        double_activiyHide();
    }
    // if (RouteStack.currentState().group == 'chongci' && !isNull(localStorage.day_cid)) {
    // GetActivityTag(localStorage.day_cid);
    // GetIcon(localStorage.day_cid);

    // 更新用户登录时间
    if (sessionStorage.isActive === undefined) {
        jqrequest({
            noretryMessage: true,
            method: 'POST',  // 请求方法
            url: api_domain + '/phalapi/public/?service=App.User.setActiveState',  //  请求 url
            data: { // post 发送的数据
                sessionid: localStorage.sessionid,
            },
            dataType: 'json' // 返回的数据类型
        }).then(function(ret) {
            sessionStorage.isActive = true;
        });
        // $.post(api_domain + '/phalapi/public/?service=App.User.setActiveState', { sessionid: localStorage.sessionid }, function(ret) {
        //     sessionStorage.isActive = true;
        // }, 'json');
    }
});
document.addEventListener('page_unload', function(e) {
    sessionStorage.gufen_box = 0;
    $('.gufen_module .m-actionsheet').actionSheet('close');


});

$('body').on('click', '.elevenIcon .icon-error-outline', function(event) {
    event.stopPropagation();
    $(this).parent().addClass('none');
    double_activiyState.isClose = true;
    sessionStorage.elevenicon_close = 1;
});

// 估分 start
//查询组合推荐商品
function gufen_get_group_recommend_goods(cid) {
    var gunfen_page = Router.CurrentRouteState.route.page;
    if (sessionStorage.isRequestGufen == cid && localStorage.wx_uid == '1') {
        if (!isNull(sessionStorage.showGufenBox) && gunfen_page == 'ziliao_view') {
            $('#ziliao_view .gufen_box').show();
        }
        return false;
    }
    sessionStorage.isRequestGufen = cid;
    jqrequest({
        method: 'POST',  // 请求方法
        url: api_domain + '/shop/goods.php?ac=group_recommend_goods',  //  请求 url
        data: { // post 发送的数据
            sessionid: localStorage.sessionid,
            cid: cid
        },
        dataType: 'json' // 返回的数据类型
    }).then(function(ret) {
        if (ret.code == 0) {
            sessionStorage.showGufenBox = 1;
            //显示推荐按钮
            $('.gufen_module .exam_name').text(ret.exam_name);
            $('.gufen_module .first_foot .item:first .left').text(ret.year + '年' + ret.exam_name + '通过率')
            // $('.gufen_module .second_foot .group_name').text(ret.group_name);
            var goods_html = '';
            var total_buy_num = 0;
            for (var j in ret.return_data) {

                var goods_info = ret['return_data'][j];
                if (j == 0) {
                    if (isNull(goods_info['pic'])) {
                        goods_info['pic'] = imgcdn_domain + '/wx/images/100624729_100.png';
                    }
                    localStorage.shop_goodsid = goods_info['id'];
                    model_token = goods_info['token'];
                    $('.gufen_module .topay').attr('data-share_title', goods_info['phone_name']);
                    $('.gufen_module .topay').attr('data-img_url', 'http:' + goods_info['pic']);
                    $('.gufen_module .topay').attr('data-share_price', goods_info['price']);
                }
                localStorage.shop_cid = goods_info['cid'];
                var sale_price = parseFloat(goods_info['price']) + parseFloat(goods_info['share_price']);
                var presellHtml = '';
                if (goods_info['ispresell'] == 1) {
                    presellHtml = '<img class="saling" src="/static/images/tiku/saling.png">';
                }

                var tags_html = '';
                if (!isNull(goods_info.tag_list)) {
                    for (var k in goods_info.tag_list) {
                        tags_html += '<span>' + goods_info.tag_list[k] + '</span>';
                    }
                }
                var img_name = ''
                if (goods_info.mid == '1') {
                    img_name = 'goods';
                } else if (goods_info.mid == '2') {
                    img_name = 'exam';
                } else if (goods_info.mid == '3') {
                    img_name = 'tiku';
                } else if (goods_info.mid == '6') {
                    img_name = 'ebook';
                }
                goods_html +=
                    // '<li data-price="' + goods_info['price'] + '" data-id="' + goods_info['id'] + '" data-mid="' + goods_info['mid'] + '" class="select-box good-box id_box-' + goods_info['id'] + '">' +
                    // '<div class="good">' +
                    // '<i class="choose check checked"></i>' +
                    // '<div class="info">' +
                    // '<div class="name">' + presellHtml + goods_info['name'] + remark_html + '</div>' +
                    // '<div class="price">' +
                    // '<p>' +
                    // '<span>原价：</span>' +
                    // '<span class="id_price-' + goods_info['id'] + '">￥' + sale_price + '</span>' +
                    // '<span class="price_name">限时特价：</span>' +
                    // '<span class="id_share-price-' + goods_info['id'] + ' gold">￥' + goods_info['price'] + '</span>' +
                    // '<span class="gray">已售：' + goods_info['buy_nums'] + '件</span>' +
                    // '</p>' +
                    // '</div>' +
                    // '</div>' +
                    // '</div>' +
                    '<li data-price="' + goods_info['price'] + '" data-id="' + goods_info['id'] + '" data-mid="' + goods_info['mid'] + '" class="select-box good-box id_box-' + goods_info['id'] + '">' +
                    '<div class="good">' +
                    '    <i class="choose check checked"></i>' +
                    '    <div class="info">' +
                    '        <div class="info_main">' +
                    '            <div class="info_img"><img src="/static/images/tiku/gufen_' + img_name + '.png" alt=""></div>' +
                    '            <div class="info_goods">' +
                    '                <div class="name">' + presellHtml + goods_info['name'] + '</div>' +
                    '                <div class="tags flex">' + tags_html +
                    '                </div>' +
                    '                <div class="price"><p><span class="price_name"></span><span class="id_share-price-' + goods_info['id'] + ' red bold price_sale">￥' + goods_info['price'] + '</span><span class="line-th"><span>原价：</span><span class="id_price-' + goods_info['id'] + '">￥' + sale_price + '</span></span></p></div>' +
                    '                <div class="nums"><span class="gray">已售：' + goods_info['buy_nums'] + '</span></div>' +
                    '            </div>' +
                    '        </div>' + (!isNull(goods_info.remark) ? '<div class="remark red">' + goods_info.remark + '</div> ' : '') +
                    '    </div>' +
                    '</div>';

                total_buy_num += parseInt(goods_info['buy_nums']);
                if (!isNull(goods_info['subgoods'])) {
                    //自营视频不展示子商品
                    if (goods_info['mid'] != 4 || goods_info['isthird'] == 1) {
                        goods_html += '<div class="sku-box"><div class="sku">';
                        for (var i in goods_info['subgoods']['goods']) {
                            var sub_info = goods_info['subgoods']['goods'][i];
                            var sub_i_class = '';
                            if (sub_info['ischeck'] == 1) {
                                sub_i_class = 'checked';
                            }
                            goods_html += '<div><i class="check ' + sub_i_class + '" data-subid="' + sub_info['subid'] + '"></i><span>' + sub_info['title'] + '</span></div>';
                        }
                        goods_html += '</div></div>';
                    }
                }
                goods_html += '</li>';
            }
            jqrequest({
                method: 'POST',  // 请求方法
                url: api_domain + '/phalapi/public/?service=App.Daily.getIntelligentInfo',  //  请求 url
                data: { // post 发送的数据
                    sessionid: localStorage.sessionid,
                    cid: cid
                },
                dataType: 'json' // 返回的数据类型
            }).then(function(res) {
                if (res.code == 0) {
                    $('.gufen_module .second_foot .do_nums').text(res.data.do_num);
                    $('.gufen_module .second_foot .score').text(res.data.score);
                    $('.gufen_module .second_foot .up_percent').text((res.data.up_percent * 100).toFixed(2) + '%');
                    $('.gufen_module .second_foot .guss_percent').text((res.data.guss_percent * 100).toFixed(2) + '%');
                    $('.gufen_module .final_percent').text((res.data.final_percent * 100).toFixed(2) + '%');
                }
            });
            // $.post(api_domain + '/phalapi/public/?service=App.Daily.getIntelligentInfo', { sessionid: localStorage.sessionid, cid: cid }, function(res) {
            //     if (res.code == 0) {
            //         $('.gufen_module .second_foot .do_nums').text(res.data.do_num);
            //         $('.gufen_module .second_foot .score').text(res.data.score);
            //         $('.gufen_module .second_foot .up_percent').text((res.data.up_percent * 100).toFixed(2) + '%');
            //         $('.gufen_module .second_foot .guss_percent').text((res.data.guss_percent * 100).toFixed(2) + '%');
            //         $('.gufen_module .final_percent').text((res.data.final_percent * 100).toFixed(2) + '%');
            //     }
            // }, 'json');
            $('.gufen_module .group_recommend_goods').html(goods_html);
            $('.gufen_module .total_buy_num').text(total_buy_num);
            if (gunfen_page == 'tiku_day_parsing') {
                $('#tiku_day_parsing .gufen_ad').removeClass('none');
            } else if (gunfen_page == 'shop_index') {
                $('#shop_index .gufen_box').removeClass('none');
                $('#shop_index .gufen_box').show();
            } else if (gunfen_page == 'ziliao_view') {
                if ($('#ziliao_view .elevenIcon').length == 0) {
                    $('#ziliao_view .gufen_box').removeClass('none');
                }
                $('#ziliao_view .gufen_box').show();
            }
            gufen_get_goods_sum();
            window.gufen_goods = 2;
        } else {
            delete sessionStorage.showGufenBox;
            if (gunfen_page == 'tiku_day_parsing') {
                $('#tiku_day_parsing .gufen_ad').addClass('none');
            } else if (gunfen_page == 'shop_index') {
                $('#shop_index .gufen_box').addClass('none');
                $('#shop_index .gufen_box').hide();
            } else if (gunfen_page == 'ziliao_view') {
                $('#ziliao_view .gufen_box').addClass('none');
                $('#ziliao_view .gufen_box').hide();
            } else if (gunfen_page == 'tiku_question' || gunfen_page == 'tiku_cuoti' || gunfen_page == 'tiku_timu') {
                window.gufen_goods = 1;
            }

            //隐藏推荐按钮
            $('.gufen_module .group_recommend_goods').html('');
        }
    });
    // $.post(api_domain + '/shop/goods.php?ac=group_recommend_goods', { sessionid: localStorage.sessionid, cid: cid }, function(ret) {
    //     if (ret.code == 0) {
    //         sessionStorage.showGufenBox = 1;
    //         //显示推荐按钮
    //         $('.gufen_module .exam_name').text(ret.exam_name);
    //         $('.gufen_module .first_foot .item:first .left').text(ret.year + '年' + ret.exam_name + '通过率')
    //             // $('.gufen_module .second_foot .group_name').text(ret.group_name);
    //         var goods_html = '';
    //         var total_buy_num = 0;
    //         for (var j in ret.return_data) {
    //
    //             var goods_info = ret['return_data'][j];
    //             if (j == 0) {
    //                 if (isNull(goods_info['pic'])) {
    //                     goods_info['pic'] = imgcdn_domain + '/wx/images/100624729_100.png';
    //                 }
    //                 localStorage.shop_goodsid = goods_info['id'];
    //                 model_token = goods_info['token'];
    //                 $('.gufen_module .topay').attr('data-share_title', goods_info['phone_name']);
    //                 $('.gufen_module .topay').attr('data-img_url', 'http:' + goods_info['pic']);
    //                 $('.gufen_module .topay').attr('data-share_price', goods_info['price']);
    //             }
    //             localStorage.shop_cid = goods_info['cid'];
    //             var sale_price = parseFloat(goods_info['price']) + parseFloat(goods_info['share_price']);
    //             var presellHtml = '';
    //             if (goods_info['ispresell'] == 1) {
    //                 presellHtml = '<img class="saling" src="/static/images/tiku/saling.png">';
    //             }
    //
    //             var tags_html = '';
    //             if (!isNull(goods_info.tag_list)) {
    //                 for (var k in goods_info.tag_list) {
    //                     tags_html += '<span>' + goods_info.tag_list[k] + '</span>';
    //                 }
    //             }
    //             var img_name = ''
    //             if (goods_info.mid == '1') {
    //                 img_name = 'goods';
    //             } else if (goods_info.mid == '2') {
    //                 img_name = 'exam';
    //             } else if (goods_info.mid == '3') {
    //                 img_name = 'tiku';
    //             } else if (goods_info.mid == '6') {
    //                 img_name = 'ebook';
    //             }
    //             goods_html +=
    //                 // '<li data-price="' + goods_info['price'] + '" data-id="' + goods_info['id'] + '" data-mid="' + goods_info['mid'] + '" class="select-box good-box id_box-' + goods_info['id'] + '">' +
    //                 // '<div class="good">' +
    //                 // '<i class="choose check checked"></i>' +
    //                 // '<div class="info">' +
    //                 // '<div class="name">' + presellHtml + goods_info['name'] + remark_html + '</div>' +
    //                 // '<div class="price">' +
    //                 // '<p>' +
    //                 // '<span>原价：</span>' +
    //                 // '<span class="id_price-' + goods_info['id'] + '">￥' + sale_price + '</span>' +
    //                 // '<span class="price_name">限时特价：</span>' +
    //                 // '<span class="id_share-price-' + goods_info['id'] + ' gold">￥' + goods_info['price'] + '</span>' +
    //                 // '<span class="gray">已售：' + goods_info['buy_nums'] + '件</span>' +
    //                 // '</p>' +
    //                 // '</div>' +
    //                 // '</div>' +
    //                 // '</div>' +
    //                 '<li data-price="' + goods_info['price'] + '" data-id="' + goods_info['id'] + '" data-mid="' + goods_info['mid'] + '" class="select-box good-box id_box-' + goods_info['id'] + '">' +
    //                 '<div class="good">' +
    //                 '    <i class="choose check checked"></i>' +
    //                 '    <div class="info">' +
    //                 '        <div class="info_main">' +
    //                 '            <div class="info_img"><img src="/static/images/tiku/gufen_' + img_name + '.png" alt=""></div>' +
    //                 '            <div class="info_goods">' +
    //                 '                <div class="name">' + presellHtml + goods_info['name'] + '</div>' +
    //                 '                <div class="tags flex">' + tags_html +
    //                 '                </div>' +
    //                 '                <div class="price"><p><span class="price_name"></span><span class="id_share-price-' + goods_info['id'] + ' red bold price_sale">￥' + goods_info['price'] + '</span><span class="line-th"><span>原价：</span><span class="id_price-' + goods_info['id'] + '">￥' + sale_price + '</span></span></p></div>' +
    //                 '                <div class="nums"><span class="gray">已售：' + goods_info['buy_nums'] + '</span></div>' +
    //                 '            </div>' +
    //                 '        </div>' + (!isNull(goods_info.remark) ? '<div class="remark red">' + goods_info.remark + '</div> ' : '') +
    //                 '    </div>' +
    //                 '</div>';
    //
    //             total_buy_num += parseInt(goods_info['buy_nums']);
    //             if (!isNull(goods_info['subgoods'])) {
    //                 //自营视频不展示子商品
    //                 if (goods_info['mid'] != 4 || goods_info['isthird'] == 1) {
    //                     goods_html += '<div class="sku-box"><div class="sku">';
    //                     for (var i in goods_info['subgoods']['goods']) {
    //                         var sub_info = goods_info['subgoods']['goods'][i];
    //                         var sub_i_class = '';
    //                         if (sub_info['ischeck'] == 1) {
    //                             sub_i_class = 'checked';
    //                         }
    //                         goods_html += '<div><i class="check ' + sub_i_class + '" data-subid="' + sub_info['subid'] + '"></i><span>' + sub_info['title'] + '</span></div>';
    //                     }
    //                     goods_html += '</div></div>';
    //                 }
    //             }
    //             goods_html += '</li>';
    //         }
    //         $.post(api_domain + '/phalapi/public/?service=App.Daily.getIntelligentInfo', { sessionid: localStorage.sessionid, cid: cid }, function(res) {
    //             if (res.code == 0) {
    //                 $('.gufen_module .second_foot .do_nums').text(res.data.do_num);
    //                 $('.gufen_module .second_foot .score').text(res.data.score);
    //                 $('.gufen_module .second_foot .up_percent').text((res.data.up_percent * 100).toFixed(2) + '%');
    //                 $('.gufen_module .second_foot .guss_percent').text((res.data.guss_percent * 100).toFixed(2) + '%');
    //                 $('.gufen_module .final_percent').text((res.data.final_percent * 100).toFixed(2) + '%');
    //             }
    //         }, 'json');
    //         $('.gufen_module .group_recommend_goods').html(goods_html);
    //         $('.gufen_module .total_buy_num').text(total_buy_num);
    //         if (gunfen_page == 'tiku_day_parsing') {
    //             $('#tiku_day_parsing .gufen_ad').removeClass('none');
    //         } else if (gunfen_page == 'shop_index') {
    //             $('#shop_index .gufen_box').removeClass('none');
    //             $('#shop_index .gufen_box').show();
    //         } else if (gunfen_page == 'ziliao_view') {
    //             if ($('#ziliao_view .elevenIcon').length == 0) {
    //                 $('#ziliao_view .gufen_box').removeClass('none');
    //             }
    //             $('#ziliao_view .gufen_box').show();
    //         }
    //         gufen_get_goods_sum();
    //         window.gufen_goods = 2;
    //     } else {
    //         delete sessionStorage.showGufenBox;
    //         if (gunfen_page == 'tiku_day_parsing') {
    //             $('#tiku_day_parsing .gufen_ad').addClass('none');
    //         } else if (gunfen_page == 'shop_index') {
    //             $('#shop_index .gufen_box').addClass('none');
    //             $('#shop_index .gufen_box').hide();
    //         } else if (gunfen_page == 'ziliao_view') {
    //             $('#ziliao_view .gufen_box').addClass('none');
    //             $('#ziliao_view .gufen_box').hide();
    //         } else if (gunfen_page == 'tiku_question' || gunfen_page == 'tiku_cuoti' || gunfen_page == 'tiku_timu') {
    //             window.gufen_goods = 1;
    //         }
    //
    //         //隐藏推荐按钮
    //         $('.gufen_module .group_recommend_goods').html('');
    //     }
    // }, 'json');
}

//计算组合商品总价
function gufen_get_goods_sum() {
    var goods = {};
    $('.gufen_module .choose').each(function() {
        var _this = $(this);
        if (_this.hasClass('checked') == true) {
            var subid = [];
            var id = _this.parents('.good-box').data('id');
            var mid = _this.parents('.good-box').data('mid');
            goods[id] = {};
            goods[id]['id'] = id;
            goods[id]['nums'] = 1;
            $(".sku div", _this.parents('.good-box')).each(function() {
                if ($('i', this).hasClass('checked') == true) {
                    subid.push($('i', this).attr('data-subid'));
                }
                goods[id]['subid'] = subid;
            });
        }
    });

    localStorage.goods = JSON.stringify(goods);
    jqrequest({
        method: 'POST',  // 请求方法
        url: api_domain + '/shop/goods_v4.php?ac=sumSharePrice',  //  请求 url
        data: { // post 发送的数据
            goods: JSON.stringify(goods),
            cid: localStorage.shop_cid,
            sessionid: localStorage.sessionid,
        },
        dataType: 'json' // 返回的数据类型
    }).then(function(ret) {
        if (ret.code == 0) {
            var sale = parseInt(ret.data.price.total_price) - parseInt(ret.data.price.total_price_sale);
            $('.gufen_module .sale_price .red').text('¥' + ret.data.price.total_price_sale);
            $('.gufen_module .price .orinal_price').text('¥' + ret.data.price.total_price);
            $('.gufen_module .sale_shop .topay').data('total_price', ret.data.price.total_price);
            $('.gufen_module .sale_shop .topay').data('total_sale_price', ret.data.price.total_price_sale);
            if (ret.data.price.total_price_sale > 0) {
                $('.gufen_module .topay').removeClass('disabled');
            } else {
                $('.gufen_module .topay').addClass('disabled');
            }
            for (var i in ret.data.goods) {
                for (var j in ret.data.goods[i]) {
                    var cur = ret.data.goods[i][j];
                    $('.gufen_module .id_price-' + cur.id).text('￥' + cur.price);
                    $('.gufen_module .id_share-price-' + cur.id).text('￥' + cur.price_sale);
                }
            };
        } else if (ret.code == 4001) {
            layer.open({
                content: '<p class="text-center">您选择的商品参数异常，请返回重新选择</p>',
                btn: [
                    ['知道了', 'color:#0894ec']
                ],
                yes: function(index) {
                    layer.close(index);
                    var gufen_url_param = JSON.parse(sessionStorage.gufen_url_param);
                    set_global_param(gufen_url_param, '#/shop/index', 0);
                }
            });
        }
    });
    // $.post(api_domain + '/shop/goods_v4.php?ac=sumSharePrice', {
    //     goods: JSON.stringify(goods),
    //     cid: localStorage.shop_cid,
    //     sessionid: localStorage.sessionid,
    // }, function(ret) {
    //     if (ret.code == 0) {
    //         var sale = parseInt(ret.data.price.total_price) - parseInt(ret.data.price.total_price_sale);
    //         $('.gufen_module .sale_price .red').text('¥' + ret.data.price.total_price_sale);
    //         $('.gufen_module .price .orinal_price').text('¥' + ret.data.price.total_price);
    //         $('.gufen_module .sale_shop .topay').data('total_price', ret.data.price.total_price);
    //         $('.gufen_module .sale_shop .topay').data('total_sale_price', ret.data.price.total_price_sale);
    //         if (ret.data.price.total_price_sale > 0) {
    //             $('.gufen_module .topay').removeClass('disabled');
    //         } else {
    //             $('.gufen_module .topay').addClass('disabled');
    //         }
    //         for (var i in ret.data.goods) {
    //             for (var j in ret.data.goods[i]) {
    //                 var cur = ret.data.goods[i][j];
    //                 $('.gufen_module .id_price-' + cur.id).text('￥' + cur.price);
    //                 $('.gufen_module .id_share-price-' + cur.id).text('￥' + cur.price_sale);
    //             }
    //         };
    //     } else if (ret.code == 4001) {
    //         layer.open({
    //             content: '<p class="text-center">您选择的商品参数异常，请返回重新选择</p>',
    //             btn: [
    //                 ['知道了', 'color:#0894ec']
    //             ],
    //             yes: function(index) {
    //                 layer.close(index);
    //                 var gufen_url_param = JSON.parse(sessionStorage.gufen_url_param);
    //                 set_global_param(gufen_url_param, '#/shop/index', 0);
    //             }
    //         });
    //     }
    // }, 'json');
}

function gufen_showText(item, item_nums) {
    $(item[item_nums]).addClass('active').find('.right').text('分析中');
    window.settime3 = setTimeout(function() {
        $(item[item_nums]).removeClass('active').find('.right').html('<i class="icon-checkoff"></i>');
        item_nums++;
        if (item_nums < '5') {
            gufen_showText(item, item_nums);
        } else {
            $('.gufen_module .first_foot').actionSheet('close');
            $('.gufen_module .second_foot').actionSheet('open');
            window.settime4 = setTimeout(function() {
                $('.gufen_module .second_foot .middle').addClass('offset');
            }, 300);
        }
    }, 900);
}
// 监听估分弹窗状态
$('.gufen_module .m-actionsheet').on('open.ydui.actionsheet', function() {
    console.log('打开了');
}).on('close.ydui.actionsheet', function() {
    clearTimeout(window.settime1);
    clearTimeout(window.settime2);
    clearTimeout(window.settime3);
    clearTimeout(window.settime4);
    $('.gufen_module .first_foot .gufen_img').attr('src', '');
    $('.gufen_module .first_foot .head').removeClass('scaleDraw');
    $('.gufen_module .first_foot .foot,.gufen_module .second_foot .middle').removeClass('offset');
    $('.gufen_module .first_foot .item').find('.right').html('待分析');
    setTimeout(function() {
        $('.gufen_module .first_foot .item:first').addClass('active').siblings().removeClass('active');
    }, 300);
});
// 查看提升建议
$('body').on('click', '.gufen_module .second_foot .see_btn', function() {
    sessionStorage.gufen_box = 1;
    $('.gufen_module .second_foot').actionSheet('close');
    $('.gufen_module .sale_shop').actionSheet('open');
    shop_incuSTProj.track('查看建议', {
        'CID': localStorage.shop_cid,
        '来源': sessionStorage.channel,
        '来源级别': channel_level,
        'unionid': localStorage.wx_uid
    }, true);
});
//关闭估分面板
$('body').on('touchend', '.gufen_module .m-actionsheet .tops_box', function() {
    $('.gufen_module .m-actionsheet').actionSheet('close');
});

$('body').on('click', '.gufen_module li.good-box .choose.check', function() {
    var _this = $(this)
    var id = $(this).parent().parent().attr('data-id');
    $('.choose', '.gufen_module .id_box-' + id).toggleClass('checked');
    $('.gufen_module .id_li-' + id).attr('style', 'display:-webkit-box;');
    if (!$('.choose', '.gufen_module .id_box-' + id).hasClass('checked')) {
        _this.parents('li').find('.sku div .check').removeClass('checked');
        if (_this.parents('li').find('.sku-box').length == 1) {
            $('.gufen_module .id_price-' + id).text('￥0');
            $('.gufen_module .id_share-price-' + id).text('￥0');
        }
    }
    gufen_get_goods_sum();
});
//sku选择
$('body').on('click', '.gufen_module .sku div', function() {
    var _this = $(this).parent();
    var _li = $(this).parents('li');
    var _choose = _li.find('.choose');
    $(this).find('i').toggleClass('checked');
    var id = _li.attr('data-id');
    var nums = 0;
    $("div", _this).each(function() {
        if ($('i', this).hasClass('checked') == true) {
            nums++;
        }
    });
    if (nums > 0) {
        _choose.addClass('checked');
    } else {
        $('.gufen_module .id_price-' + id).text('￥0');
        $('.gufen_module .id_share-price-' + id).text('￥0');
        _choose.removeClass('checked');
    }
    gufen_get_goods_sum();
});
// 点击标题跳转
$('body').on('click', '.gufen_module .sale_shop .name', function() {
    window.seeShop = 1;
    Router.replace('#/shop/goods/id-' + $(this).parents('li').attr('data-id'), true, true);
});
// 去结算
$('body').on('click', '.gufen_module .sale_shop .topay', function() {
    delete localStorage.shop_is_tying
    var gufen_url_param = JSON.parse(sessionStorage.gufen_url_param);
    var _this = $(this);
    window.isbuy = true;

    if ($(this).hasClass('disabled') == false) {
        var _goods = JSON.parse(localStorage.goods);
        for (var i in _goods) {
            if (_goods[i]['subid'] != undefined && _goods[i]['subid'].length == 0) {
                layer.open({
                    content: '<p class="text-center">您的订单商品含有多个科目，请选择了其中一科或多科再进行结算。</p>',
                    btn: [
                        ['知道了', 'color:#0894ec']
                    ],
                    yes: function(index) {
                        layer.close(index);
                        // set_global_param(url_param, '#/shop/index', 0);
                    }
                });
                return;
            }
            if (_goods[i]['subid'] != undefined && _goods[i]['subid'].length == 1 && _istip == true) {
                _istip = false;
                layer.open({
                    content: '<p class="text-center">您的订单商品含有多个科目，您仅选择了其中一科，请确认。</p>',
                    btn: [
                        ['知道了', 'color:#0894ec'],
                        ['确认只买单科'],
                    ],
                    yes: function(index) {
                        layer.close(index);
                    },
                    no: function() {
                        $('.gufen_module .sale_shop .topay').click();
                    }
                });
                return;
            }
        };
        var next_url = '#/shop/pay/id-' + localStorage.shop_goodsid + '/channelid-' + gufen_url_param['channelid'];
        Router.replace(next_url + '/isshare-1', true, true);
    } else {
        layer.open({
            content: '<p class="text-center">您的订单商品含有多个科目，请选择了其中一科或多科再进行结算。</p>',
            btn: [
                ['知道了', 'color:#0894ec']
            ],
            yes: function(index) {
                layer.close(index);
            }
        });
        return false;
    }
});
// 估分 end

// 输入框失去焦点，页面回弹
$('body').on('blur', 'input, textarea', function() {
    // 滚动到顶部
    window.scroll(0, 0);
    // 滚动到底部
    window.scrollTo(0, document.documentElement.clientHeight);
});