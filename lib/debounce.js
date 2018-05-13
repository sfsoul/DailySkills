
/*
    防抖原理(debounce)：你尽管触发事件，但是我一定在事件触发n秒后才执行，若你在一个事件触发的n秒内又触发了这个事件，那就以新的事件的时间为准，
    n秒后才执行。总之，就是要等你触发完事件n秒内不再触发事件，才执行对应事件方法。
 */
var count = 1;
var boxDom = document.getElementById("box");
// boxDom.addEventListener("mousemove",getUserAction,false);
boxDom.addEventListener("mousemove",debounce(getUserAction,2000,true),false);
function getUserAction(e){
    console.log(this); //指向box对象s
    console.log(e);
    boxDom.innerHTML = count++;
}

function debounce(func,delayTime,immediate) {
    var timer,result;

    return function(){
        //修改this指向问题
        var that = this;
        //event对象
        var args = arguments;
        if(timer) clearTimeout(timer);
        if(immediate){
            //如果已经执行过，不再执行
            var callNow = !timer;
            timer = setTimeout(function(){
                timer = null;
            },delayTime)
            if(callNow) result = func.apply(that,args)
        }else{
            timer = setTimeout(function(){
                result = func.apply(that,args);
            },delayTime);
        }
        return result;
    }
}