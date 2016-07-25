var Tmp = $('#tmp');
var Pages = $('#pages');
var Page_changer_1 = $('#page_changer_1');
var Page_changer_2 = $('#page_changer_2');
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
var Volume_display = $('#volume_display');
var Tempo_display = $('#tempo_display');
var File_display = $('#file');
var Progress_display = $('#progress');
var Nmn = $('#nmn');
var Transformed_pitch = $('#transformed_pitch');
var Transformed_octave = $('#transformed_octave');

// 预加载音频

for(var i = 0; i < 3; i++) {
	for(var j = 0; j < 15; j++) {
		Tmp.append('<audio src="piano/' + i + '' + hex[j] + '.mp3" preload />')
	}
}

// 音频加载完成时隐藏loading、显示wrapper
Tmp.children('audio:last').on('canplaythrough', function() {
	$('#loading').css('opacity', '0');
	$('#loading').one('transitionend webkitTransitionEnd', function() {
		$('#loading').css('display', 'none');
		$('#wrapper').css('display', 'block');
		setTimeout(function() {
			$('#wrapper').css('opacity', '1');
		}, 1)
	})
})

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

var Keyboards = $('.keyboard');
for(var key_octave = 0; key_octave < 3; key_octave++) {
	var Keyboard = Keyboards.eq(key_octave);

	for(var key_pitch = 0; key_pitch < 12; key_pitch++) {
		Keyboard.children('.button').eq(key_pitch).attr('id', key_octave + '' + hex[key_pitch]);
		Keyboard.children('.button').eq(key_pitch).on('click', function() {
			// 播放音频
			Audio1.attr('src', 'piano/' + this.id + '.mp3');
			Audio1[0].play();

			// 写入简谱
			switch(this.id.substr(0, 1)) {
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
		})
	}
}

// 为有文字的白键添加按下效果（解决IE按在文字div上，白键无active效果的问题）
for(var i = 0; i < $('.key_txt').length; i++) {
	$('.key_txt').eq(i).on('mousedown', function() {
		$(this).parent().addClass('white_pressed');
	})
	$('.key_txt').eq(i).on('mouseup', function() {
		$(this).parent().removeClass('white_pressed');
	})
}

function next_page(){
	Pages.addClass('page_second');
	Pages.removeClass('page_first');
	Page_changer_1.removeClass('page_changer_active');
	Page_changer_2.addClass('page_changer_active');
}
function prev_page(){
	Pages.addClass('page_first');
	Pages.removeClass('page_second');
	Page_changer_2.removeClass('page_changer_active');
	Page_changer_1.addClass('page_changer_active');
}

function start() {
	stop();
	string_volume = Volume.val().toLowerCase();
	string_pitch = Pitch.val().toLowerCase();
	string_octave = Octave.val();
	string_tempo = Tempo.val();
	length_pitch = string_pitch.length;
	if(length_pitch !== 0) playAudio();
}

function playAudio() {
	if(hex.indexOf(string_volume[now_node]) != -1) now_volume = string_volume[now_node];
	if(hex.indexOf(string_pitch[now_node]) != -1) now_pitch = string_pitch[now_node];
	else now_pitch = "f";
	if("012".indexOf(string_octave[now_node]) != -1) now_octave = string_octave[now_node];
	else now_octave = "0";
	if(dec.indexOf(string_tempo[now_node]) != -1) {
		now_tempo = string_tempo[now_node];
		now_time_tempo = time_tempo[parseInt(now_tempo)];
	}
	Audio1[0].volume = parseInt(now_volume, 16) / 15;
	if(now_pitch.indexOf("f") == -1) {
		Audio1.attr('src', 'piano/' + now_octave + now_pitch + '.mp3');
		Audio1[0].play();
	}
	Progress_display.text('总' + (now_node + 1) + '/' + length_pitch + '，第' + hex[Math.floor(now_node / 16)] + '行，第' + hex[now_node % 16] + '列');
	File_display.text('piano/' + now_octave + now_pitch + '.mp3');
	Volume_display.text(now_volume);
	Tempo_display.text(now_time_tempo / 1000);
	now_node++;
	if(now_node >= length_pitch) {
		Audio1.one("ended", stop);
		return;
	}
	timeout = setTimeout("playAudio()", now_time_tempo);
}

function stop() {
	clearTimeout(timeout);
	now_node = 0;
	now_volume = "f";
	now_pitch = "f";
	now_octave = "0";
	now_tempo = "4";
	now_time_tempo = 500;
	Progress_display.text('总0/0，第0行，第0列');
	File_display.text("无");
	Volume_display.text("f");
	Tempo_display.text("0.5");
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
	var string_pitch_tempo = Pitch.val().toLowerCase();
	var string_octave_tempo = Octave.val();
	var length = string_pitch_tempo.length;
	for(var i = 0; i < length; i++) {
		switch(string_octave_tempo[i]) {
			case '0':
				InverseTransformed.text(InverseTransformed.text() + "(" + mapping[string_pitch_tempo[i]] + ")");
				break;
			case '1':
				InverseTransformed.text(InverseTransformed.text() + mapping[string_pitch_tempo[i]]);
				break;
			case '2':
				InverseTransformed.text(InverseTransformed.text() + "[" + mapping[string_pitch_tempo[i]] + "]");
				break;
		}
	}
}

function paste_result() {
	Pitch.val(Transformed_pitch.text());
	Octave.val(Transformed_octave.text());
}

function test_mp3() {
	Pitch.val("0123456789ab0123456789ab0123456789ab");
	Octave.val("000000000000111111111111222222222222");
	Tempo.val("012345678987654321012345678987654321");
	Nmn.val("(1#12#234#45#56#67)1#12#234#45#56#67[1#12#234#45#56#67]");
}

function xiaoxingxing() {
	Pitch.val("0077997f5544220f7755442f7755442f0077997f5544220f");
	Tempo.val("6");
	Nmn.val("115566504433221055443320554433201155665044332210");
}

function zhunishengrikuaile() {
	Pitch.val("77970bf779720f77740b9f554020");
	Octave.val("0000100000011000111000111111");
	Tempo.val("457777745777774577747745777");
	Nmn.val("(5565)1(705565)21(055)531(760)443121");
}
