[TOC]

### 前言

Vue.js是一款MVVM框架，上手快速简单易用，通过数据绑定在修改数据的时候更新视图。

**Vue.js的数据绑定原理依赖于 Object.defineProperty.**

Vue通过设定对象属性的setter/getter方法来监听数据的变化，通过getter进行依赖收集，而每个setter方法就是一个观察者，在数据变更的时候通知订阅者更新视图。

### Object.defineProperty

`Object.defineProperty()`方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

### 1.访问器属性

**访问器属性是对象中的一种特殊属性，它不能直接在对象中设置，必须通过defineProperty()方法来单独定义。**

**访问器属性的"值"比较特殊，读取或设置访问器属性的值，实际上是调用其内部特性:get和set函数。**

```
var obj = {};
//为对象obj定义了一个名为 hello 的访问器属性
Object.defineProperty(obj,"hello",{
  get:function(){
    console.log('get方法被调用了');
  },
  set:function(val){
    console.log('set方法被调用了，参数是 ' + val);
  }
});

obj.hello; // get方法被调用了
obj.hello = 'abc'; //set方法被调用了，参数是abc
```

### 2.简单的双向绑定实现

```
<input type="text" id="a">
<span id="b"></span>

<script>
	var obj = {};
	Object.defineProperty(obj,"hello",{
      set:function(newVal){
        document.getElementById('a').value = newVal;
        document.getElementById('b').innerHTML = newVal;
      }
	});
	
	document.addEventListener('keyup',function(e){
      obj.hello = e.target.value;
	})
</script>
```

**随文本框输入文字的变化，span中会同步显示相同的文字内容;在浏览器控制台修改obj.hello的值，视图也会相应更新。实现了model =》view 以及 view =》 model的双向绑定。**

### 3.分解任务

```
<div id="app">
	<input type="text" v-model="text">
	{{ text }}
</div>

<script>
	var vm = new Vue({
      el:"#app",
      data:{
        text:"hello world"
      }
	});
</script>
```

#### 1.输入框以及文本节点与data中的数据绑定

#### 2.输入框内部变化时，data中的数据同步变化。 view =》model 的变化

#### 3.data中的数据变化时，文本节点的内容同步变化。 model =》view 的变化

### 4.DocumentFragment

DocumentFragment(文档碎片)可以看做节点容器，它可以包含多个子节点，当把它插ding入到DOM中时，只有它的子节点会插入到目标节点中，所以可以把它看作一组节点的容器。使用DocumentFragment处理节点，速度和性能远远优于直接操作DOM。

**Vue进行编译时，就是将挂载目标的所有子节点劫持(通过appendChild方法，DOM中的节点会被自动删除)到DocumentFragment中，经过一番处理之后，再将DocumentFragment整体返回插入挂载目标。**

```
<div id="app">
    <input type="text" id="a">
    <span id="b"></span>
</div>
<script>
    //先劫持app下的子元素
    var dom = nodeToFragment(document.getElementById("app"));
    console.log(dom);

    function nodeToFragment(node){
        var flag = document.createDocumentFragment();
        var child;

        while(child = node.firstChild){
            console.log(child);
            flag.appendChild(child); //劫持node的所有子节点
        }
        return flag;
    }

    //去掉这段代码，可以发现页面只剩下<div id="app"></div>，子节点全部被劫持啦
    document.getElementById("app").appendChild(dom);  //返回到app中(经过处理之后再返回到app当中)
```

![7b8a2034782b1b7ea4436685932d967](C:\Users\V_CZJZ~1\AppData\Local\Temp\WeChat Files\7b8a2034782b1b7ea4436685932d967.png)

### 5.数据初始化绑定(实现任务1)

**代码走向:**

实例化一个vm实例，执行`nodeToFragment`方法，然后将app下面的子元素执行`compile`方法，`compile`方法的作用就是 找到子元素上包含`v-model`属性，然后将 vm.data[name]赋值给该dom。

```
<div id="app">
    <input type="text" v-model="text">
    {{ text }}
</div>

<script>
    //解析模板
    function compile(node,vm){
        var reg = /\{\{(.*)\}\}/;
        //节点类型为元素
        if(node.nodeType === 1){
            var attr = node.attributes;
            console.log(attr);
            //解析属性
            for(var i=0;i<attr.length;i++){
                if(attr[i].nodeName == 'v-model'){
                    var name = attr[i].nodeValue; //获取v-model绑定的属性名
                    node.value = vm.data[name]; //将data的值赋给该node
                    node.removeAttribute('v-model');
                }
            };
        }
        //节点类型为text
        if(node.nodeType === 3){
            if(reg.test(node.nodeValue)){
                var name = RegExp.$1; //获取匹配到的字符串
                name = name.trim();
                node.nodeValue = vm.data[name]; //将data的值赋给该node
            }
        }
    }

    function nodeToFragment(node,vm){
        var flag = document.createDocumentFragment();
        var child;

        while(child = node.firstChild){
            compile(child,vm);
            flag.appendChild(child); //将子节点劫持到文档片段中
        }
        return flag;
    }

    //构造函数
    function Vue(options){
        this.data = options.data;
        var id = options.el;
        var dom = nodeToFragment(document.getElementById(id),this);
        //编译完成后，将dom返回到app中
        document.getElementById(id).appendChild(dom);
    }

    var vm = new Vue({
        el:"app",
        data:{
            text:"hello world"
        }
    });
</script>
```

![fee5d92be1ad858b4010aac19923377](C:\Users\V_CZJZ~1\AppData\Local\Temp\WeChat Files\fee5d92be1ad858b4010aac19923377.png)

### 6.响应式的数据绑定

来看任务二的实现思路(view => model):在输入框输入数据时，首先触发input事件，在相应的事件处理程序中，可以获取到输入框的value值并赋值给vm实例的text属性。利用defineProperty将data中的text设置为vm的访问器属性，因此给vm.text赋值，就会触发set方法。

**在set方法中主要做两件事，第一是更新属性的值，第二留到任务三再说。**

```
//访问器方法
    function defineReactive(obj,key,val){
        Object.defineProperty(obj,key,{
            get:function(){
                return val;
            },
            set:function(newVal){
                if(newVal === val) return;
                val = newVal;
                console.log(val);
            }
        });
    }

    //监听
    function observe(obj,vm){
        Object.keys(obj).forEach((key) => defineReactive(vm,key,obj[key]));
    }
    
    //构造函数
    function Vue(options){
        this.data = options.data;

        var data = this.data;
        //监听vm实例中的data对象，当data对象中的属性发生变化时就会触发访问器的set方法。
        observe(data,this);

        var id = options.el;
        var dom = nodeToFragment(document.getElementById(id),this);
        //编译完成后，将dom返回到app中
        document.getElementById(id).appendChild(dom);
    }
    
     //解析模板
    function compile(node,vm){
        var reg = /\{\{(.*)\}\}/;
        //节点类型为元素
        if(node.nodeType === 1){
            var attr = node.attributes;
            console.log(attr);
            //解析属性
            for(var i=0;i<attr.length;i++){
                if(attr[i].nodeName == 'v-model'){
                    var name = attr[i].nodeValue; //获取v-model绑定的属性名(name = "text")

                    //监听input事件
                    node.addEventListener('input',function(e){
                        //给相应的data属性赋值，进而触发该属性的set方法
                        vm[name] = e.target.value;  //相当于 vm.text = "zj";
                    });
//                    node.value = vm.data[name]; //将data的值赋给该node(node.value = "hello world")
                    node.value = vm[name]; //将data的值赋给该node(node.value = "hello world")

                    node.removeAttribute('v-model'); //移除 'v-model'属性
                }
            };
        }
        //节点类型为text
        if(node.nodeType === 3){
            if(reg.test(node.nodeValue)){
                var name = RegExp.$1; //获取匹配到的字符串
                name = name.trim();
//                node.nodeValue = vm.data[name]; //将data的值赋给该node
                node.nodeValue = vm[name]; //将data的值赋给该node
            }
        }
    }
```

**任务二完成，text属性会与输入框的内容同步变化。**

### 7.订阅/发布模式(subscribe & publish)

text属性变化了,set方法触发了，但是文本节点的内容没有变化。为了让同样绑定到text的文本节点也同步变化，需要用到**订阅发布模式**。

**订阅发布模式(又称观察者模式)定义了一种一对多的关系，让多个观察者同时监听某一个主题对象，这个主题对象的状态发生改变时就会通知所有观察者对象。**

**发布者发出通知 =》 主题对象收到通知并推送给订阅者 =》 订阅者执行相应操作**

```
//一个发布者publisher
var pub = {
  publish:function(){
    dep.notify();
  }
}

//三个订阅者subscribers
var sub1 = {
  update:function(){
    console.log(1)
  }
};
var sub2 = {
  update:function(){
    console.log(2)
  }
};
var sub3 = {
  update:function(){
    console.log(3)
  }
};

//一个主题对象
function Dep(){
  this.subs = [sub1,sub2,sub3];
}
Dep.prototype.notify = function(){
  this.subs.forEach(function(sub){
    sub.update();
  })
}

//发布者发布消息，主题对象执行notify方法，进而触发订阅者执行update方法
var dep = new Dep();
pib.publish(); //1,2,3
```

**之前有说到的，当set方法触发后做的第二件事就是作为发布者发出通知：“我是属性text，我变了”。文本节点则作为订阅者，在收到消息后执行相应的更新操作。**

### 8.双向绑定的实现

**每当new一个Vue，主要做两件事：第一个是监听数据：observe(data),第二个是编译HTML：nodeToFragment(id).**

**在监听数据的过程中，会为data中的每一个属性生成一个主题对象dep。**

**在编译HTML的过程中，会为每个与数据绑定相关的节点生成一个订阅者watcher，watcher会将自己添加到相应属性的dep中。**

目前已经实现：**修改输入框内容 =》 在事件回调函数中修改属性值 =》 触发属性的set方法**

接下来需要实现：**发出通知dep.notify() => 触发订阅者的update方法 =》 更新视图。**

```
//在编译HTML过程中，为每个与data关联的节点生成一个Watcher。
function Watcher(vm,node,name,nodeType){
   Dep.target = this; //将Dep.target设置为Watcher实例
   this.name = name;
   this.node = node;
   this.vm = vm;
   this.nodeType = nodeType;
   this.update(); //执行update方法
   Dep.target = null; //再次将Dep.target设置为null
}

Watcher.prototype = {
  update:function(){
    this.get();
    if(this.nodeType == 'text'){
      this.node.nodeValue = this.value;
    }
    if(this.nodeType == 'input'){
      this.node.value = this.value;
    }
  },
  //获取data中的属性值
  get:function(){
    this.value = this.vm[this.name]; //触发相应属性的get
  }
}

function defineReactive(obj,key,val){
  var dep = new Dep();
  
  Object.defineProperty(obj,key,{
    get:function(){
      //添加订阅者watcher到主题对象Dep中
      if(Dep.target) dep.addSub(Dep.target); //其实就相于把一个wathcer实例添加到了subs数组中
      return val;
    },
    set:function(newVal){
      if(newVal === val) return;
      val = newVal;
      //作为发布者发出通知
      dep.notify();  //当data对象中的属性发生改变时，触发notify方法遍历subs数组，执行update方法，这里的update方法其实是watcher实例的update方法，从而达到改变视图的效果。
    }
  });
}


function Dep(){
  this.subs = [];
}

Dep.prototype = {
  addSub:function(sub){
    this.subs.push(sub);
  },
  notify:function(){
    this.subs.forEach(function(sub){
      sub.update();
    })
  }
}
```

### 分析

首先，将自己赋给一个全局变量Dep.target;

其次去执行update方法，进而触发get方法，get方法读取了vm的访问器属性，从而触发访问器属性的get方法，get方法中将该watcher添加到了对应访问器属性的dep中；

**再次获取属性的值，然后更新视图。**

最后还需要将Dep.target设为空。因为它是全局变量，也是watcher与dep关联的唯一桥梁，任何时刻都必须保证Dep.target只有一个值。

### 跟着代码一起走一次，vm实例先执行observe方法，跳到defineReactive方中，实例化dep，访问器中的get方法将订阅者watcher添加到主题对象Dep中（最终添加到subs数组中）。在input框输入内容，通过监听方法改变data中的属性值，触发访问器的set方法，作为发布者发出通知：“我改变了”。第二步执行nodeToFragment方法，执行compile方法，new一个watcher对象，当做订阅者。执行watcher中的update方法，会先执行get方法，get方法给watcher中的value赋值，同时触发访问器的get方法，访问器的get方法将这个实例添加到subs数组中，当data的数据一改变，就触发访问器的set方法，执行dep.notify方法，进而触发watcher的update方法，达到改变视图的效果。



第8点个人觉得是最难的一点，首先要明白一点：视图在这块是作为订阅者的形式，而data中的数据则作为发布者的形式。

