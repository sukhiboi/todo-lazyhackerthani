const openForm = () => show('myForm');

const closeForm = () => hide('myForm');

const hide = id => (document.getElementById(id).style.display = 'none');

const show = id => (document.getElementById(id).style.display = 'block');
