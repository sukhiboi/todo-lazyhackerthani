const loginValidator = function() {
  const userName = document.querySelector('#loginDiv #userName').value;
  const password = document.querySelector('#loginDiv #password').value;
  return Boolean(userName && password);
};
