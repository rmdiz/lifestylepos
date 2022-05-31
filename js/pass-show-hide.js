
let res = null;
let site = {};
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0! navigation searchable
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

if(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear')){
    if(JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear')).session){
        window.location.href = './index.html';
    }
}

const pswdField = document.getElementById('signinPassword');
let pswdToggleBtn = document.getElementById('togglePass');

pswdToggleBtn.addEventListener('click', () => {
	if(pswdField.type == 'password'){
		pswdToggleBtn.textContent = 'visibility_off';
		pswdField.type ='text';
	}else{
		pswdToggleBtn.textContent = 'visibility';
		pswdField.type ='password';
	}
});


document.getElementById('sign-in-form').addEventListener('submit', (e) => {
	e.preventDefault();

    document.querySelector('section').after(preloader());

    const signinUsername = document.getElementById('signinUsername').value;
    const signinPassword = document.getElementById('signinPassword').value;

    if(signinPassword != "" && signinUsername !=""){
        let response = signin(signinUsername, signinPassword);
        response.always(function(data){
            if(data != 'Invalid username or password.'){
                // ------------------ GET/SET SITE BESIC DATA --------------------
                if(!localStorage.getItem('warehouse.pos.lifestyleoutdoorgear')){
                    localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
                }
                site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));

                // ---------------- SET CART & PAGE INITUAL VALUE ----------------
                data['cart'] = {};
                data['page'] = {'pageIndex': 0, 'pg': 'home'};

                // -------------------- STORE SITE BESIC DATA  -------------------
                localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(data));
                site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
                if(typeof(site.session) == 'object'){
                    removeElement('div.preloader');
                    window.location.href = './index.html';
                }

            }else{
                deliverNotification(data, 'danger');
                removeElement('div.preloader');

            }
        });
    }else{
        removeElement('div.preloader');
        deliverNotification('username and password required', 'danger');
    }
});

const signin = (username, password) => {
    const data = {
        'action':'authenticate',
        'username': username,
        'password': password
    }
    let res = run(data);
    return res;
}
const run = (data) => {
	let ajaxRequest = $.ajax({
	    url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
	    type: "POST",
	    dataType  : 'json',
	    data: data
	});

	return ajaxRequest;
}

const deliverNotification = (msg, msgtype) => {
    document.querySelector('.notification_messages').innerHTML = `${msg} <span class="material-symbols-outlined">close</span>`;

    document.querySelector('.notification_messages').classList.forEach((nclass) => {
        if(nclass !== 'notification_messages'){
            document.querySelector('.notification_messages').classList.remove(nclass);
        }
    });
    document.querySelector('.notification_messages').classList.add(msgtype);

    document.querySelector('.notification_messages span').addEventListener('click', () => {
        document.querySelector('.notification_messages').classList.remove(msgtype);
    });
    removeNotification();
}
const removeNotification = () => {
    setTimeout(function(){
        document.querySelector('.notification_messages').classList.forEach((nclass) => {
            if(nclass !== 'notification_messages'){
                document.querySelector('.notification_messages').classList.remove(nclass);
            }
        });

    }, 8000);
}

const preloader = () => {

	const preloader = document.createElement('div');
	preloader.classList.add('preloader');
	return preloader;
}

const removeElement =(element) => {
	if(document.querySelector(element) != null){
	    document.querySelector(element).remove();
	}

}