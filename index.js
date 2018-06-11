let superagent = require('superagent'),
  //nodejs里面一个非常方便的客户端代理请求模块，支持get,post,put,delete等
  cheerio = require('cheerio'),
  //类似于jQuery的DOM操作模块，可以提取html中想要的信息
  eventproxy = require('eventproxy'),
  //控制异步请求并发，可以监听请求，使得某些请求完毕之后在发送请求
  assert = require('assert'),
  //异常抛出判断模块，assert.equal(err, null);  如果err不为null,则直接抛出异常
  async = require('async'),
  //控制请求并发连接数
  fs = require('fs'),
  reptileUrl;

let index = 1; //页面数控制
let url = 'http://www.dytt8.net/html/gndy/jddy/20160320/50523';
let titles = []; //用于保存title

function getTitle(url, n) {
  console.log("正在获取第" + n + "页的内容");
  if (n == 1) {
    reptileUrl = url + '.html';
  } else {
    reptileUrl = url + '_' + n + '.html';
  }
  superagent.get(reptileUrl)
    .end(function (err, res) {
      // 抛错拦截
      if (err) {
        console.log(err);
      }
      /**
       * res.text 包含未解析前的响应内容
       * 我们通过cheerio的load方法解析整个文档，就是html页面所有内容，可以通过console.log($.html());在控制台查看
       */
      let $ = cheerio.load(res.text);
      for (let i = 0; i < $('#Zoom p a').length; i++) {
        titles.push($('#Zoom p a').eq(i).text());
      }

      // 生成数据
      // 写入数据, 文件不存在会自动创建
      fs.writeFile('./titles.txt', JSON.stringify({
        status: 0,
        data: titles
      }), function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('写入完成');
        }
      });
    });
  if (n < 5) {
    getTitle(url, ++index); //递归执行，页数+1
  } else {
    console.log("Title获取完毕！");
  }
}

function main() {
  console.log("开始爬取");
  getTitle(url, index);
}

main(); //运行主函数