function Error(str) {
  $('#info').html('<span style="color:#dd2222;">' + str + '</span>')
}
function Info(str) {
  $('#info').html('<span style="color:#22dd22;">' + str + '</span>')
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
    $('#login-window').hide();
    firebase.database().ref('user/' + user.uid).once('value', function (snapshot) {
      $('.logged-in').show();
      $('.user-name').text(snapshot.val().name);
      var groups = snapshot.val().group;
      for(var i in groups) {
        if (groups[i] === INSTRUCTOR_GROUP) {
          setTimeout(function() {
            location.href="/add_problem.html";
          }, 1000);
          return;
        }
      }
      setTimeout(function() {
        location.href="/problem_list.html";
      }, 1000);
    })
  } else {
    Info('No auth');
    $('#login-window').show();
    $('.logged-in').hide();
  }
});
});

const INSTRUCTOR_GROUP = "-Kpp00LVwgAcECBQH7aa";