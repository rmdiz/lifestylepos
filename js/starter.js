
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

// ------------------ GET/SET SITE BESIC DATA --------------------
if(!localStorage.getItem('warehouse.pos.lifestyleoutdoorgear')){
    localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
}
site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));

let page = 1;
let start = true;

const updateSiteData = (data) => {
    localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(data));
    site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
}

const dataRequest = (requestName, requestData, counter, reload = 'false') => {
    let lowerCaseRqtNm = requestName.toLowerCase(); // eg invoice NOTE:: requestName must be received with its first letter capital ang it shoudn't be in plural eg. Invoice
    let localStorageNm = `${lowerCaseRqtNm}List`; //eg invoiceList
    let action = `getAll${requestName}s`; // eg. getAllInvoice Note:: first letter of requestName must be capital
    $.ajax({
        url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
        type: "POST",
        dataType  : 'json',
        data: requestData,
        success: function(data){
            if(data.length > 0){
                // GET FIRST CHUNK OF DATA AND ADD IT TO SITE DATA
                site[localStorageNm] = data;

                // UPDATE SITE DATA
                updateSiteData(site);
            }
        },
        complete:function(data){
            data.always(all => {;
                counter++;
                if(all.length > 0 && counter == 2){
                    // GET ALL THE DATA
                    setTimeout(dataRequest(requestName, {'action': action}, counter, true), 0);
                }
            });
        }
    });
}

const autorun = (data) => {
    if((data.reload == true) || (!site[data.name])){
        let ajaxRequest = $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: data,
            success: function(details){
                site[data.name] = details;
                updateSiteData(site)
            }
        });
    }
}
// LOAD PRODUCT LIST
setTimeout(dataRequest('Product', {'limit': 15,'action':'getLimitedProducts', 'page': page}, 1), 0);

// LOAD WAREHOUSE INVENTORY PRODUCT LIST
setTimeout(dataRequest('WarehouseInventory', {'limit': 15,'action':'getLimitedWarehouseInventory', 'page': page}, 1), 0);

// LOAD BRANCH INVENTORY LIST
setTimeout(dataRequest('BranchInventory', {'limit': 15,'action':'getLimitedBranchInventory', 'page': page}, 1), 0);

// LOAD USER LIST
setTimeout(dataRequest('User', {'limit': 15,'action':'getLimitedUsers', 'page': page}, 1), 0);

// LOAD SUPPLIER LIST
setTimeout(dataRequest('Supplier', {'limit': 15,'action':'getLimitedSuppliers', 'page': page}, 1), 0);

// LOAD INVOICE LIST
setTimeout(dataRequest('Invoice', {'limit': 15,'action':'getLimitedInvoices', 'page': page}, 1), 0);


// LOAD HELPER DATA LIST
setTimeout(autorun({'reload': false, 'action':'getCategories', 'name': 'categoryList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getStatus', 'name': 'statusList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getBrands', 'name': 'brandList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getSizeSchemes', 'name': 'sizeSchemeList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getBranches', 'name': 'branchList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getUserTypes', 'name': 'userTypeList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getCustomers', 'name': 'customerList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getColors', 'name': 'colorList'}), 0);
setTimeout(autorun({'reload': false, 'action':'getSizes', 'name': 'sizeList'}), 0);

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
                // ---------------- SET CART & PAGE INITUAL VALUE ----------------
                site.session = data.session;
                site.cart = {};
                site.page = {'pageIndex': 0, 'pg': 'home'};

                // -------------------- STORE SITE BESIC DATA  -------------------
                updateSiteData(site);
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