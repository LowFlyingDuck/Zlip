var loginFailed = false;

function login() {
  var email = document.getElementById('email-forum').value;
  var password = document.getElementById('password').value;
  var failed = document.getElementById('login-failed');
  var loginData = {
    "email": email,
    "password": password
  };

  var options = {
    method: 'POST',
    body: JSON.stringify(loginData, null, 2),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  function sendStuff(){
    fetch('/login', options)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (json.status == 'logged in') {
          sessionStorage.setItem('email', json.email);
          sessionStorage.setItem('password', json.password);
          window.open('login.html', '_top');
        }
        else if (json.status == 'wrong password' && loginFailed == false) {
          failed.style.display = 'block';
          console.log(loginFailed);
          loginFailed = true;
          console.log(loginFailed);
        }
        else if (json.status == 'wrong password' && loginFailed == true) {
          failed.style.animation = 'failedAgain';
          failed.style.animationDuration = '0.4s';
          console.log('3 left');
          window.setTimeout(() => {
            failed.style.animation = 'none';
            failed.style.animationDuration = '0.4s';
          }, 500);
        };
      });
  };
  sendStuff();
};

function logout() {
  sessionStorage.setItem('password', 'none');
  window.open('index.html', '_top');
};