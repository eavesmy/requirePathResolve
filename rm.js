var PathUilt_rm = module.exports = {};
var path = require('path')
var fs = require('fs')
var _path = __dirname;
/*/!**
 * _url.js文件删除
 * @param __dirname
 *!/*/
PathUilt_rm.rm = function(__dirname){
    fs.readdirSync(__dirname).forEach(function(file){           //根据当前文件的绝对路径，获取当前目录的所有文件及目录
        if(file.split(".")[0] != undefined && file.split(".")[0]!=""){          //切割文件名称,判断是否为.xxx文件    false
            var urlname = path.join(__dirname,file);        //拼接路径+文件名称
            if(fs.statSync(urlname).isDirectory()){         //判断是否为文件夹   true
                PathUilt_rm.rm(urlname);           //递归循环 , 如果是文件夹,调用当前方法传文件路径，获取所有文件
            }else{
                /*/!**
                 * 获取目录下所有的文件名，路径,和文件内容
                 * @type {string}
                 *!/*/
                var url = "."+urlname.split(_path)[1];  //url 获取文件的相对路径
                var file_split = file.indexOf("_url");
                if(file_split != -1){
                    var url_indexOf = url.indexOf(file);
                    url = url.substring(0,url_indexOf); //截取文件 去除文件名
                    console.log(path.join(url,file));
                    fs.unlinkSync(path.join(url,file));
                }
            }
        }
    })
}
PathUilt_rm.rm(__dirname);     //删除制定目录下的所有url.js文件