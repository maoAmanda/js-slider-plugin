(function(definition){
	"use strict";
	
	if(typeof exports === "object" && typeof module === "object"){
	//如果是 commonJS环境里面
        module.exports = definition();
	}else if(typeof define === "function" && define.amd){
	// requireJS环境里面
        define(definition);
	}else if(typeof window !== "undefined" || typeof self !== "undefined"){
	// 正常window环境里面
		var global = typeof window !== "undefined" ? window : self;
        global.sliderPlugin= definition();
        
	}else{
		throw new Error("This environment was not anticipated by plugin,Please file a bug.")
    }
    
	})(function(){
		function sliderPlugin(){
            // 返回一些参数和api
			return {
                name: 'image silder plugin',
				createEelement: createEelement
			};
        }
        // 判断是否是HTMLElement
        function isHtmlControl(obj) { 
            var d = document.createElement("div");
            try{
                d.appendChild(obj.cloneNode(true));
                return obj.nodeType==1 ? true : false;
            }catch(e){
                return obj == window || obj == document;
            }
        }
        // 创建dom
		function createEelement(wrapper, imageArray, time){
            if(isHtmlControl(wrapper)){
                createStyle();

                // 创建轮播图骨架
                var dom = '<ul class="image-slider">',
                    dotDom = `<div class="dot">`,
                length = imageArray.length;
                for(var i = 0; i < length; i++){
                    dom += `<li class="image-slider-item">
                        <img src="` + imageArray[i] + `">
                        </li>`;
                    dotDom += `<span class="dot-item"></span>`;
                }
                //将第一张图片多插入一次
                dom += `<li class="image-slider-item">
                        <img src="` + imageArray[0] + `">
                        </li>`
                dom += '</ul>';
                dotDom += '</div>';

                wrapper.innerHTML = dom + dotDom;
                wrapper.style = "position: relative;overflow:hidden;";//?此时如果外面wrapper没有设置高度，这里面的就是0。
                
                var doc = document,
                    domUL = doc.getElementsByTagName('ul')[0],
                    domLi = doc.getElementsByTagName('li'),
                    domImg = doc.getElementsByTagName('img'),
                    domDot = doc.getElementsByTagName('span'),
                    _width = wrapper.offsetWidth,
                    _height =  wrapper.offsetHeight;
                // 设置轮播图样式
                // domUL.style = `width: ` + _width * (length + 1) + `px;
                //         height: ` + _height + `px;
                //         list-style: none;
                //         position: relative;`
                // for(var i = 0; i <= length ; i++){
                //     domLi[i].style.width = domImg[i].style.width = _width + `px`;
                //     domLi[i].style.height = domImg[i].style.height = _height + `px`;
                // }

                // 设置下面点的样式，默认选中第一个
                domDot[0].style.background = '#e0c6c6';

                // 自动轮播，每隔2秒播放一张图
                var index = 0, moveDistance = _width;
                var timer = setInterval(function(){
                    autoMove(domUL, length);
                },time || '2000')
                
                // 事件冒泡，滑动的是li
                wrapper.onmouseenter = function(){
                    // 当鼠标放上去的时候，清除自动滚动（也就是清除计时器）
                    clearInterval(timer);
                }
                
                wrapper.onmouseleave = function(){
                    timer = setInterval(function(){
                        autoMove(domUL,length);
                    },time || '2000')
                }
                // 图片开始轮播
                function autoMove(element,length){
                    if(isHtmlControl(element)){
                        var json = { left: element.offsetLeft - moveDistance };
                        index++;
                        
                        // 移动图片
                        move(element,json,function(){
                            if(index == length){
                                // 当翻到最后一张之后，循环重新来
                                index = 0;
                                element.style.left = '0px';
                            }
                            // 还原其他圆点的样式
                            // 改变下面的圆点样式
                            for(var d of domDot){
                                d.style.background = '#959090';
                            }
                            domDot[index].style.background = '#e0c6c6';
                        });
                    }
                }
                // 每张图片具体移动方式
                function move(elem, json,callback){
                    var speed ,cur;// speed表示移动的步长，cur表示现在距离左边的距离
                    elem.timer = setInterval(function(){
                        var bStop = true;
                        for(var prop in json){
                            if(prop == 'opacity'){
                                cur = parseFloat(getStyle(elem, prop)) * 10;
                            }else{
                                cur = parseInt(getStyle(elem, prop));
                            }
                            // 滑动速度
                            speed = (json[prop]-cur)/7;
                            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                            if(prop == 'opacity'){
                                elem.style.opacity = (cur + speed )/10;
                            }else{
                                elem.style[prop] = cur+ speed + 'px';
                            }
                            json[prop] !== cur ? bStop = false : bStop = true;
                            if(bStop){
                                // 一张图片翻过去之后触发
                                clearInterval(elem.timer);
                                typeof callback == 'function'? callback() : '';
                            }
                        }
                    },30);
                }
                // 返回当前元素的style样式
                function getStyle(elem, prop) {
                    if(elem.currentStyle){
                        return elem.currentStyle[prop];
                    }else{
                        return window.getComputedStyle(elem, null)[prop];
                    }
                }
                // 创建样式表
                function createStyle(){
                    // var doc = document, link = doc.createElement('link'), head = doc.getElementsByTagName('head')[0];;
                    // link.href = path;
                    // link.rel = 'stylesheet';
                    // link.type = 'text/css';
                    // head.appendChild(link);

                    var doc = document, style = doc.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = `*{
                        margin: 0;
                        padding: 0;
                    }
                    .image-slider{
                        display: table;
                        word-break: keep-all;
                        white-space:nowrap;
                        height: 100%;
                        list-style: none;
                        position: relative;
                    }
                    .image-slider-item,.image-slider-item img{
                        width: 100%;
                    }
                    .image-slider-item{
                        display: inline-block;
                    }
                    .dot{
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 20px;
                        text-align: center;
                    }
                    .dot-item{
                        display: inline-block;
                        width:  8px;
                        height:  8px;
                        background: #959090;
                        border-radius: 100%;
                        margin: 5px;
                    }`;
                    doc.getElementsByTagName('head')[0].appendChild(style);
                }
            }else {
                throw new Error('error!HTMLElement is need!');
            }
        }
		return sliderPlugin();
});
