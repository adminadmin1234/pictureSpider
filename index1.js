//var http = require('https');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var iconv=require('iconv-lite');//iconv-lite模块用于解码
//设置循环
var i = 0;
//初始url 
var url = "http://xiaohua.zol.com.cn/detail60/59411.html"; 
function startSpider(x) {
	console.log('向目标站点发送请求');
    //采用http模块向服务器发起一次get请求      
    http.get(x, function (res) {     
        var htmlData=[];//用于接收获取到的网页
        var htmlDataLength=0;
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
            htmlData.push(chunk);
            htmlDataLength+=chunk.length;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
            //数据获取完毕后，开始解码
            var bufferHtmlData=Buffer.concat(htmlData,htmlDataLength);
            var decodeHtmlData=iconv.decode(bufferHtmlData,'gbk');
            var $=cheerio.load(decodeHtmlData,{decodeEntities: false});
            var news_item = {
                //获取文章的标题
                title: $('.article .article-title').text().trim(),
                imgSrc: 'http:' + $('.article .article-text img').attr('src'),
                link: $(".article .article-text a").attr('href'),//
                //i是用来判断获取了多少篇文章
                i: i = i + 1,     
            };
            console.log(news_item);
            var news_title = news_item.title;
            savedImg($,news_title,news_item.imgSrc,i);    //存储每篇文章的图片及图片标题
            //下一篇文章的url
            var nextLink="http://xiaohua.zol.com.cn" + $(".article .article-text a").attr('href');
            //这是亮点之一，通过控制I,可以控制爬取多少篇文章.
            if (i <= 2) {                
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
function savedImg($,news_title,img_src) {
    console.log('news_title', news_title);
    var img_filename = news_title + '.gif';
    // var img_src = $(this).attr('src'); //获取图片的url
    //采用request模块，向服务器发起一次请求，获取图片资源
    request.head(img_src,function(err,res,body){
        if(err){
            console.log(err);
        }
    });
    console.log('img_filename', img_filename);
    var output = './image/' + img_filename;
    request(img_src).pipe(fs.createWriteStream(output));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
}
startSpider(url);      //主程序开始运行