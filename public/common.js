function Error(str) {
  $('#info').html('<span style="color:#dd2222;">' + str + '</span>')
}
function Info(str) {
  $('#info').html('<span style="color:#22dd22;">' + str + '</span>')
}

var previliged = false;

function admin() {
  previliged = true;
}

function logout () {
  firebase.auth().signOut().then(function () {
    Info('Signed out');
  }).catch(function (error) {
    Error('Error occured while signout, (' + error.code + ') ' + error.message);
  });
}
$(function(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    Info('Logged in as ' + user.email);
    firebase.database().ref('user/' + user.uid).once('value', function (snapshot) {
      $('.logged-in').show();
      $('.user-name').text(snapshot.val().name);
      if (previliged && !snapshot.val().admin) {
        $("div").html('');
        $("body").append('<div id="info"></div>');
        Error("Unauthorized Access");
        setTimeout(function() {
          location.href = "/index.html";
        }, 200);
      }
    });
  } else {
    Info('No auth');
    if (location.href.indexOf("/index.html") < 0 && location.href.indexOf("/register.html") < 0) location.href="/index.html";
  }
});
});

const INSTRUCTOR_GROUP = "-Kpp00LVwgAcECBQH7aa";