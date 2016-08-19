var now_page = 0;
var Pages = $('#pages');
var Page_changer_1 = $('#page_changer_1');
var Page_changer_2 = $('#page_changer_2');
var Menu = $('#menu');
var Mask = $('#mask');
var About = $('#about');
var string_volume = "f";
var string_pitch = "0";
var string_octave = "0";
var string_tempo = "7";
var length_pitch = 0;
var now_node = 0;
var now_volume = "f";
var now_pitch = "f";
var now_octave = "0";
var now_tempo = "6";
var dec = "0123456789";
var hex = "0123456789abcdef";
var time_tempo = [200, 300, 333, 400, 500, 600, 700, 800, 900, 1000];
var now_time_tempo = 1000;
var timeout;
var Audio1 = $('#audio1');
var Volume = $('#volume');
var Pitch = $('#pitch');
var Octave = $('#octave');
var Tempo = $('#tempo');
var Nmn = $('#nmn');
var Transformed_pitch = $('#transformed_pitch');
var Transformed_octave = $('#transformed_octave');
var InverseTransformed = $('#inverseTransformed');
var Notes = $("#notes");
var Progress_range = $('#progress_range');
var Progress_range_value = $('#progress_range_value');
var Progress_range_max = $('#progress_range_max');
var isProgressEditing = false;

// loading渐入
setTimeout(function() {
	$('#loading_img').css('opacity', 1)
}, 1)


// 音频加载完成时隐藏loading、显示wrapper
Audio1.on('canplaythrough', function() {
	setTimeout(function() {
		$('#loading').css('opacity', '0');
		$('#loading').one('transitionend webkitTransitionEnd', function() {
			$('#loading').css('display', 'none');
			$('#wrapper').css('display', 'block');
			setTimeout(function() {
				$('#wrapper').css('opacity', '1');
			}, 1)
		})
	}, 240)

})

$('textarea').attr('oninput', 'this.style.height=this.scrollHeight + "px"');


// 按钮水波纹效果
$(".button_md, .button").on('click', function() {
	if ($(this).width() > $(this).height()) {
		var radius = $(this).width();
	} else {
		var radius = $(this).height();
	}

	$(this).append('<div class="dot" style="top:' + getMousePos('y') + 'px; left:' + getMousePos('x') + 'px;"></div>')

	// 延迟1ms使transition生效
	var obj = $(this);
	setTimeout(function() {
		obj.children('.dot:last').css({
			'box-shadow': '0 0 0 ' + radius + 'px rgba(66, 166, 223, 0)',
			'background': 'rgba(66, 166, 223, 0)'
		})
	}, 1)

	// 动画结束后移除.dot
	$(this).children('.dot:last').one('transitionend webkitTransitionEnd', function() {
		$(this).remove()
	})
});


/**
 * 获取鼠标点击相对容器的位置
 */
function getMousePos(axis, event) {
	var e = event || window.event;
	var obj = e.target;
	if (obj.className == 'dot') {
		obj = obj.parentElement;
	}

	// 目标元素距窗口边框距离
	var Left = obj.offsetLeft,
		Top = obj.offsetTop;
	while (obj.offsetParent != null) {
		obj = obj.offsetParent;
		Left += obj.offsetLeft;
		Top += obj.offsetTop;
	}

	var x = e.clientX - Left;
	var y = e.clientY - Top;

	return {
		'x': x,
		'y': y
	}[axis];
}


// 对应关系
var mapping = {
	"0": "1",
	"1": "#1",
	"2": "2",
	"3": "#2",
	"4": "3",
	"5": "4",
	"6": "#4",
	"7": "5",
	"8": "#5",
	"9": "6",
	"a": "#6",
	"b": "7",
	"c": "8",
	"d": "#8",
	"e": "9",
	"f": "0"
}

var seg_list = {
	"0": "012456",
	"1": "25",
	"2": "02346",
	"3": "02356",
	"4": "1235",
	"5": "01356",
	"6": "013456",
	"7": "0125",
	"8": "0123456",
	"9": "012356",
	"a": "012345",
	"b": "13456",
	"c": "0146",
	"d": "23456",
	"e": "01346",
	"f": "0134"
}
var secMapping = {
	"00": "2",
	"01": "4",
	"02": "6",
	"03": "8",
	"04": "10",
	"05": "12",
	"06": "14",
	"07": "16",
	"08": "18",
	"09": "20",
	"0a": "22",
	"0b": "24",
	"10": "26",
	"11": "28",
	"12": "30",
	"13": "32",
	"14": "34",
	"15": "36",
	"16": "38",
	"17": "40",
	"18": "42",
	"19": "44",
	"1a": "46",
	"1b": "48",
	"20": "50",
	"21": "52",
	"22": "54",
	"23": "56",
	"24": "58",
	"25": "60",
	"26": "62",
	"27": "64",
	"28": "66",
	"29": "68",
	"2a": "70",
	"2b": "72",
	"2c": "74",
	"2d": "76",
	"2e": "78"
}

var keys = $('.keyboard').children('.button');
var pauseTimeOut;
for (var i = 0, seek = 2; i < keys.length; i++, seek += 2) {
	keys.eq(i).attr('data-seek', seek);
	keys.eq(i).on('click', function() {
		if (!isLock) {
			// 播放音频
			Audio1[0].play();
			Audio1[0].currentTime = $(this).attr('data-seek');
			clearTimeout(pauseTimeOut);
			pauseTimeOut = setTimeout(function() {
				Audio1[0].pause();
			}, 1800);
			// 写入简谱
			switch (this.id.substr(0, 1)) {
				case '0':
					Nmn.val(Nmn.val() + "(" + mapping[this.id.substr(1, 1)] + ")");
					break;

				case '1':
					Nmn.val(Nmn.val() + mapping[this.id.substr(1, 1)]);
					break;

				case '2':
					Nmn.val(Nmn.val() + "[" + mapping[this.id.substr(1, 1)] + "]");
					break;
			}
			Nmn[0].style.height = Nmn[0].scrollHeight + 'px';
		}
	});
}

// 为有文字的白键添加按下效果（解决IE按在文字div上，白键无active效果的问题）
for (var i = 0; i < $('.key_txt').length; i++) {
	$('.key_txt').eq(i).on('mousedown', function() {
		$(this).parent().addClass('white_pressed');
	})
	$('.key_txt').eq(i).on('mouseup', function() {
		$(this).parent().removeClass('white_pressed');
	})
}

function change_page() {
	if (now_page == 0) {
		Pages.addClass('page_second');
		Pages.removeClass('page_first');
		Page_changer_1.removeClass('page_changer_active');
		Page_changer_2.addClass('page_changer_active');
		setTimeout("now_page = 1;", 500);
	}
	if (now_page == 1) {
		Pages.addClass('page_first');
		Pages.removeClass('page_second');
		Page_changer_2.removeClass('page_changer_active');
		Page_changer_1.addClass('page_changer_active');
		setTimeout("now_page = 0;", 500);
	}
}


$("body").on("mousedown touchstart", function() {
	var e = event || window.event;
	last_mouseDownX = e.clientX || e.touches[0].clientX;
	if(Menu.attr('class').indexOf('menu_show')!=-1){
		Menu.removeClass("menu_show");
		setTimeout(function(){Menu.hide()},500);
	}
});

$("body").on("mouseup touchmove", function() {
	var e = event || window.event;
	var dx = (e.clientX || e.touches[0].clientX) - last_mouseDownX;
	if (dx > 10 && now_page == 1) change_page();
	if (dx < -10 && now_page == 0) change_page();
});

function start() {
	reset();
	string_volume = Volume.val().toLowerCase();
	string_pitch = Pitch.val().toLowerCase();
	string_octave = Octave.val();
	string_tempo = Tempo.val();
	length_pitch = string_pitch.length;
	if (length_pitch !== 0) {
		Progress_range[0].max = length_pitch;
		playAudio();
		playToggle.css('background', 'url(img/pause.svg)');
		isPlaying = true;
		isPause = false;
		$('.lockable').attr('disabled', 'disabled');
		isLock = true;
		Progress_range_max.text(length_pitch);
	}
}

function playAudio() {
	if (hex.indexOf(string_volume[now_node]) != -1) now_volume = string_volume[now_node];
	if (hex.indexOf(string_pitch[now_node]) != -1) now_pitch = string_pitch[now_node];
	else now_pitch = "f";
	if ("012".indexOf(string_octave[now_node]) != -1) now_octave = string_octave[now_node];
	else now_octave = "0";
	if (dec.indexOf(string_tempo[now_node]) != -1) {
		now_tempo = string_tempo[now_node];
		now_time_tempo = time_tempo[parseInt(now_tempo)];
	}
	Audio1[0].volume = parseInt(now_volume, 16) / 15;
	if (now_pitch.indexOf("f") == -1) {
		Audio1[0].play();
		Audio1[0].currentTime = secMapping[now_octave + now_pitch];
		clearTimeout(pauseTimeOut);
		pauseTimeOut = setTimeout(function() {
			Audio1[0].pause();
		}, 1800);
	}
	if(!isProgressEditing){
		Progress_range[0].value = now_node + 1;
		Progress_range_value.val(now_node+1);
	}

	segShow('#seg_seven_volume', now_volume);
	segShow('#seg_seven_pitch', now_pitch);
	segShow('#seg_seven_octave', now_octave);


	// 随机显示音符图片
	Notes.append(showNote(Math.ceil(Math.random()*4)));

	// 渐显&飘散
	setTimeout(function(){
		var x = Math.round(Math.random() * 240 - 120);
		var y = Math.round(Math.random() * 240 - 120);

		for(;;){
			if(Math.abs(x) < 70){
				x = Math.round(Math.random() * 240 - 120);
			}
			else if(Math.abs(y) < 70){
				y = Math.round(Math.random() * 240 - 120);
			}
			else break;
		}
		Notes.children('.note:last').css({
			'opacity': 1,
			// X&Y轴分别 -120~-70 / 70~120px 随机飘散
			'transform': 'translate(' + x + 'px, ' + y + 'px)',
			'-webkit-transform': 'translate(' + x + 'px, ' + y + 'px)'
		});
	}, 5);

	// 渐隐
	setTimeout(function(){
		var note = Notes.children('.note:last');

		note.css('opacity', 0);
		// 渐隐后移除
		note.on('transitionend webkitTransitionEnd', function(){
			$(this).remove();
		})
	}, now_time_tempo - 50)


	now_node++;
	if (now_node >= length_pitch) {
		setTimeout(function() {
			reset();
		}, 1800);
		return;
	}
	timeout = setTimeout("playAudio()", now_time_tempo);
}

function pause() {
	clearTimeout(timeout);
	isPause = true;
	isPlaying = false;
	playToggle.css('background', 'url(img/play.svg)');
}

function continue_play() {
	timeout = setTimeout("playAudio()", now_time_tempo);
	isPause = false;
	isPlaying = true;
	playToggle.css('background', 'url(img/pause.svg)')
}

function reset() {
	clearTimeout(timeout);
	Audio1[0].pause();
	now_node = 0;
	now_volume = "f";
	now_pitch = "f";
	now_octave = "0";
	now_tempo = "4";
	now_time_tempo = 500;
	Progress_range[0].value = 1;
	Progress_range[0].max = 1;
	Progress_range_value.val("0");
	Progress_range_max.text("0");
	segClr("#seg_seven_volume");
	segClr("#seg_seven_pitch");
	segClr("#seg_seven_octave");

	isPlaying = false;
	isPause = false;
	playToggle.css('background', 'url(img/play.svg)');
	$('.lockable').removeAttr('disabled');
	isLock = false;
}

function transform() {
	var string_NMN = Nmn.val();
	Transformed_pitch.text(transform_pitch(string_NMN));
	Transformed_octave.text(transform_octave(string_NMN));
}

function transform_pitch(string) {
	string = string.replace(/[\(\)\[\]]/g, "");
	string = string.replace(/\#[037]|[89]/g, "g");
	string = string.replace(/7/g, "b");
	string = string.replace(/\#6/g, "a");
	string = string.replace(/6/g, "9");
	string = string.replace(/\#5/g, "8");
	string = string.replace(/5/g, "7");
	string = string.replace(/\#4/g, "6");
	string = string.replace(/4/g, "5");
	string = string.replace(/3/g, "4");
	string = string.replace(/\#2/g, "3");
	string = string.replace(/0/g, "f");
	string = string.replace(/\#1/g, "》");
	string = string.replace(/1/g, "0");
	string = string.replace(/》/g, "1");
	string = string.replace(/[^(0-9)|(a-f)]/g, "无效");
	return string;
}

function transform_octave(string) {
	string = string.replace(/\#[037]/g, "8");
	string = string.replace(/\#[12456]/g, "》");
	string = string.replace(/[012]/g, "》");
	//以下两行由百度贴吧-电离的Tesla编写
	string = string.replace(/\(.*?\)/g, function(w) {
		return "0".repeat(w.length - 2)
	});
	string = string.replace(/\[.*?\]/g, function(w) {
		return "2".repeat(w.length - 2)
	});
	string = string.replace(/[3-7]|》/g, "1");
	string = string.replace(/[^0-2]/g, "无效");
	return string;
}

function InverseTransform() {
	InverseTransformed.text("");
	var string_pitch_tempo = Pitch.val().toLowerCase();
	var string_octave_tempo = Octave.val();
	var length = string_pitch_tempo.length;
	for (var i = 0; i < length; i++) {
		switch (string_octave_tempo[i]) {
			case '0':
				InverseTransformed.text(InverseTransformed.text() + "(" + mapping[string_pitch_tempo[i]] + ")");
				break;
			case '1':
				InverseTransformed.text(InverseTransformed.text() + mapping[string_pitch_tempo[i]]);
				break;
			case '2':
				InverseTransformed.text(InverseTransformed.text() + "[" + mapping[string_pitch_tempo[i]] + "]");
				break;
			default:
				InverseTransformed.text(InverseTransformed.text() + mapping[string_pitch_tempo[i]]);
		}
	}
	return 0;
}

function paste_result() {
	Pitch.val(Transformed_pitch.text());
	Octave.val(Transformed_octave.text());
	Tempo.val("");
	Pitch.css("height",Pitch[0].scrollHeight + "px");
	Octave.css("height",Octave[0].scrollHeight + "px");
}


/**
 * 载入乐谱
 * @param {Object} obj 包含data-music属性的对象
 */
function loadMusicScore(obj){
	obj = $(obj);
	if(!isLock){
		Pitch.val(musicList[obj.attr('data-music')].pitch);
		Octave.val(musicList[obj.attr('data-music')].octave);
		Tempo.val(musicList[obj.attr('data-music')].tempo);
		Nmn.val(musicList[obj.attr('data-music')].nmn);

		Pitch.css("height",Pitch[0].scrollHeight + "px");
		Octave.css("height",Octave[0].scrollHeight + "px");
		Tempo.css("height",Tempo[0].scrollHeight + "px");
		Nmn.css("height",Nmn[0].scrollHeight + "px");
	}
}
// 乐谱列表
var musicList = {
	"test": {
		"pitch": "0123456789ab0123456789ab0123456789ab",
		"octave": "000000000000111111111111222222222222",
		"tempo": "012345678987654321012345678987654321",
		"nmn": "(1#12#234#45#56#67)1#12#234#45#56#67[1#12#234#45#56#67]"
	},
	"twinkle_star": {
		"pitch": "0077997f5544220f7755442f7755442f0077997f5544220f",
		"octave": "",
		"tempo": "6",
		"nmn": "115566504433221055443320554433201155665044332210"
	},
	"happy_birthday": {
		"pitch": "77970bf779720f77740b9f554020",
		"octave": "0000100000011000111000111111",
		"tempo": "457777745777774577747745777",
		"nmn": "(5565)1(705565)21(055)531(760)443121"
	}
}


function segShow($target, character) {
	segClr($target);
	for (var i = 0; i < seg_list[character].length; i++) {
		$($target).children().eq(seg_list[character][i]).addClass('seg_active');
	}
}

function segClr($target) {
	$($target).children().removeClass('seg_active');
}



/**
 * 播放/暂停/停止 控制
 */
var playToggle = $('#play_toggle');
var stopBtn = $('#stop_btn');
var isPlaying = false;
var isPause = false;
var isLock = false;

playToggle.on('click', function() {
	// 正在播放时
	if (isPlaying) pause();
	// 暂停时
	else if (isPause) continue_play();
	// 停止时
	else start();
})

stopBtn.on('click', function() {
	reset();
	$('.lockable').removeAttr('disabled');
	isLock = false;
})



function get_AudioColor(){
	if(now_pitch.indexOf("f") != -1){
		return "rgba(0,0,0,0)";
	}

	var h = (22.5 * parseInt(now_pitch, 16) + 22*Math.random())/60;
	var s = 0.5 + parseInt(now_volume, 16) / 30;
	var i = Math.floor(h);
	var f = h - i;
	var a = 1 - s;
	var b = 1 - s * f;
	var c = 1 - s * (1 - f);

	switch (i){
		case 0:
			R = 1;
			G = c;
			B = a;
			break;
		case 1:
			R = b;
			G = 1;
			B = a;
			break;
		case 2:
			R = a;
			G = 1;
			B = c;
			break;
		case 3:
			R = a;
			G = b;
			B = 1;
			break;
		case 4:
			R = c;
			G = a;
			B = 1;
			break;
		case 5:
			R = 1;
			G = a;
			B = b;
			break;
	}

	return "rgb("+Math.round(R * 255) + "," + Math.round(G * 255) + "," + Math.round(B * 255) + ")";
}


function showNote(num){
	var points = {
		"1": "32,16 64,16 64,8 120,8 120,104 112,104 112,112 88,112 88,104 80,104 80,88 88,88 88,80 104,80 104,24 80,24 80,32 48,32 48,112 40,112 40,120 16,120 16,112 8,112 8,96 16,96 16,88 32,88",
		"2": "32,16 64,16 64,8 120,8 120,104 112,104 112,112 88,112 88,104 80,104 80,88 88,88 88,80 104,80 104,56 80,56 80,64 48,64 48,48 72,48 72,40 104,40 104,24 80,24 80,32 48,32 48,112 40,112 40,120 16,120 16,112 8,112 8,96 16,96 16,88 32,88",
		"3": "80,8 80,104 72,104 72,112 48,112 48,104 40,104 40,88 48,88 48,80 64,80 64,8",
		"4": "80,8 80,16 96,16 96,32 104,32 104,56 112,56 112,64 96,64 96,56 88,56 88,32 80,32 80,104 72,104 72,112 48,112 48,104 40,104 40,88 48,88 48,80 64,80 64,8"
	}
	var html = '<svg class="note" xmlns="http://www.w3.org/2000/svg" version="1.1"' +
	'style="margin:' + (Math.round(Math.random() * 80 - 40) - 40) + 'px 0 0 ' + (Math.round(Math.random() * 80 - 40) - 40) + 'px" viewBox="0 0 120 120">' +
	'<polygon points="' + points[num] + '" style="fill:' + get_AudioColor() + '" /></svg>'

	return html;
}
