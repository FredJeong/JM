var text = "O say can you see, by the dawn's early light, what so proudly we hailed at the twilight's last gleaming,"
var wordCount;
var sentenceCount;
var words;
var selected_id;
var wordHistory = [];

function makeWordChunk(idx, word, prefix) {
  return "<div id='" + prefix + "word-" + idx  + "' class='word'>" +
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
  var title = $('#title').val();
  var start = $('#start-date').val();
  var end = $('#end-date').val();

  var num_problems = Number($('#num-problems').val()) || sentenceCount;
  var num_pass = Number($('#num-pass').val()) || sentenceCount;

  if (num_problems > sentenceCount || num_problems < num_pass) {
    Error("Check number of problems / pass criteria");
    return;
  }

  for (var i = 0; i < wordCount; i++) {
    var real_id = content_id + '-word-' + i;
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
  var answer = {
    words: words.join(' '),
    answers: answers,
    title: title,
    start: start,
    end: end,
    num_problems: num_problems,
    num_pass: num_pass,
    type: 'syntax'
  }
  var answerRef = firebase.database().ref('/problems').push();
  answerRef.set(answer).then(function success() {
    $('#content').html('');
    $('#title').val('');
    $('#start-date').val('');
    $('#end-date').val('');
    $('#num-problems').val('');
    $('#num-pass').val('');
    Info('Problem registered')
  }, function error() {
    Error('There was an error while registering problem');
  });

  var list = [];
  $("#groups input:checked").each(function(i, e) {
    var id = $(e).attr('id').substr(5);
    firebase.database().ref('group/' + id + '/problem/' + answerRef.key).set({
      title: title,
      start: start,
      end: end,
      content: words.join(' ').substr(0, 50)
    });
  });
}

function init (text, preprocessed, content_id) {
  var lWordCount;
  content_id = content_id || '#content';
  $(content_id).html('');
  if (!preprocessed) {
    text = text.split(/\r?\n/).join(' \n ');
    words = text.split(/ +/);
    lWordCount = wordCount = words.length;
  } else {
    text = JSON.parse(text);
    words = text.words;
    lWordCount =  wordCount = words.length;
  }
  sentenceCount = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i].substr(-1) === '.') sentenceCount++;
  }
  $('#sentence-count').text('Total ' + sentenceCount + ' sentence' + (sentenceCount === 1?'':'s'));

  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i] === '') {
      lWordCount--;
      continue;
    }
    if (words[i] === '\n') {
      lWordCount--;
      $(content_id).append('<br>');
      continue;
    }
    $(content_id).append(makeWordChunk(count, words[i], content_id.substr(1) + '-'));
    var w = Number($(content_id + '-word-' + count).css('width').split('px')[0]);
    var w2 = Number($(content_id + '-word-' + count + ' .word-bottom').css('width').split('px')[0]);
    $(content_id + '-word-' + count + ' .word-bottom').css('left', (w / 2 - 15) + 'px');
    count++;
  }
  if (preprocessed) {
    for (var i = 0; i < lWordCount; i++) {
      var real_id = content_id + '-word-' + i;
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
  $(content_id).off('keydown');
  $(content_id).keydown(function(e) {
    if (selected_id === undefined) return;
    var id = selected_id;
    var real_id = content_id + '-word-' + id;
    switch(e.which) {
    case 37: // left
      if (id <= 0) break;
      $(content_id + '-word-' + id).removeClass('selected');
      $(content_id + '-word-' + (id - 1)).addClass('selected');
      selected_id = id - 1;
      break;

    case 39: // right
      if (id >=  lWordCount - 1) break;
      $(content_id + '-word-' + id).removeClass('selected');
      $(content_id + '-word-' + (id + 1)).addClass('selected');
      selected_id = id + 1;
      break;

    case 65:
    case 66:
      console.log('a/b');
      if ($(real_id + ' .word-bottom').text() === 'a')
        $(real_id + ' .word-bottom').text('');
      else
        $(real_id + ' .word-bottom').text('a');
      updateBottomAlign(real_id);
      break;
    case 68:
    case 71:
      console.log('d/g');
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
      break; //disable
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
      if (t.length > 0){
        $(real_id + ' .word-left').text(t.substr(1));
        break;
      }
      // fall through
    case 46: // delete
      console.log('del');
      var t = $(real_id + ' .word-right').text();
      $(real_id + ' .word-right').text(t.substr(0, t.length - 1));
      break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
  $(content_id + ' .word').click(function(e) {
    $(content_id + '-word-' + selected_id).removeClass('selected');
    var id = Number($(this).attr('id').split('-').slice(-1));
    selected_id = id;
    var real_id = $(this).attr('id');
    $(content_id + '-word-' + selected_id).addClass('selected');
    $(content_id).focus();
  });
}