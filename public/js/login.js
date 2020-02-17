const sendXHR = function(data, url, method, responseHandler) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(data);
  request.onload = responseHandler;
};

const loginValidator = function() {
  const userName = document.querySelector('#loginDiv #userName').value;
  const password = document.querySelector('#loginDiv #password').value;
  const messageBox = document.getElementById('formMessage');
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
  const userName = document.querySelector('#loginDiv #userName').value;
  const password = document.querySelector('#loginDiv #password').value;
  const validationResult = Boolean(userName && password);
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
