/**
 * Created by v_czjzhang on 2018/3/26.
 */
(function(){
    var tool = {
        //获取Cookie的值
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
        //异步加载css文件
        // loadCss:function(url){
        //     url = ZProtoAdapter.url(url); //适配url
        //     $("<link>").attr({
        //         type:"text/css",
        //         rel:"stylesheet",
        //         href:url
        //     }).appendTo("head")
        // },
        //异步加载JS代码
        loadScript:function(url){

        },
        //浅拷贝
        shallowCopy:function(obj){
            //只拷贝对象
            if(typeof obj !== "object") return;
            //根据obj的类型判断是新建一个数组还是对象
            var newObj = obj instanceof Array ? [] : {};
            //遍历obj，并且判断是obj的属性才拷贝
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        },
        //深拷贝(判断属性值的类型，若是对象递归调用深拷贝函数)
        deepCopy:function(obj){
            if(typeof obj !== "object") return;
            var newObj = obj instanceof Array ? [] : {};
            for(var key in obj){
                //判断是不是本身的属性
                if(obj.hasOwnProperty(key)){
                    newObj[key] = typeof obj[key] === "object" ? tool.deepCopy(obj[key]) : obj[key];
                }
            }
            return newObj;
        },
        //javascript深入之new的模拟实现
        objectFactory:function(){
            var obj = new Object(),
                Constructor = [].shift.call(arguments);
            obj.__proto__ = Constructor.prototype;
            var ret = Constructor.apply(obj,arguments);
            //判断返回的值是不是一个对象。若是对象就返回这个对象，若不是该返回什么就返回什么
            return typeof ret === "object" ? ret : obj;
        },
        //javascript深入之bind的模拟实现

    };
    window.tool = tool;
})()