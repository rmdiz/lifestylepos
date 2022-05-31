
let res = null;
let site = {};
let limit = 15;
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0! navigation searchable
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

if(!localStorage.getItem('warehouse.pos.lifestyleoutdoorgear')){
    window.location.href = './signin.html';
}else if(!JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear')).session){
    window.location.href = './signin.html';
}

site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));

let page = 1;
let start = true;


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

const updateSiteData = (data) => {
    localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(data));
    site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
                    
}
const getProducts = (requestData, reload = 'false') => {
    if(reload == true || (!site.productList)){
        (start) ? document.querySelector('#products_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                if(data.length > 0){
                    if(start){
                        // RESET PRODUCT LIST TO EMPTY ARRAY
                        site.productList = [];
                        start = false
                        renderPageData(data, 0, 'product');
                    }
                    // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                    site.productList = site.productList.concat(data);
                    // UPDATE SITE DATA
                    updateSiteData(site);
                    if((site.productList)){
                        generatePegination(site.productList, 'product');
                    }
                }
            },
            complete:function(data){
                data.always(all => {
                    // console.log(all);
                    if(all.length > 0){
                        page++;
                        // LOAD MORE PRODUCTS TO PRODUCT LIST
                        setTimeout(getProducts({'limit': 15,'action':'getLimitedProducts', 'page': page}, true), 0);
                    }else{
                        // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                        site.productList = site.productList.concat(all);
                        // UPDATE SITE DATA
                        localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
                        site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
                        if((site.productList)){
                            generatePegination(site.productList, 'product');

                        }
                    }
                });
            }
        });
    }
}
const getWarehouseInventory = (requestData, counter, reload = 'false') => {
    if(reload == true || (!site.warehouseInventoryList)){
        // (start) ? document.querySelector('#products_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                console.log(data)
                if(data.length > 0){
                    if((!site.warehouseInventoryList)){
                        // RESET PRODUCT LIST TO EMPTY ARRAY
                        site.warehouseInventoryList = [];
                        start = false
                        renderPageData(data, 0, 'warehouseInventory');
                    }
                    // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                    site.warehouseInventoryList = site.warehouseInventoryList.concat(data);
                    // UPDATE SITE DATA
                    updateSiteData(site);
                }
            },
            complete:function(data){
                data.always(all => {
                    // console.log(all);
                    if(all.length > 0 && counter == 1){
                        counter++;
                        // LOAD MORE PRODUCTS TO PRODUCT LIST
                        setTimeout(getWarehouseInventory({'action':'getAllWarehouseIventory'}, counter, true), 0);
                    }else{
                        // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                        site.warehouseInventoryList = all;
                        // UPDATE SITE DATA
                        updateSiteData(site);

                        if((site.warehouseInventoryList)){
                            generatePegination(site.warehouseInventoryList, 'warehouseInventory');
                        }
                    }
                });
            }
        });
    }
}
const getUsers = (requestData, counter, reload = 'false') => {
    if(reload == true || (!site.userList)){
        // (start) ? document.querySelector('#users_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                console.log(data)
                if(data.length > 0){
                    if((!site.userList)){
                        // RESET PRODUCT LIST TO EMPTY ARRAY
                        site.userList = [];
                        start = false
                        renderPageData(data, 0, 'user');
                    }
                    // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                    site.userList = site.userList.concat(data);
                    // UPDATE SITE DATA
                    updateSiteData(site);
                }
            },
            complete:function(data){
                data.always(all => {
                    // console.log(all);
                    if(all.length > 0 && counter == 1){
                        counter++;
                        // LOAD MORE PRODUCTS TO PRODUCT LIST
                        setTimeout(getUsers({'action':'getAllusers'}, counter, true), 0);
                    }else{
                        // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                        site.userList = all;
                        // UPDATE SITE DATA
                        updateSiteData(site);

                        if((site.userList)){
                            generatePegination(site.userList, 'user');
                        }
                    }
                });
            }
        });
    }
}
const getSupplier = (requestData, counter, reload = 'false') => {
    if(reload == true || (!site.supplierList)){
        (start) ? document.querySelector('#suppliers_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                console.log(data)
                if(data.length > 0){
                    if((!site.supplierList)){
                        // RESET PRODUCT LIST TO EMPTY ARRAY
                        site.supplierList = [];
                        start = false
                        renderPageData(data, 0, 'supplier');
                    }
                    // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                    site.supplierList = site.supplierList.concat(data);
                    // UPDATE SITE DATA
                    updateSiteData(site);
                }
            },
            complete:function(data){
                data.always(all => {
                    // console.log(all);
                    if(all.length > 0 && counter == 1){
                        counter++;
                        // LOAD MORE PRODUCTS TO PRODUCT LIST
                        setTimeout(getSupplier({'action':'getAllSuppliers'}, counter, true), 0);
                    }else{
                        // ADD EVERY PRODUCT DATA GOT TO SITE DATA
                        site.supplierList = all;
                        // UPDATE SITE DATA
                        updateSiteData(site);

                        if((site.supplierList)){
                            generatePegination(site.supplierList, 'supplier');
                        }
                    }
                });
            }
        });
    }
}
// const getSaleInvoices = (requestData, counter, reload = 'false') => {
//     if(reload == true || (!site.invoiceList)){
//         (start) ? document.querySelector('#invoices_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
//         $.ajax({
//             url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
//             type: "POST",
//             dataType  : 'json',
//             data: requestData,
//             success: function(data){
//                 console.log(data)
//                 if(data.length > 0){
//                     if((!site.invoiceList)){
//                         // RESET PRODUCT LIST TO EMPTY ARRAY
//                         site.invoiceList = [];
//                         start = false
//                         renderPageData(data, 0, 'invoice');
//                     }
//                     // ADD EVERY PRODUCT DATA GOT TO SITE DATA
//                     site.invoiceList = site.invoiceList.concat(data);
//                     // UPDATE SITE DATA
//                     updateSiteData(site);
//                 }
//             },
//             complete:function(data){
//                 data.always(all => {
//                     // console.log(all);
//                     if(all.length > 0 && counter == 1){
//                         counter++;
//                         // LOAD MORE PRODUCTS TO PRODUCT LIST
//                         setTimeout(getSaleInvoices({'action':'getAllInvoices'}, counter, true), 0);
//                     }else{
//                         // ADD EVERY PRODUCT DATA GOT TO SITE DATA
//                         site.invoiceList = all;
//                         // UPDATE SITE DATA
//                         updateSiteData(site);

//                         if((site.invoiceList)){
//                             generatePegination(site.invoiceList, 'invoice');
//                         }
//                     }
//                 });
//             }
//         });
//     }
// }

const dataRequest = (requestName, requestData, counter, reload = 'false') => {
    let lowerCaseRqtNm = requestName.toLowerCase(); // eg invoice NOTE:: requestName must be received with its first letter capital ang it shoudn't be in plural eg. Invoice
    let localStorageNm = `${lowerCaseRqtNm}List`; //eg invoiceList
    let action = `getAll${requestName}s`; // eg. getAllInvoice Note:: first letter of requestName must be capital
    if(reload == true || (!site[localStorageNm])){
        (start) ? document.querySelector(`#${lowerCaseRqtNm}s_list`).insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                if(data.length > 0){

                    // ONLY RENDER DATA TO PAGE PAGE AT THE FIRST REQUEST
                    if((!site[localStorageNm])){
                        renderPageData(data, 0, lowerCaseRqtNm);
                    }

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
                    }else if((site[localStorageNm])){
                        generatePegination(site[localStorageNm], lowerCaseRqtNm);
                    }
                });
            }
        });
    }
}
// const reFetchProduct = (requestData, reload = 'false') => {
//     if(reload == true || (!site.productInventoryList)){
//         (start) ? document.querySelector('#products_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
//         $.ajax({
//             url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
//             type: "POST",
//             dataType  : 'json',
//             data: requestData,
//             success: function(data){
//                 if(data.length > 0){
//                     if(start){
//                         // RESET PRODUCT LIST TO EMPTY ARRAY
//                         site.productInventoryList = [];
//                         start = false
//                         renderPageData(data);
//                     }
//                     // ADD EVERY PRODUCT DATA GOT TO SITE DATA
//                     site.productInventoryList = site.productInventoryList.concat(data);
//                     // UPDATE SITE DATA
//                     localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
//                     site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
//                     if((site.productInventoryList)){
//                         generatePegination(site.productInventoryList);
//                     }

//                 }
//             },
//             complete:function(data){
//                 data.always(all => {
//                     // console.log(all);
//                     if(all.length > 0){
//                         page++;
//                         setTimeout(reFetchProduct({'branch_id': site.session.branch_id, 'limit':15,'action':'fetchAllProducts', 'page': page}, true), 0);
//                     }else{
//                         // ADD EVERY PRODUCT DATA GOT TO SITE DATA
//                         site.productInventoryList = site.productInventoryList.concat(all);
//                         // UPDATE SITE DATA
//                         localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
//                         site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
//                         if((site.productInventoryList)){
//                             generatePegination(site.productInventoryList);
//                         }
//                     }
//                 });
//             }
//         });
//     }
// }

// warehouseInvenrory setTimeout(reFetchProduct({'branch_id': site.session.branch_id, 'limit': 15,'action':'fetchAllProducts', 'page': page}), 0);

const generatePegination = (data, item, limit = 15, displayLinkNumber = 10) => {
    let pages = 1;  
    let range = []; 
    let total = data.length;
    if(total > limit){
        let page = Math.ceil(total/limit);
        // let page = Math.floor(total/limit);
        pages = total & limit === 0 ? page : page + 1;
        range = [...Array(pages).keys()];

        let peginationLink = document.querySelector(`.pagination_link.${item}-list_pagination`);
        let activePeginationLink = document.querySelector(`.pagination_link.${item}-list_pagination span.active`);
        let itemLink = '<span><<</span> ';
        range.forEach((rangeValue, index) => {
            if(index < 11){
                if(rangeValue == 0){
                    itemLink += ` <span class="prev"><</span>`;

                }else{
                    if(activePeginationLink != null){
                        itemLink += ` <span class="${(rangeValue == Number(activePeginationLink.textContent)) ? 'active': ''}">${rangeValue}</span>`;
                    }else{
                        itemLink += ` <span class="${(rangeValue == 1) ? 'active': ''}">${rangeValue}</span>`;
                    }
                }
            }
        });
        itemLink += '<span class="next">></span><span>>></span>';
        peginationLink.innerHTML = itemLink;

        paginationManipulation(displayLinkNumber, range, data, item, limit);
    }

}
const paginationManipulation = (displayLinkNumber, range, data, item, limit) => {
    let itemLinks = document.querySelectorAll(`.pagination_link.${item}-list_pagination span`);
    
    itemLinks.forEach(paginationLink => paginationLink.addEventListener('click', () => {
        itemLinks.forEach(itemLink => {itemLink.classList.remove('active')});

        switch(paginationLink.textContent){
            case '>':

                itemLinks.forEach(itemLink => {itemLink.classList.remove('hide')});
                itemLinks.forEach(itemLink => {
                    console.log(itemLink.textContent)
                    if(itemLink.textContent !== '<<' && itemLink.textContent !== '<' && itemLink.textContent !== '>>' && itemLink.textContent !== '>' ){
                        if(((displayLinkNumber + Number(itemLink.textContent)) <= Number(range[range.length - 1]))){
                            itemLink.textContent = displayLinkNumber + Number(itemLink.textContent);
                        }else{
                            itemLink.textContent = displayLinkNumber + Number(itemLink.textContent);
                            itemLink.classList.add('hide');
                            if(((displayLinkNumber + Number(itemLink.textContent)) >= Number(range[range.length - 1]))){
                                document.querySelector(`.pagination_link.${item}-list_pagination span.next`).classList.add('hide');
                            }
                        }
                    }
                   
                });
            break;
            case '>>':
                let values = [];
                for (var i = 11; i >= 0; i--) {
                    values.push(Number(range[range.length - 1]) - i);
                }

                itemLinks.forEach((itemLink, index) => {
                    itemLink.classList.remove('hide');
                    if(itemLink.textContent !== '<<' && itemLink.textContent !== '<' && itemLink.textContent !== '>>' && itemLink.textContent !== '>' ){
                       itemLink.textContent = values[index];
                    }
                });
                document.querySelector(`.pagination_link.${item}-list_pagination span.next`).classList.add('hide');
            break;
            case '<':
                itemLinks.forEach(itemLink => itemLink.classList.remove('hide'));
                itemLinks.forEach(itemLink => {
                    if(itemLink.textContent !== '<<' && itemLink.textContent !== '<' && itemLink.textContent !== '>>' && itemLink.textContent !== '>' ){

                        if(((Number(itemLink.textContent) - displayLinkNumber) >= Number(range[1]))){
                            itemLink.textContent = Number(itemLink.textContent) - displayLinkNumber;
                        }else{
                            document.querySelector(`.pagination_link.${item}-list_pagination span.prev`).classList.add('hide');
                        }
                    }
                });
            break;
            case '<<':
                itemLinks.forEach(itemLink => itemLink.classList.remove('hide'));
                itemLinks.forEach((itemLink, index) => {
                    
                    if(itemLink.textContent !== '<<' && itemLink.textContent !== '<' && itemLink.textContent !== '>>' && itemLink.textContent !== '>' ){
                        itemLink.textContent = index - 1;
                    }
                });
                document.querySelector(`.pagination_link.${item}-list_pagination span.prev`).classList.add('hide');
            break;
            default:
                paginationLink.classList.add('active');
                let start = ((Number(paginationLink.textContent) - 1) * limit);
                document.getElementById(`${item}s_list`).innerHTML = '';
                let identifier = item;
                renderPageData(data.slice(start, (start + limit)), start, identifier);
        }
    }));
}

// AUTO REFRESH AFTER TWO MINUTES
// setInterval( () => {
//     $.ajax({
//         url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
//         type: "POST",
//         dataType  : 'json',
//         data: {'action':'fetchAllBranchProducts', 'branch_id': site.session.branch_id},
//         success: function(data){
//             if(data.length > 0){
//                 // ADD EVERY PRODUCT DATA GOT TO SITE DATA
//                 site.productInventoryList = [];
//                 site.productInventoryList = data;
//                 // UPDATE SITE DATA
//                 localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
//                 site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
//                 generatePegination(site.productInventoryList, 'warehouseInventory');
//                 loadProductInventoryList()

//             }
//         }
//     });
// }, 120000);


// const fetchAllProduct = () => {
//         $.ajax({
//             url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
//             type: "POST",
//             dataType  : 'json',
//             data: {'action':'fetchAllBranchProducts', 'branch_id': site.session.branch_id},
//             success: function(data){
//                 if(data.length > 0){
//                     // ADD EVERY PRODUCT DATA GOT TO SITE DATA
//                     site.productInventoryList = [];
//                     site.productInventoryList = data;
//                     // UPDATE SITE DATA
//                     localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
//                     site = JSON.parse(localStorage.getItem('warehouse.pos.lifestyleoutdoorgear'));
//                     generatePegination(site.productInventoryList);
//                     loadProductInventoryList()

//                 }
//             },
//             complete:function(data){
//                 setTimeout(fetchAllProduct(), 120000);
//             }
//         });
// }
// setTimeout(fetchAllProduct(), 120000);


// const renderPageData = (list, count = 0, revealed = 'unrevealed') => {
//     let productContainer = document.getElementById('products_list');
//     let productTr = '';
//     list.forEach((productDetails, index) => {
//         let bg = (index%2 == 0) ? 'white' : 'ghostwhite';
//         productTr = `
//             <tr class="item-details ${bg} ${revealed} revealer">
//                 <td><label class="counter">${count + 1}</label></td>
//                 <td class="product-data"><label class="fixed-width">${productDetails.name}</label></td>
//                 <td>
//                     <label class="action">
//                         <span class="material-symbols-outlined primary all-inventory-edit">edit</span>
//                         <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
//                         <span class="material-symbols-outlined warning all-inventory-check">radio_button_unchecked</span>
//                     </label>
//                 </td>
//                 <td class="product-data select-data" data-category-list='[{"name": "Short"},{"name": "Pant"}, {"name": "Shirt"}]'><label class="category">${productDetails.category_name}</label></td>
//                 <td class="product-data"><label class=" warning">${productDetails.buy_price}</label></td>
//                 <td class="product-data"><label class=" success">${productDetails.sale_price}</label></td>
//                 <td class="product-data select-data" data-brand-list='[{"name": "North Face"},{"name": "Columbia"}, {"name": "Nike"}]'><label class="brand">${productDetails.brand_name}</label></td>
//                 <td class="product-data select-data" data-size-list='[{"name": "Number eg. 45"},{"name": "Special Case"}, {"name": "Character eg XL"}]'><label class="sizing">${productDetails.scheme_name}</label></td>
//                 <td class="product-data"><label class=" primary">${productDetails.code_initual}</label></td>
//                 <td class="product-data select-data" data-supplier-list='[{"name": "Hana Daniel"},{"name": "Daniel Viet"}, {"name": "Hana Viet"}]'><label class="supplier">${productDetails.supplier}</label></td>
//             </tr>
//         `;
//         productContainer.insertAdjacentHTML('beforeend', productTr);
//         count++;
//     });

//     reveal();
// 
    
// }
const reveal = (identifier) => {
    let number = 0;
    const trp = document.querySelectorAll(`.${identifier}revealer`);
    trp.forEach((tr, index)=> {
        tr.classList.remove('unrevealed');
        let duration = ((index+1)/trp.length);
        tr.style.animationDuration = `${duration}s`;
    });
}

const renderPageData = (data, count = 0, identifier, revealed = 'unrevealed') => {
    let bg;
    let itemContainer = '';
    let templateString = '';
    switch(identifier){
        case 'product':
            itemContainer = document.getElementById('products_list');
            templateString = '';
            data.forEach((itemDetails, index) => {
                bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                templateString = `
                    <tr class="item-details ${bg} ${revealed} ${identifier}revealer">
                        <td><label class="counter">${count + 1}</label></td>
                        <td class="product-data"><label class="fixed-width">${itemDetails.name}</label></td>
                        <td>
                            <label class="action">
                                <span class="material-symbols-outlined primary all-inventory-edit">edit</span>
                                <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
                                <span class="material-symbols-outlined warning all-inventory-check">radio_button_unchecked</span>
                            </label>
                        </td>
                        <td class="product-data select-data" data-category-list='[{"name": "Short"},{"name": "Pant"}, {"name": "Shirt"}]'><label class="category">${itemDetails.category_name}</label></td>
                        <td class="product-data"><label class=" warning">${itemDetails.buy_price}</label></td>
                        <td class="product-data"><label class=" success">${itemDetails.sale_price}</label></td>
                        <td class="product-data select-data" data-brand-list='[{"name": "North Face"},{"name": "Columbia"}, {"name": "Nike"}]'><label class="brand">${itemDetails.brand_name}</label></td>
                        <td class="product-data select-data" data-size-list='[{"name": "Number eg. 45"},{"name": "Special Case"}, {"name": "Character eg XL"}]'><label class="sizing">${itemDetails.scheme_name}</label></td>
                        <td class="product-data"><label class=" primary">${itemDetails.code_initual}</label></td>
                        <td class="product-data select-data" data-supplier-list='[{"name": "Hana Daniel"},{"name": "Daniel Viet"}, {"name": "Hana Viet"}]'><label class="supplier">${itemDetails.supplier}</label></td>
                    </tr>
                `;
                itemContainer.insertAdjacentHTML('beforeend', templateString);
                count++;
            });
        break;

        case 'warehouseinventory':
            itemContainer = document.getElementById('warehouseinventorys_list');
            templateString = '';
            data.forEach((itemDetails, index) => {
                bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                templateString = `

                        <tr class="${bg} ${revealed} ${identifier}revealer">
                            <td><label class="counter">${count + 1}</label></td>
                            <td class="inventory-data select-data" data-product-list='[{"name": "5.11 Roundneck Longsleeve T-Shirts"},{"name": "Under Armour Fish T-Shirt Polo"}, {"name": "Nike Sweaters"}]'><label class="fixed-width">${itemDetails.name}</label></td>
                            <td>
                                <label class="action">
                                    <span class="material-symbols-outlined primary all-inventory-edit">edit</span>
                                    <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
                                    <span class="material-symbols-outlined warning all-inventory-check">radio_button_unchecked</span>
                                </label>
                            </td>
                            <td class="inventory-data  "><label class="counter">${itemDetails.quantity}</label></td>
                            <td class="inventory-data select-data" data-status-list='[{"name": "Pending"},{"name": "Out of Stock"}, {"name": "Available"}]'><label class="success">${(itemDetails.quantity > 0) ? 'Available': 'Out of Stork'}</label></td>
                            <td class="inventory-data  ">
                                <div class="image">
                                    <img src="./images/${itemDetails.image}" alt="">
                                    <label for="upload-product-image" title="Click to choose new image to upload">
                                        <span class="material-symbols-outlined">cloud_sync</span>
                                        <input type="file" id="upload-product-image">
                                    </label>
                                </div>
                                <img src="./images/${itemDetails.image}" class="preview-image">
                            </td>
                            <td class="inventory-data  "><label class="primary">${itemDetails.code}</label></td>
                            <td class="inventory-data  "><label class="">${itemDetails.color}</label></td>
                            <td class="inventory-data  "><label class="counter">${itemDetails.size}</label></td>
                            <td class="inventory-data  "><label class="fixed-width">${itemDetails.desc}</label></td>
                        </tr> 


                `;
                itemContainer.insertAdjacentHTML('beforeend', templateString);
                count++;
            });
        break;

        case 'user':
            itemContainer = document.getElementById('users_list');
            templateString = '';
            data.forEach((itemDetails, index) => {
                bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                templateString = `
                        
                        <tr class="${bg} ${revealed} ${identifier}revealer">
                            <td><label class="counter">${count + 1}</label></td>
                            <td class="user-data"><label class="short-fixed">${itemDetails.first_name}</label></td>
                            <td class="user-data"><label class="short-fixed">${itemDetails.username}</label></td>
                            <td class="inventory-data "><label class="password">*******************</label></td>
                            <td>
                                <label class="action">
                                    <span class="material-symbols-outlined primary all-inventory-edit">edit</span>
                                    <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
                                    <span class="material-symbols-outlined warning all-inventory-check">sync</span>
                                </label>
                            </td>
                            <td class="user-data select-data" data-user-type-list='[{"name": "Attendant"},{"name": "Admin"}, {"name": "Customer"}]'><label class="primary">${itemDetails.user_type}</label></td>
                            <td class="inventory-data select-data" data-status-list='[{"name": "Pending"},{"name": "Out of Stock"}, {"name": "Available"}]'><label class="success counter">${itemDetails.status}</label></td>
                            <td class="inventory-data  ">
                                <div class="image">
                                    <img src="./images/${itemDetails.image}" alt="">
                                    <label for="upload-product-image" title="Click to choose new image to upload">
                                        <span class="material-symbols-outlined">cloud_sync</span>
                                        <input type="file" id="upload-product-image">
                                    </label>
                                </div>
                                <img src="./images/${itemDetails.image}" class="preview-image">
                            </td>
                            <td class="user-data"><label>${itemDetails.telephone}</label></td>
                            <td class="user-data select-data" data-branch-list='[{"name": "Victoria Mall"},{"name": "Purical Hotel"}, {"name": "Arena Mall"}]'><label>${itemDetails.branch}</label></td>
                            <td class="user-data"><label>${itemDetails.address}</label></td>
                            <td class="user-data  "><label class="fixed-width">${itemDetails.email}</label></td>
                        </tr> 

                `;
                itemContainer.insertAdjacentHTML('beforeend', templateString);
                count++;
            });
        break;

        case 'supplier':
            itemContainer = document.getElementById('suppliers_list');
            templateString = '';
            data.forEach((itemDetails, index) => {
                bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                templateString = `
                        <tr class="${bg} ${revealed} ${identifier}revealer">
                            <td><label class="counter">${count + 1}</label></td>
                            <td class="user-data"><label class="short-fixed">${itemDetails.first_name}</label></td>
                            <td class="user-data"><label class="short-fixed">${itemDetails.last_name}</label></td>
                            <td>
                                <label class="action">
                                    <span class="material-symbols-outlined primary all-inventory-edit">edit</span>
                                    <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
                                    <span class="material-symbols-outlined warning all-inventory-check">sync</span>
                                </label>
                            </td>
                            <td class="user-data"><label>${itemDetails.telephone}</label></td>
                            <td class="user-data"><label>${itemDetails.address}</label></td>
                            <td class="inventory-data select-data" data-status-list='[{"name": "Pending"},{"name": "Out of Stock"}, {"name": "Available"}]'><label class="success counter">active</label></td>
                            <td class="user-data"><label class="price warning">${itemDetails.date}</label></td>
                            <td class="user-data  "><label class="fixed-width">${itemDetails.email}</label></td>
                        </tr>


                `;
                itemContainer.insertAdjacentHTML('beforeend', templateString);
                count++;
            });
        case 'invoice':
            itemContainer = document.getElementById('invoices_list');
            templateString = '';
            data.forEach((itemDetails, index) => {
                bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                templateString = `
                        <tr class="${bg} ${revealed} ${identifier}revealer">
                            <td><label class="counter">${count + 1}</label></td>
                            <td class="user-data"><label>${itemDetails.branch}</label></td>
                            <td class="user-data count"><label class="short-fixed">${itemDetails.invoice_no}</label></td>
                            <td class="user-data count"><label class="short-fixed">${itemDetails.totalItems}</label></td>
                            <td class="user-data"><label>${itemDetails.totalPrice}</label></td>
                            <td>
                                <label class="action">
                                    <span class="material-symbols-outlined primary all-inventory-edit">edit</span>
                                    <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
                                    <span class="material-symbols-outlined success all-inventory-check">dashboard</span>
                                </label>
                            </td>
                            <td class="inventory-data select-data" ><label >${itemDetails.attendant}</label></td>
                            <td class="user-data"><label class="price warning">${itemDetails.date}</label></td>
                            <td class="user-data  "><label class="">${itemDetails.customer_name}</label></td>
                        </tr>


                `;
                itemContainer.insertAdjacentHTML('beforeend', templateString);
                count++;
            });
        break;

    }
    reveal(identifier);

    
}


const loadPageData = (data, identifier, limit) => {
    let activePeginationLink = document.querySelector( `.pagination_link.${identifier}-list_pagination span.active`);
    let start = 0;
    if(activePeginationLink){
        start = ((Number(activePeginationLink.textContent) - 1) * limit);
    }
    document.getElementById(`${identifier}s_list`).innerHTML = '';
    renderPageData(data.slice(start, (start + limit)), start, identifier);
}
const uploadFile = (uploadBtn) => {
        var form_data = new FormData();
        // Read selected files
        var totalfiles = uploadBtn.files.length;
        if(totalfiles != 0){
            form_data.append("files[]", uploadBtn.files[0]);
        }

        // UPLOADING
        let ajaxRequest = $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: 'post',
            data: form_data,
            dataType: 'json',
            contentType: false,
            processData: false
        });

        return ajaxRequest

    }
document.addEventListener('DOMContentLoaded', () => {
    // LOAD PRODUCT LIST
    setTimeout(dataRequest('Product', {'limit': 15,'action':'getLimitedProducts', 'page': page}, 1), 0);

    // LOAD WAREHOUSE INVENTORY PRODUCT LIST
    setTimeout(dataRequest('WarehouseInventory', {'limit': 15,'action':'getLimitedWarehouseInventory', 'page': page}, 1), 0);

    // LOAD USER LIST
    setTimeout(dataRequest('User', {'limit': 15,'action':'getLimitedUsers', 'page': page}, 1), 0);

    // LOAD SUPPLIER LIST
    setTimeout(dataRequest('Supplier', {'limit': 15,'action':'getLimitedSuppliers', 'page': page}, 1), 0);

    // LOAD INVOICE LIST
    setTimeout(dataRequest('Invoice', {'limit': 15,'action':'getLimitedInvoices', 'page': page}, 1), 0);



    // ON PAGE LOAD & RELOAD
    setTimeout(() => {
        document.querySelector('#products_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') 
        if(site.productList){
            generatePegination(site.productList, 'product');
            removeElement('div.preloader');
            loadPageData(site.productList, 'product', limit);
        }

        document.querySelector('#warehouseinventorys_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') 
        if(site.warehouseInventoryList){
            generatePegination(site.warehouseinventoryList, 'warehouseinventory');
            removeElement('div.preloader');
            loadPageData(site.warehouseinventoryList, 'warehouseinventory', limit);
        }

        document.querySelector('#users_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') 
        if(site.userList){
            generatePegination(site.userList, 'user');
            removeElement('div.preloader');
            loadPageData(site.userList, 'user', limit);
        }

        document.querySelector('#suppliers_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') 
        if(site.supplierList){
            generatePegination(site.supplierList, 'supplier');
            removeElement('div.preloader');
            loadPageData(site.supplierList, 'supplier', limit);
        }
        document.querySelector('#invoices_list').insertAdjacentHTML('beforeend', '<div class="preloader"></div>') 
        if(site.invoiceList){
            generatePegination(site.invoiceList, 'invoice');
            removeElement('div.preloader');
            loadPageData(site.invoiceList, 'invoice', limit);
        }
    }, 0);

    // IMPORT CSV DATA TO DATABASE
    document.getElementById('import_btn').addEventListener('change', () => {

        const img = document.getElementById('import_btn');
        if (img.files.length == 0){
            console.log('nothing');
        }else{
            let res = uploadFile(document.getElementById('import_btn'));
            console.log(res)

            res.always(data => {
                console.log(data)
            })

        }
    })

    // SIGNOUT
    document.querySelector('.signout-btn').addEventListener('click', () => {
        delete site.session;
        localStorage.setItem('warehouse.pos.lifestyleoutdoorgear', JSON.stringify(site));
        window.location ='./signin.html';
    });
	// SIDE MENU/NAVIGATION
	const menuToggle = document.querySelector('.menu-toggle');
        menuToggle.addEventListener('click', () => {
        if(menuToggle.textContent == 'menu'){
            document.querySelector('main').classList.remove('cover');
            document.querySelector('.logo img').setAttribute('src', './images/logo.png');
            document.querySelector('.logo img').classList.remove('box');
            document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => navTitle.style.marginLeft = "8%");
            document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "0");
            document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '22px')
            menuToggle.textContent = 'close';
            document.querySelector('.search-field').classList.add('hide');
        }else{
            document.querySelector('main').classList.add('cover');
            document.querySelector('.logo img').setAttribute('src', './images/box-logo.png');
            document.querySelector('.logo img').classList.add('box');
            document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => {navTitle.style.marginLeft = "1%"});
            document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "12%");
            document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '25px')
            menuToggle.textContent = 'menu';
            document.querySelector('.search-field').classList.add('hide');
        }
    });
    // MENU
    const closeSideMenu = document.getElementById('close-side-bar');
    closeSideMenu.addEventListener('click', () => {
        document.querySelector('main').classList.add('cover');
        document.querySelector('.logo img').setAttribute('src', './images/box-logo.png');
        document.querySelector('.logo img').classList.add('box');
        document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => {navTitle.style.marginLeft = "1%"});
        document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "12%");
        document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '25px')
        menuToggle.textContent = 'menu';
        document.querySelector('.search-field').classList.add('hide');
    });

    // SIDE BAR
    const sideNavLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    sideNavLinks.forEach(navLink => {
    	navLink.addEventListener('click', (e) =>  {
    		e.preventDefault();

    		sideNavLinks.forEach(navLink => navLink.classList.remove('active'));
    		navLink.classList.add('active');

    		let nxtPage = document.getElementById(navLink.dataset.page);
    		// let prvPage = document.querySelector('.page .active');
    		pages.forEach(page => page.classList.remove('active'));

    		// prvPage.classList.remove('active');
    		nxtPage.classList.add('active');
    		if(Number(document.querySelector('aside').clientWidth) > 300){

	    		document.querySelector('main').classList.add('cover');
		        document.querySelector('.logo img').setAttribute('src', './images/box-logo.png');
		        document.querySelector('.logo img').classList.add('box');
		        document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => {navTitle.style.marginLeft = "1%"});
		        document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "12%");
		        document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '25px')
		        menuToggle.textContent = 'menu';
		        document.querySelector('.search-field').classList.add('hide');
    		}
    	})
    })
    // TOP NAVIGATION SEARCH
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        document.querySelector('.search-field').classList.toggle('hide');
    });
    // TOP NAVIGATION THEME
    const themeBtn = document.querySelector('.top-nav label.theme');
    const themeMenu = document.querySelector('.theme-menu');
    const themeClosetn = document.querySelector('.theme-menu__close');
    themeBtn.addEventListener('click', () => {
        themeMenu.classList.toggle('active');
    });
    themeClosetn.addEventListener('click', () => {
        themeMenu.classList.toggle('active');
    });

    const themeCs = document.querySelectorAll('.mode-list__color');
    themeCs.forEach(themeC => {
        themeC.addEventListener('click', () => {
            themeCs.forEach(themeCl => themeCl.childNodes[1].classList.remove('active'));
            themeC.childNodes[1].classList.add('active');
        })
    });


    // FILTRATION
    const filtrationBox = document.querySelectorAll('.title-modifications');
    const filtrationBtn = document.querySelectorAll('.section-title span.table-filter');
    filtrationBtn.forEach(btn => btn.addEventListener('click', () => {
    	filtrationBox.forEach(ftBx => ftBx.classList.toggle('hide'));
    	console.log(filtrationBox, filtrationBtn)
    }))
});

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
