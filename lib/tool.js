/**
 * Created by v_czjzhang on 2018/3/26.
 */
(function(){
    var tool = {
        //��ȡCookie��ֵ
        getCookie:function(name){
            if(document.cookie && document.cookie !== ""){
                var cookie = document.cookie;
                var cookieArr = cookie.split("; "),
                    len = cookieArr.length;
                name = encodeURIComponent(name);
                for(var i=0,tmpArr;i<len;i++){
                    tmpArr = cookieArr[i].split("=");
                    if(name == tmpArr[0]){
                        return decodeURIComponent(tmpArr[1] || "");
                    }
                }
            }
            return null;
        },
        //�첽����css�ļ�
        // loadCss:function(url){
        //     url = ZProtoAdapter.url(url); //����url
        //     $("<link>").attr({
        //         type:"text/css",
        //         rel:"stylesheet",
        //         href:url
        //     }).appendTo("head")
        // },
        //�첽����JS����
        loadScript:function(url){

        },
        //ǳ����
        shallowCopy:function(obj){
            //ֻ��������
            if(typeof obj !== "object") return;
            //����obj�������ж����½�һ�����黹�Ƕ���
            var newObj = obj instanceof Array ? [] : {};
            //����obj�������ж���obj�����Բſ���
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        },
        //���(�ж�����ֵ�����ͣ����Ƕ���ݹ�����������)
        deepCopy:function(obj){
            if(typeof obj !== "object") return;
            var newObj = obj instanceof Array ? [] : {};
            for(var key in obj){
                //�ж��ǲ��Ǳ��������
                if(obj.hasOwnProperty(key)){
                    newObj[key] = typeof obj[key] === "object" ? tool.deepCopy(obj[key]) : obj[key];
                }
            }
            return newObj;
        },
        //javascript����֮new��ģ��ʵ��
        objectFactory:function(){
            var obj = new Object(),
                Constructor = [].shift.call(arguments);
            obj.__proto__ = Constructor.prototype;
            var ret = Constructor.apply(obj,arguments);
            //�жϷ��ص�ֵ�ǲ���һ���������Ƕ���ͷ���������������Ǹ÷���ʲô�ͷ���ʲô
            return typeof ret === "object" ? ret : obj;
        },
        //javascript����֮bind��ģ��ʵ��

    };
    window.tool = tool;
})()