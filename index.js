//var http = require('https');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
//设置循环
var i = 0;
//初始url 
var url = "http://m.juyouqu.com/qu/3187982"; 
function startSpider(x) {
	console.log('向目标站点发送请求');
    //采用http模块向服务器发起一次get请求      
    http.get(x, function (res) {     
        var html = '';        //用来存储请求网页的整个html内容
        var titles = [];        
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
            html += chunk;
            //console.log(chunk)
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {

         var $ = cheerio.load(html); //采用cheerio模块解析html
         //console.log('html',html)
         var news_item = {
          	//获取文章的标题
            title: $('.item-title').text().trim(),
            imgSrc: $('.post-container img').attr('src'),
            link: $(".button").attr('href'),//
        	//i是用来判断获取了多少篇文章
            i: i = i + 1,     
            };
	    console.log(news_item);
	    var news_title = $('.item-title').text().trim();
	    savedImg($,news_title);    //存储每篇文章的图片及图片标题
        //下一篇文章的url
	    var nextLink="http://m.juyouqu.com" + $(".button").attr('href');
        //这是亮点之一，通过控制I,可以控制爬取多少篇文章.
        if (i <= 10) {                
            setTimeout(function(){
            	startSpider(nextLink);
            },300)
        }
        });
    }).on('error', function (err) {
        console.log(err);
    });

}
//该函数的作用：在本地存储所爬取到的图片资源
function savedImg($,news_title) {
    $('.post-container img').each(function (index, item) {
        var img_title = news_title+index;
        var img_filename = img_title + '.jpg';
        var img_src = $(this).attr('src'); //获取图片的url
        //采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}
startSpider(url);      //主程序开始运行