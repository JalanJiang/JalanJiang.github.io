var render = function(page, data){
	var img = "";
	for (var i = 0; i < data.length; i++) {
        var imgUrl = "https://jalan-blog-1257233467.cos.ap-chengdu.myqcloud.com/" + data[i];
        var imgUrlSmall = "https://jalan-blog-1257233467.cos.ap-chengdu.myqcloud.com/" + data[i] + "?imageMogr2/thumbnail/!10p";
        img += '<li><div class="img-box">' + 
        '<a class="img-bg " rel="example_group" data-fancybox="images" href="' + 
        imgUrl + 
        '"><img alt="" src="' + 
        imgUrlSmall +
        '" /></a>' + 
        '</div></li>';
		//img += '<img src="http://yourqiniu.url.com/' + data[i] + '" />';
	}
	$(".img-box-ul").append(img);
	$(".img-box-ul").lazyload();
	$("a[rel=example_group]").fancybox();
}