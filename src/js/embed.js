/**
 * @author entere <entere@126.com>
 * @type {{eventUtil: {add: add, off: off}, otherUtil: {}}}
 */
var rdUtils = {
    
    /**
     * dom2事件，处理dom各事件，示例
     * @params el->getElementById('btn'); type->click……js事件 handler->处理事件的函数
     * @demo
     * var btn = getElementById('btn');
     * rdUtils.eventUtil.add(btn,'click',function(){alert('yes')})
     */
    eventUtil:{
        add : function(el, type, handler) {
            if(el.addEventListener) {
                el.addEventListener(type, handler, false);
            }else if( el.attachEvent ) {
                el.attachEvent("on"+type, handler);
            }else{
                el["on"+type] = handler;
            }
        },
        off : function(el, type, handler) {
            if( el.removeEventListener ) {
                el.removeEventListener(type, handler, false)
            }else if( el.detachEvent ) {
                el.detachEvent(type, handler);
            }else{
                el["on"+type] = null;
            }
        }
    },

    
    
    strUtil:{

        
        /**
         * [js浮点数精准乘法]
         * @param  {[type]} arg1 [description]
         * @param  {[type]} arg2 [description]
         * @return {[type]}      [description]
         */
        accMul : function (arg1,arg2) 
        { 
            var m=0,s1=arg1.toString(),s2=arg2.toString(); 
            try{m+=s1.split(".")[1].length}catch(e){} 
            try{m+=s2.split(".")[1].length}catch(e){} 
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
        } 

    },

    /**
     * click 生成变化的随机金钱
     */
    randomMoney:{
        timer : null,
        /**
         *
         * @param ele 例：document.getEelemntById('input');
         */
        start : function(ele){
            var sDate = new Date().getTime();
            clearInterval(rdUtils.randomMoney.timer);
            var rmbArr = this.genRmbArr(1,20);

            rdUtils.randomMoney.timer = setInterval(function(){
                var random = Math.floor(Math.random()*rmbArr.length);
                ele.value = rmbArr[random];
                var eDate = new Date().getTime();
                //如果时间大于1500毫秒，暂停随机rmb
                if(eDate-sDate>1500) {
                    rdUtils.randomMoney.stop();
                }
            },100);
            //window.setTimeout('window.clearInterval(this.timer)',5000);

        },

        //停止随机money
        stop : function (){
            clearInterval(rdUtils.randomMoney.timer);
        },


        /**
         * 生成一定范围的RMB的数组 start为数组的啊小值，end为最大值
         * @param s start  最小金额
         * @param e end    最大金额
         * @returns {Array} [1.00,1.01,1.02……,19.99]
         */
        genRmbArr : function (s,e){
            var rmbArr = new Array();
            for(var i=s*100;i<e*100;i++) {
               var iVal = this.toDecimal2(i/100);
               rmbArr[i-100] = iVal;
            }
            return rmbArr;
        },

        /**
         * 制保留2位小数，如：2，会在2后面补上00.即2.00
         * @param x
         * @returns {*}
         */
        toDecimal2 : function (x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(x*100)/100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return s;
        }
    },
    showView:{
       
        loadCss: function(path){
            if(!path || path.length === 0){
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        genHtml : function() {
            var htmlVal = 
                '<!--赞赏主页面!-->'+
                '<div class="zs-con" style="display:block">'+
                    '<img class="img" src="./src/img/pic.gif"/>'+
                    '<div class="zs-but" id="rd_reward_button">'+
                        '<a></a>'+
                    '</div>'+
                    '<p class="zs-dir">已经有<i id="rd_reward_person" style="color:red; font-family:Arial; font-size:20px;">  0  </i>人赞赏</p>'+
                '</div>'+
                '<!--赞赏主页面end!-->'+
                '<!--赞赏遮罩内容begin!-->'+
                '<div class="zs-container" style="display:none" id="rd_fixed_amount_layer">'+
                    '<span class="zs-container-close" id="rd_fixed_close_button">X</span>'+
                    '<!--固定金额页面!-->'+
                    '<div class="zs-con zs-con-n" >'+
                        '<ul class="zs-de">'+
                            '<li onclick="rdUtils.showView.jump2Reward(0.5)"><a>5</a>毛</li>'+
                            '<li onclick="rdUtils.showView.jump2Reward(2)"><a>2</a>元</li>'+
                            '<li onclick="rdUtils.showView.jump2Reward(6)"><a>6</a>元</li>'+
                            '<li onclick="rdUtils.showView.jump2Reward(8)"><a>8</a>元</li>'+
                            '<li onclick="rdUtils.showView.jump2Reward(20)"><a>20</a>元</li>'+
                        '</ul>'+
                        '<div class="other"  style="*margin-top:-18px;" id="rd_random_amount_button">其它金额</div>'+
                        '<div class="other-zs"><i style="color:red; font-size:14px; font-size:1.4rem; text-decoration:none;">赞赏无悔，概不退款</i></div>'+
                    '</div>'+
                '</div>'+
                '<!--固定金额页面end!-->'+
                '<div class="zs-container" style="display:none" id="rd_random_amount_layer">'+
                    '<span class="zs-container-close" id="rd_random_close_button">X</span>'+
                    '<!--其它金额页面!-->'+
                    '<div class="zs-con zs-con-n" >'+
                        '<form>'+
                            '<label class="je">金额(元)：</label><label class="je-sj" >'+
                            '<input value="小于200元" type="text" id="rd_total_fee_random" /><i class="money">￥:</i>'+
                            '<a id="rd_gen_random"><img src="./src/img/saizi_img.png"/></a>'+
                            '<i style="color:red; width:70%;*height:auto; position:absolute;top:33px;top:44px\0; left:0;  font-size:14px; font-size:1.4rem; text-decoration:none;display:none"   id="rd_total_fee_error">请输入正确金额</i></label>'+
                            '<input class="zs-sub" type="button" value="" id="rd_to_reward"/>'+
                        '</form>'+
                        '<div class="other" style="*margin-top:-18px;" id="rd_fixed_amount_button">默认金额</div>'+
                        '<div class="other-zs"><i style="color:red; font-size:14px; font-size:1.4rem; text-decoration:none;">赞赏无悔，概不退款</i></div>'+
                    '</div>'+
                    '<!--其它金额页面end!-->'+
                '</div>'+
                '<!--赞赏遮罩内容end!-->';
            
            document.getElementById("rw-thread").innerHTML = htmlVal;
        },

        
        
        showFixAmountLayer : function() {
            document.getElementById('rd_fixed_amount_layer').style.display = 'block';
            document.getElementById('rd_random_amount_layer').style.display = 'none';
        },
        showRandomAmountLayer : function() {
            document.getElementById('rd_random_amount_layer').style.display = 'block';
            document.getElementById('rd_fixed_amount_layer').style.display = 'none';
        },

        
        closeFixAmountLayer : function() {
            document.getElementById('rd_fixed_amount_layer').style.display = 'none';
            
        },
        
        closeRandomAmountLayer : function() {
            document.getElementById('rd_random_amount_layer').style.display = 'none';
        },

        jump2Reward : function(totalFee) {
            //totalFee = document.getElementById("rd_total_fee_random").value*100;
            var isMoney = /^\d+(\.\d{0,2})?$/;
            if(!isMoney.test(totalFee)  || totalFee == 0 || totalFee>200)  
            {  
                document.getElementById("rd_total_fee_error").style.display = "block";
                return false;
            }  
            totalFee = rdUtils.strUtil.accMul(totalFee,100);//浮点数乘法
            var gourl = './jump.html';
            window.location.href=gourl;
        }

    },

    init : function() {
        //load css
        this.showView.loadCss('./src/css/embed.css');

        //show html
        this.showView.genHtml();

        

        //点赞赏button时，弹出层 pop FixAmountLayer event
        this.eventUtil.add(document.getElementById("rd_reward_button"),'click',function(){
            
            rdUtils.showView.showFixAmountLayer();
        });

        //点其它金额button时，弹出层 pop FixRandomLayer event
        this.eventUtil.add(document.getElementById("rd_random_amount_button"),'click',function(){
            rdUtils.showView.showRandomAmountLayer();
        });

        /**
         * 点默认金额button时，弹出层 pop FixRandomLayer event
         */
        this.eventUtil.add(document.getElementById("rd_fixed_amount_button"),'click',function(){
            rdUtils.showView.showFixAmountLayer();
        });

        /**
         * 点随机金额上的关闭button时 closeFixAmountLayer event
         */
        this.eventUtil.add(document.getElementById("rd_fixed_close_button"),'click',function(){
            rdUtils.showView.closeFixAmountLayer();
        });

        /**
         * 点击固定金额上的关闭button时 closeRandomAmountLayer
         */
        
        this.eventUtil.add(document.getElementById("rd_random_close_button"),'click',function(){
            rdUtils.showView.closeRandomAmountLayer();
        });

        /**
         * input 得到焦点时
         */
        
        this.eventUtil.add(document.getElementById("rd_total_fee_random"),'focus',function(){
            document.getElementById("rd_total_fee_error").style.display = "none";
            var v = document.getElementById("rd_total_fee_random");

            if (v.value=='小于200元') {
                //console.log(v);
                v.value='';
            }
        });
        //input 失去焦点时
        this.eventUtil.add(document.getElementById("rd_total_fee_random"),'blur',function(){
            var v = document.getElementById("rd_total_fee_random");
            if (v.value =='') {
                v.value ='小于200元';
            }
            //onfocus="if(value==\'可填写1-200\') {value=\'\'}" onblur="if (value==\'\') {value=\'可填写1-200\'}" 
            document.getElementById("rd_total_fee_error").style.display = "none";
        });



        //点击随机金额button random money event
        this.eventUtil.add(document.getElementById("rd_gen_random"),'click',function(){
            rdUtils.randomMoney.start(document.getElementById("rd_total_fee_random"));
        });

        //点击赞赏button go to reward event click
        this.eventUtil.add(document.getElementById("rd_to_reward"),'click',function(){
            rdUtils.showView.jump2Reward(document.getElementById("rd_total_fee_random").value);
        });

        //键盘回车事件 go to reward event keyup
        this.eventUtil.add(document,'keyup',function(event){
            var s = document.getElementById("rd_random_amount_layer").style.display;
            //当层显示出来的时间，按下回车才能跳转
            if(s == "block") {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode == 13) {
                    rdUtils.showView.jump2Reward(document.getElementById("rd_total_fee_random").value);
                }
            }
            //console.log(event.keyCode);
        });


    }



}

rdUtils.init();













