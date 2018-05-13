/**
 * Created by v_czjzhang on 2018/3/27.
 */
//�¼������󶨺���
var bind = function(ele,eventType,callback){
    if(ele.addEventListener){
        //W3c��׼д��
        return ele.addEventListener(eventType,callback,false);
    }else if(ele.attachEvent){
        //����IE6-8
        return ele.attachEvent("on"+eventType,callback);
    }else{
        //����IE5-
        return ele["on"+eventType] = callback;
    }
}

//�¼����������
var unbind = function (ele,eventType,callback) {
    if(ele.removeEventListener){
        //W3C��׼д��
        return ele.removeEventListener(eventType,callback,false);
    }else if(ele.detachEvent){
        //����IE6-8
        return ele.detachEvent(eventType,callback);
    }else{
        //����IE5-
        return ele["on"+eventType] = null;
    }
}

//ȡ��Ĭ���¼�����
function cancelEvent(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{
        //����IE6-8
        event.returnValue = false;
    }
}

//��ֹð���¼�
function stopPropagation(event){
    if(event.stopPropagation){
        return event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
}

//��ȡ�����¼�
function keyCode(e){
    var e = e || window.event;
    var key = e.keyCode || e.charCode;
    return key;
}