var http = require('https');
// var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var iconv=require('iconv-lite');//iconv-lite模块用于解码
//设置循环
var i = 0;
//初始url /detail23/22563.html
var url = "https://blog.csdn.net/a419419/article/details/90677076"; 
function startSpider(x) {
	console.log('向目标站点发送请求');
    //采用http模块向服务器发起一次get请求      
    http.get(x, function (res) {     
        var htmlData=[];//用于接收获取到的网页
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
            htmlData.push(chunk);
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
            //下一篇文章的url
            var nextLink="https://blog.csdn.net/a419419/article/details/90677076";
            i++
            //这是亮点之一，通过控制I,可以控制爬取多少篇文章.
            if (i <= 10000) {   
                console.log('次数：'+ i);           
                setTimeout(function(){
                    startSpider(nextLink);
                },1000)
            }
        });
    }).on('error', function (err) {
        console.log(err);
    });

}
startSpider(url);      //主程序开始运行