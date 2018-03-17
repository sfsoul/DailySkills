[TOC]

### v-for -- 列表渲染

用`v-for`指令根据一组数组的选项列表进行渲染。`v-for`指令需要使用`item in items`形式的特殊语法，`items`是源数据数组并且`item`是数组元素迭代的别名。

#### 一个对象的v-for

用`v-for`来迭代对象的属性

```
<div v-for="(value,key,index) in object" id="app">
	{{index}}. {{key}}:{{value}}
</div>

new Vue({
  el:"#app",
  data:{
    obj:{
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
```

输出结果为:

```
0. fristName: John
1. lastName: Doe
2. age: 30
```

#### v-for on a  <template>

可以利用带有`v-for`的`<template>`渲染多个元素。

```
//用<template>模板来渲染多个li元素
<ul>
	<template v-for="item in items">
		<li>{{item.msg}}</li>
		<li class="divider"></li>
	</template>
</ul>
```

#### 数组更新检测

Vue中包含了一组观察数组的变异方法，它们也会触发视图更新。

```
push()/pop()/shift()/unshift()/splice()/sort()/reverse()

调用方式: vm.items.push({name:"zhangjing"})
```

##### 注意事项

由于js的限制，Vue不能检测到以下变动的数组：

1.**利用索引直接设置一个项时：**`vm.items[indexOfItem] = newValue`

2.**修改数组的长度时：**`vm.items.length = newLength`

**第一类问题的解决方法**

```
//Vue.set 全局的Vue方法
Vue.set(example1.items,indexOfItem,newValue)
//也可以直接用实例的$set方法
vm.$set(example1.items,indexOfItem,newValue)
//Array.prototype.splice
example1.items.splice(indexOfItem,1,newValue)
```

**第二类问题的解决方法**

```
example1.items.splice(newLength)
```

#### 对象更改检测注意事项

由于js的限制，Vue不能检测对象属性的添加或删除：

```
var vm = new Vue({
  data:{
    a:1
  }
})
// "vm.a" 是响应式的
vm.b = 2;
// "vm.b" 不是响应式的
```

**对于已经创建的实例，Vue不能动态添加根级别的响应式属性。但可以使用Vue.set(object,key,value)方法向嵌套对象添加响应式属性。**

```
var vm = new Vue({
  data:{
    userProfile:{
      name:"Anika"
    }
  }
})
```

需要添加一个新的`age`属性到嵌套的`userProfile`对象：

```
Vue.set(vm.userProfile,"age",27);

vm.$set(vm.userProfile,"age",27);
```

**有时需要为已有对象赋予多个新属性，应该用两个对象的属性创建一个新的对象。**

```
this.userProfile = Object.assign({},this.userProfile,{
  age:27,
  favoriteColor:"pink"
})
```

### watch -- 观察者

````
//在观察、监听数组或者对象变化的时候
var vm = new Vue({
  data:{
    a:1,
    b:2,
    obj:{
      name:"zhangjing",
      age:24
    }
  }，
  watch:{
  	//方法名
    a:'someMethod',
    //监听数组或者对象的变化
    b:{
      handler:function(val,oldVal){},
      deep:true
    },
    //监听对象或者数组中指定的属性
    "obj.name":function(){
      ....
    }
  }
})
````

### 王者情侣

```
邀请TA参加大作战(报名)：6.报名接口(不支持微信)sign_up
寻找命定之人:5.拉取报名信息接口get_attend_info
查看更多(亲密度排行榜)：7.拉取排行榜信息get_attend_rank(好像缺少 开黑胜率与亲密度两个字段)
点击领取：8.绑定接口bind_captain

//排行榜
		rank_list.forEach(function(item,idx){
									    console.log(item);
									    var member_list = item.member_list;
									    member_list.forEach(function(list){
									        var uin = list.uin;
									        console.log(uin);
									        arr.push(uin);
										})
									    zHttp.send({actid:234606,uins:arr},function(json){
									        console.log(json);
									        if(json.ret == 0 && json.data.op){
									            var friendArr = json.data.op.friend;
									            vm.rankList.push({"hostFaceUrl":friendArr[arr[0]]["face"],"guestFaceUrl":friendArr[arr[1]]["face"],"score":item.score,"isCp":false,"hostName":item.nick_name,"rank":item.rank})
                                                vm.rankList[0]["isCp"] = true;
                                            }
										})
									})
									
//发送结构化消息
    inviteFriends:function(){
					    zHttp.syrequest({
                            actid:238893,
//                              targetid:vm.inviteFriendsUin.join(","),
                            targetid:this.inviteUin,
                            targettype: 1,
                            replace: 'invite_uin|' + me.uin
						},function(json,actid,fn){
					        console.log(json);
					        if(json.ret == 0){
					            vm.teamInfo = "邀请中";
//					            qv.zero.cache.add(info,"邀请中",1000*24*60*60*30);
							}
					        zHttp.showResponse(json,actid,fn);
						})
					}
					
//分享方法
 var args_self = {
    title: "和好友一起领王者礼包！",
    desc: "皮肤，英雄，钻石这里应有尽有！",
    image_url: window.location.protocol+"//imgcache.gtimg.cn/vipstyle/game/act/owx/201709/kg_relation/img/share.png",
    share_url: "https://youxi.vip.qq.com/m/act/201709/kg_relation/index.html?_wv=1",
    share_type : 0,
    back : true,
    sourceName:"QQ手游",
    puin:"2747277822"
 };
 //右上角分享
 mqq.ui.setOnShareHandler(function(type){
 		mqq.ui.shareMessage(args_self);
 });
 
 帅在灵魂:2393275725
```

