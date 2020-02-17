const sendXHR = function(data, url, method, responseHandler) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(data);
  request.onload = responseHandler;
};

const loginValidator = function() {
  const messageBox = document.getElementById('loginErrMsg');
  const userName = document.querySelector('#loginuserName').value;
  const password = document.querySelector('#loginpassword').value;
  const validationResult = Boolean(userName && password);
  if (!validationResult) {
    messageBox.innerHTML = 'Please enter you information';
    return;
  }
  const data = { userName, password };
  sendXHR(JSON.stringify(data), '/login', 'POST', function() {
    const res = JSON.parse(this.response);
    if (res.validUser) document.location = '/home.html';
    messageBox.innerHTML = res.errMsg;
  });
};

const signup = function() {
  const messageBox = document.getElementById('signupErrMsg');
  const userName = document.querySelector('#signupuserName').value;
  const password = document.querySelector('#signuppassword').value;
  const validationResult = Boolean(userName && password);
  console.log(validationResult);
  if (!validationResult) {
    messageBox.innerHTML = 'Please enter you information';
    return;
  }
  const data = { userName, password };
  sendXHR(JSON.stringify(data), '/signup', 'POST', function() {
    const res = JSON.parse(this.response);
    if (res.signedUp) document.location = '/';
  });
};

const show = function(elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove('hide');
};

const hide = function(elementId) {
  const element = document.getElementById(elementId);
  element.classList.add('hide');
};
