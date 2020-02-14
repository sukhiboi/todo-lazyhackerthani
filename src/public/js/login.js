const loginValidator = function() {
  const userName = document.querySelector('#loginDiv #userName').value;
  const password = document.querySelector('#loginDiv #password').value;
  const messageBox = document.getElementById('formMessage');
  const response = Boolean(userName && password);
  if(!response) messageBox.innerHTML = 'Please enter you information';
  return response
};
