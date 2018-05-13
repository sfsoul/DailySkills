/**
 * Created by v_czjzhang on 2018/3/27.
 */
//事件监听绑定函数
var bind = function(ele,eventType,callback){
    if(ele.addEventListener){
        //W3c标准写法
        return ele.addEventListener(eventType,callback,false);
    }else if(ele.attachEvent){
        //兼容IE6-8
        return ele.attachEvent("on"+eventType,callback);
    }else{
        //兼容IE5-
        return ele["on"+eventType] = callback;
    }
}

//事件监听解绑函数
var unbind = function (ele,eventType,callback) {
    if(ele.removeEventListener){
        //W3C标准写法
        return ele.removeEventListener(eventType,callback,false);
    }else if(ele.detachEvent){
        //兼容IE6-8
        return ele.detachEvent(eventType,callback);
    }else{
        //兼容IE5-
        return ele["on"+eventType] = null;
    }
}

//取消默认事件发生
function cancelEvent(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{
        //兼容IE6-8
        event.returnValue = false;
    }
}

//禁止冒泡事件
function stopPropagation(event){
    if(event.stopPropagation){
        return event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
}

//获取键盘事件
function keyCode(e){
    var e = e || window.event;
    var key = e.keyCode || e.charCode;
    return key;
}