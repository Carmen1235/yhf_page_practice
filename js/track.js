// 启动统计对象 传入项目 ID
(function() {
    // v4&exam
    window.v4_trackId = '2';
    //window.v4_incuSTProj = new IncuSTProj(v4_trackId);
    // shop
    window.shop_trackId = '3';
    //window.shop_incuSTProj = new IncuSTProj(shop_trackId);
    // ziliao
    window.ziliao_trackId = '5';
    //window.ziliao_incuSTProj = new IncuSTProj(ziliao_trackId);

    window.yami_trackId = '4';
    //window.yami_incuSTProj = new IncuSTProj(yami_trackId);

    window.chongci_trackId = '6';
    //window.chongci_incuSTProj = new IncuSTProj(chongci_trackId);

    // 配置统计服务器的地址
    //IncuSTProj.setIncuSTServer(api_domain + '/phalapi/public/?s=Track.Index');

    // 路由环境页面浏览统计
    document.addEventListener('page_load', function(e) {
        var _group = Router.CurrentRouteState.group;
        var today = getTodayDate();
        if (_group == 'v4' || _group == 'exam') {
            if (localStorage.wx_uid !== undefined && (localStorage.track_v4 === undefined || localStorage.track_v4 != today)) {
                localStorage.track_v4 = today;
//              v4_incuSTProj.track('uv', {
//                  'unionid': localStorage.wx_uid
//              });
            }
        } else if (_group == 'shop' || _group == 'video' || _group == 'seller') {
            if (localStorage.wx_uid !== undefined && (localStorage.track_shop === undefined || localStorage.track_shop != today)) {
                localStorage.track_shop = today;
//              shop_incuSTProj.track('uv', {
//                  'unionid': localStorage.wx_uid
//              });
            }
        } else if (_group == 'ziliao') {
            if (localStorage.wx_uid !== undefined && (localStorage.track_ziliao === undefined || localStorage.track_ziliao != today)) {
                localStorage.track_ziliao = today;
//              ziliao_incuSTProj.track('uv', {
//                  'unionid': localStorage.wx_uid
//              });

            }
        } else if (_group == 'chongci') {
            if (localStorage.wx_uid !== undefined && (localStorage.track_chongci === undefined || localStorage.track_chongci != today)) {
                localStorage.track_chongci = today;
//              chongci_incuSTProj.track('uv', {
//                  'unionid': localStorage.wx_uid
//              });
            }
        } else if (_group == 'yami') {
            if (localStorage.wx_uid !== undefined && (localStorage.track_yami === undefined || localStorage.track_yami != today)) {
                localStorage.track_yami = today;
//              yami_incuSTProj.track('uv', {
//                  'unionid': localStorage.wx_uid
//              });
            }
        }
    });
})();