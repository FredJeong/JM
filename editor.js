var text = "O say can you see, by the dawn's early light, what so proudly we hailed at the twilight's last gleaming,"
var wordCount;
var words;
var selected_id;
var wordHistory = [];

function makeWordChunk(idx, word) {
  return "<div id='word-" + idx  + "' class='word'>" +
          "<span class='word-left'></span><span class='word-bottom'></span>" +
          "<span class='word-text'>" + word + "</span>" +
          "<span class='word-right'></span></div>";
}

function updateBottomAlign(real_id) {
  var w = Number($(real_id).css('width').split('px')[0]);
  var w2 = $(real_id + ' .word-bottom').text().length;
  $(real_id + ' .word-bottom').css('left', (w/2 - (w2*6)) + 'px');
  wordHistory.push('');
}

function newArticle() {
  init($('#text').val());
}
function newArticleAnswer() {
  init($('#text').val(), true);
}
function generateAnswer() {
  var answers = [];
  for (var i = 0; i < wordCount; i++) {
    var real_id = '#word-' + i;
    var left = $(real_id + ' .word-left').text();
    var right = $(real_id + ' .word-right').text();
    var bottom = $(real_id + ' .word-bottom').text();
    if ($(real_id + ' .word-text').hasClass('noun')) bottom = 'n' + bottom;

    answers.push([left, right, bottom]);
  }
  $('#answer').text(JSON.stringify({
    words: words,
    answers: answers
  }));
}

$(function () {
  init(text);
});

function init (text, preprocessed) {
  $('#content').html('');
  if (!preprocessed) {
    text = text.split(/\r?\n/).join(' \n ');
    words = text.split(/ +/);
    wordCount = words.length;
  } else {
    text = JSON.parse(text);
    words = text.words;
    wordCount = words.length;
  }
  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i] === '') {
      wordCount--;
      continue;
    }
    if (words[i] === '\n') {
      wordCount--;
      $('#content').append('<br>');
      continue;
    }
    $('#content').append(makeWordChunk(count, words[i]));
    var w = Number($('#word-' + count).css('width').split('px')[0]);
    var w2 = Number($('#word-' + count + ' .word-bottom').css('width').split('px')[0]);
    $('#word-' + count + ' .word-bottom').css('left', (w / 2 - 15) + 'px');
    count++;
  }
  if (preprocessed) {
    for (var i = 0; i < wordCount; i++) {
      var real_id = '#word-' + i;
      var bottom = text.answers[i][2];
      if (bottom[0] === 'n') {
        $(real_id + ' .word-text').addClass('noun');
        bottom = bottom.substr(1);
      }
      $(real_id + ' .word-left').text(text.answers[i][0]);
      $(real_id + ' .word-right').text(text.answers[i][1]);
      $(real_id + ' .word-bottom').text(bottom);
      updateBottomAlign(real_id);
    }
  }
  $('#content').off('keydown');
  $('#content').keydown(function(e) {
    if (selected_id === undefined) return;
    var id = selected_id;
    var real_id = '#word-' + id;
    switch(e.which) {
    case 37: // left
      if (id <= 0) break;
      $('#word-' + id).removeClass('selected');
      $('#word-' + (id - 1)).addClass('selected');
      selected_id = id - 1;
      break;


    case 39: // right
      if (id >=  wordCount - 1) break;
      $('#word-' + id).removeClass('selected');
      $('#word-' + (id + 1)).addClass('selected');
      selected_id = id + 1;
      break;

    case 65:
      console.log('a');
      if ($(real_id + ' .word-bottom').text() === 'a')
        $(real_id + ' .word-bottom').text('');
      else
        $(real_id + ' .word-bottom').text('a');
      updateBottomAlign(real_id);
      break;
    case 68:
      console.log('d');
      if ($(real_id + ' .word-bottom').text() === 'ad')
        $(real_id + ' .word-bottom').text('');
      else
        $(real_id + ' .word-bottom').text('ad');
      updateBottomAlign(real_id);
      break;
    case 86:
      console.log('v');
      if ($(real_id + ' .word-bottom').text() === 'v')
        $(real_id + ' .word-bottom').text('');
      else
        $(real_id + ' .word-bottom').text('v');
      updateBottomAlign(real_id);
      break;
    case 73:
      console.log('i');
      if ($(real_id + ' .word-bottom').text() === 'ing')
        $(real_id + ' .word-bottom').text('');
      else
        $(real_id + ' .word-bottom').text('ing');
      updateBottomAlign(real_id);
      break;
    case 78:
      console.log('n');
      $(real_id + ' .word-text').toggleClass('noun');
      
      break;
    case 219:
      console.log('[');
      var t = $(real_id + ' .word-left').text();
      $(real_id + ' .word-left').text('[' + t);
      break;
    case 221:
      var t = $(real_id + ' .word-right').text();
      $(real_id + ' .word-right').text(t + ']');
      console.log(']');
      break;
    case 57:
      var t = $(real_id + ' .word-left').text();
      $(real_id + ' .word-left').text('(' + t);
      console.log('(');
      break;
    case 48:
    var t = $(real_id + ' .word-right').text();
      $(real_id + ' .word-right').text(t + ')');
      console.log(')');
      break;
    case 188:
      var t = $(real_id + ' .word-left').text();
      $(real_id + ' .word-left').text('<' + t);
      console.log('<');
      break;
    case 190:
      var t = $(real_id + ' .word-right').text();
      $(real_id + ' .word-right').text(t + '>');
      console.log('>');
      break;

    case 8: // backspace
      console.log('bs');
      var t = $(real_id + ' .word-left').text();
      $(real_id + ' .word-left').text(t.substr(1));
      break;
    case 46: // delete
      console.log('del');
      var t = $(real_id + ' .word-right').text();
      $(real_id + ' .word-right').text(t.substr(0, t.length - 1));
      break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
  $('.word').click(function(e) {
    $('#word-' + selected_id).removeClass('selected');
    var id = Number($(this).attr('id').substr(5));
    selected_id = id;
    var real_id = $(this).attr('id');
    $('#word-' + selected_id).addClass('selected');
    $('#content').focus();
  });
}