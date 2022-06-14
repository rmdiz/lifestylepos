
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

const loadSessionData =(dataName, limit) => {
    document.querySelector(`#${dataName}s_list`).insertAdjacentHTML('beforeend', '<div class="preloader"></div>') 
    if(site[`${dataName}List`]){
        generatePegination(site[`${dataName}List`], dataName);
        removeElement('div.preloader');
        loadPageData(site[`${dataName}List`], dataName, limit);
    }
}

const dataRequest = (requestName, requestData, counter, reload = 'false') => {
    let lowerCaseRqtNm = requestName.toLowerCase(); // eg invoice NOTE:: requestName must be received with its first letter capital ang it shoudn't be in plural eg. Invoice
    let localStorageNm = `${lowerCaseRqtNm}List`; //eg invoiceList
    let action = `getAll${requestName}s`; // eg. getAllInvoice Note:: first letter of requestName must be capital
    if(reload == true || (!site[localStorageNm])){
        (!site[localStorageNm]) ? document.querySelector(`#${lowerCaseRqtNm}s_list`).insertAdjacentHTML('beforeend', '<div class="preloader"></div>') : removeElement('div.preloader');
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                removeElement('div.preloader');
                if(data.length > 0){

                    // ONLY RENDER DATA TO PAGE AT THE FIRST REQUEST
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

const generatePegination = (data, item, limit = 15, displayLinkNumber = 10) => {
    let pages = 1;  
    let range = []; 
    let total = data.length;
    let peginationLink = document.querySelector(`.pagination_link.${item}-list_pagination`);
    if(total > limit){
        let page = Math.ceil(total/limit);
        // let page = Math.floor(total/limit);
        pages = total & limit === 0 ? page : page + 1;
        range = [...Array(pages).keys()];

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
    }else{
        peginationLink.innerHTML = '';
    }

}
const paginationManipulation = (displayLinkNumber, range, data, item, limit) => {
    let itemLinks = document.querySelectorAll(`.pagination_link.${item}-list_pagination span`);
    console.log(limit)
    itemLinks.forEach(paginationLink => paginationLink.addEventListener('click', () => {
        itemLinks.forEach(itemLink => {itemLink.classList.remove('active')});

        switch(paginationLink.textContent){
            case '>':

                itemLinks.forEach(itemLink => {itemLink.classList.remove('hide')});
                itemLinks.forEach(itemLink => {
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
                let tracker = [];
                itemLinks.forEach(itemLink => {
                    if(itemLink.textContent !== '<<' && itemLink.textContent !== '<' && itemLink.textContent !== '>>' && itemLink.textContent !== '>' ){

                        if(((Number(itemLink.textContent) - displayLinkNumber) >= Number(range[1]))){
                            itemLink.textContent = Number(itemLink.textContent) - displayLinkNumber;
                            tracker.push(Number(itemLink.textContent) - displayLinkNumber);
                        }else{
                            document.querySelector(`.pagination_link.${item}-list_pagination span.prev`).classList.add('hide');
                        }
                    }
                });
                if(tracker.length < 10){
                    let newLinks = [Number(range[0])];
                    for (var i = 0; i <= 11; i++) {
                        newLinks.push(Number(range[0]) + i);
                        if(itemLinks[i].textContent !== '<<' && itemLinks[i].textContent !== '<' && itemLinks[i].textContent !== '>>' && itemLinks[i].textContent !== '>' ){
                           itemLinks[i].textContent = newLinks[i];
                        }
                    }
                }
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
                let start = ((Number(paginationLink.textContent) - 1) * limit);
                document.getElementById(`${item}s_list`).innerHTML = '';
                let identifier = item;
                renderPageData(data.slice(start, (start + limit)), start, identifier);
                paginationLink.classList.add('active');

        }

        // CALL ON EACH PAGINATION DATA
        // pageTbModifications();

    }));
}

// GET TOTALS AND COMPARE WITH CURRENT VALUES
const getTotals = (requestData) => {
    setTimeout(() => {
        $.ajax({
            url: "http://localhost/warehouse.lifestyleoutdoorgear/api/route.php",
            type: "POST",
            dataType  : 'json',
            data: requestData,
            success: function(data){
                if(data.length > 0 ){
                    data.forEach(res => {
                        let requestName = Object.keys(res)[0];
                        let total = res[requestName];
                        let lowerCaseRqtNm = requestName.toLowerCase();
                        let localStorageNm = `${lowerCaseRqtNm}List`; //eg invoiceList
                        if(site[localStorageNm]){
                            if(total != site[localStorageNm].length){
                                dataRequest(requestName, {'limit': 15,'action': `getAll${requestName}s`}, 2, true);
                            }
                        }
                    })
                }
            }
        });
    }, 0);
};

// AUTO REFRESH SITE AFTER 5 Secounds IF THEIR ARE CHANGES IN DATA
setInterval( () => {
    let requestData = {'action':'getTotal', 'tbs': "WarehouseInventory|warehouseInventory_tb|Invoice|invoice_tb|Product|product_detail_tb|User|user_tb"};
    getTotals(requestData);
}, 5000); //600000


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
    let itemContainer = document.getElementById(`${identifier}s_list`);
    let templateString = '';
    let modifiedTemplateString = ``;
    switch(identifier){
        case 'product':
            templateString = '';
            modifiedTemplateString = `

                                <tr>
                                    <th><span>Name</span></th>
                                    <th><span>Category</span></th>
                                    <th><span>Buy</span></th>
                                    <th><span>Sale</span></th>
                                    <th <<span>Brand</span></th>
                                    <th><span>S.Scheme</span></th>
                                    <th <<span>Code</span></th>
                                    <th><span>Supplier</span></th>
                                </tr>
            `;
            if(data.length > 0){
                data.forEach((itemDetails, index) => {
                    templateString = `
                        <tr class="item-details ${revealed} ${identifier}revealer">
                            <td data-d-type="text"><label class="counter">${count + 1}</label></td>
                            <td data-d-type="text" class="editable-data directInput" data-info="productList" data-action="negative" data-name="product_name"><label class="fixed-width">${itemDetails.name}</label></td>
                            <td data-d-type="text">
                                <label class="action">
                                    <span class="material-symbols-outlined primary inline-edit" data-id="${itemDetails.id}" data-tb="product" data-index="${index}">edit</span>
                                    <span class="material-symbols-outlined danger inline-delete" data-id="${itemDetails.id}" data-tb="product" data-tbl="product_detail_tb" data-field='product_id' data-index="${index}">close</span>
                                </label>
                            </td>
                            <td data-d-type="text" class="editable-data select-data categoryList" data-name="category_id"><label class="category">${itemDetails.category_name}</label></td>
                            <td data-d-type="int" class="editable-data" data-name="buy_price"><label class=" warning">${itemDetails.buy_price}</label></td>
                            <td data-d-type="int" class="editable-data" data-name="sale_price"><label class=" success">${itemDetails.sale_price}</label></td>
                            <td data-d-type="text" class="editable-data select-data brandList" data-name="brand_id"><label class="brand">${itemDetails.brand_name}</label></td>
                            <td data-d-type="text" class="editable-data select-data sizeSchemeList" data-name="size_scheme_id"><label class="sizing">${itemDetails.scheme_name}</label></td>
                            <td data-d-type="text" class="editable-data directInput" data-info="productList" data-action="negative" data-name="code_initual"><label class=" primary">${itemDetails.code_initual}</label></td>
                            <td data-d-type="text" class="editable-data select-data supplierList" data-name="supplier_id"><label class="supplier">${itemDetails.supplier}</label></td>
                        </tr>
                    `;
                    itemContainer.insertAdjacentHTML('beforeend', templateString);
                    count++;
                    // MODIFIED FOR EXPORT
                    modifiedTemplateString += `
                        <tr>
                            <td data-d-type="text" class="editable-data directInput" data-info="productList" data-action="negative" data-name="product_name"><label class="fixed-width">${itemDetails.name}</label></td>
                            <td data-d-type="text" class="editable-data select-data categoryList" data-name="category_id"><label class="category">${itemDetails.category_name}</label></td>
                            <td data-d-type="int" class="editable-data" data-name="buy_price"><label class=" warning">${itemDetails.buy_price}</label></td>
                            <td data-d-type="int" class="editable-data" data-name="sale_price"><label class=" success">${itemDetails.sale_price}</label></td>
                            <td data-d-type="text" class="editable-data select-data brandList" data-name="brand_id"><label class="brand">${itemDetails.brand_name}</label></td>
                            <td data-d-type="text" class="editable-data select-data sizeSchemeList" data-name="size_scheme_id"><label class="sizing">${itemDetails.scheme_name}</label></td>
                            <td data-d-type="text" class="editable-data directInput" data-info="productList" data-action="negative" data-name="code_initual"><label class=" primary">${itemDetails.code_initual}</label></td>
                            <td data-d-type="text" class="editable-data select-data supplierList" data-name="supplier_id"><label class="supplier">${itemDetails.supplier}</label></td>
                        </tr>
                    `;
                });
                // ADD EVENT LISNER FOR EDITING TABLE DATA
                inlineTableClickActions('Products', 8, 'updateProduct');
                itemContainer.parentElement.parentElement.lastElementChild.innerHTML = ('beforeend', modifiedTemplateString);

            }else{
                templateString = `
                    <tr>
                        <td colspan='10'><label class="warning">nothing Found</label></td>
                    </tr>
                `;
                itemContainer.innerHTML = templateString;
            }
            removeElement('div.preloader');
            generateTblTitleFilter('Product', 'category_id', 'filter_by_category', 'category');
            filterByLimit('Product', 'category_id', 'filter_by_category', 'category');
        break;

        case 'warehouseinventory':
            templateString = '';
            modifiedTemplateString = `
                        <tr>
                            <th><span>Name</span></th>
                            <th><span>Qty</span></th>
                            <th><span>Status</span></th>
                            <th><span>Code</span></th>
                            <th><span>Colour</span></th>
                            <th><span>Size</span></th>
                            <th><span>Description</span></th>
                        </tr>
                        `;
            if(data.length > 0){
                data.forEach((itemDetails, index) => {
                    bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                    templateString = `

                            <tr class="${bg} ${revealed} ${identifier}revealer">
                                <td><label class="counter">${count + 1}</label></td>
                                <td data-d-type="text" class="editable-data select-data productList"  name="autoBased" data-auto-based="${itemDetails.name}" data-action="negative" data-name="product_id"><label class="fixed-width">${itemDetails.name}</label></td>
                                <td data-d-type="text">
                                    <label class="action">
                                        <span class="material-symbols-outlined primary inline-edit" data-id="${itemDetails.id}" data-tb="warehouseinventory" data-index="${index}">edit</span>
                                        <span class="material-symbols-outlined danger inline-delete" data-id="${itemDetails.id}" data-tb="warehouseinventory" data-tbl="warehouseInventory_tb" data-field='inventory_id' data-index="${index}">close</span>
                                    </label>
                                </td>
                                <td data-d-type="text" class="editable-data" data-name="quantity"><label>${itemDetails.quantity}</label></td>
                                <td data-d-type="text"><label class="success">${(itemDetails.quantity > 0) ? 'Available': 'Out of Stork'}</label></td>
                                <td data-d-type="text" >
                                    <div class="image">
                                        <img src="./images/${itemDetails.image}" alt="">
                                        <label for="upload-product-image" title="Click to choose new image to upload">
                                            <span class="material-symbols-outlined">cloud_sync</span>
                                            <input type="file" id="upload-product-image">
                                        </label>
                                    </div>
                                    <img src="./images/${itemDetails.image}" class="preview-image">
                                </td>
                                <td data-d-type="text" class="editable-data  directInput"  data-action="negative" data-name="code"><label class="primary">${itemDetails.code}</label></td>
                                <td data-d-type="text" class="editable-data  select-data colorList" name="autoBased" data-auto-based="${itemDetails.color}"   data-action="negative" data-name="colour_id"><label class="">${itemDetails.color}</label></td>
                                <td data-d-type="text" class="editable-data  select-data sizeList" name="autoBased" data-auto-based="${itemDetails.size}"   data-action="negative" data-name="size_id"><label>${itemDetails.size}</label></td>
                                <td data-d-type="text" class="editable-data  autogenerated"  data-action="negative" data-name="description"><label class="fixed-width">${itemDetails.desc}</label></td>
                            </tr> 


                    `;
                    itemContainer.insertAdjacentHTML('beforeend', templateString);
                    count++;
                    // MODIFIED FOR EXPORT
                    modifiedTemplateString += `
                        <tr class="${bg} ${revealed} ${identifier}revealer">
                                <td class="inventory-data select-data" data-product-list='[{"name": "5.11 Roundneck Longsleeve T-Shirts"},{"name": "Under Armour Fish T-Shirt Polo"}, {"name": "Nike Sweaters"}]'><label class="fixed-width">${itemDetails.name}</label></td>
                                <td class="inventory-data  "><label class="counter">${itemDetails.quantity}</label></td>
                                <td class="inventory-data select-data" data-status-list='[{"name": "Pending"},{"name": "Out of Stock"}, {"name": "Available"}]'><label class="success">${(itemDetails.quantity > 0) ? 'Available': 'Out of Stork'}</label></td>
                                <td class="inventory-data  "><label class="primary">${itemDetails.code}</label></td>
                                <td class="inventory-data  "><label class="">${itemDetails.color}</label></td>
                                <td class="inventory-data  "><label class="counter">${itemDetails.size}</label></td>
                                <td class="inventory-data  "><label class="fixed-width">${itemDetails.desc}</label></td>
                            </tr> 
                    `;
                });

                // ADD EVENT LISNER FOR EDITING TABLE DATA
                inlineTableClickActions('WarehouseInventorys', 7, 'updateWarehouseinventory');
                itemContainer.parentElement.parentElement.lastElementChild.innerHTML = ('beforeend', modifiedTemplateString);

            }else{
                templateString = `
                    <tr>
                        <td colspan='10'><label class="warning">nothing Found</label></td>
                    </tr>
                `;
                itemContainer.innerHTML = templateString;
            }
            removeElement('div.preloader');

            generateTblTitleFilter('WarehouseInventory', 'brand_id', 'filter_by_brand', 'brand');
            filterByLimit('WarehouseInventory', 'brand_id', 'filter_by_brand', 'brand');
        
        break;

        case 'user':
            templateString = '';
            if(data.length > 0){
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
            }else{
                templateString = `
                    <tr>
                        <td colspan='10'><label class="warning">nothing Found</label></td>
                    </tr>
                `;
                itemContainer.innerHTML = templateString;
            }
            removeElement('div.preloader');
        break;

        case 'supplier':
            templateString = '';
            if(data.length > 0){
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
                                <td class="user-data"><label class="fixed-width">${itemDetails.email}</label></td>
                            </tr>


                    `;
                    itemContainer.insertAdjacentHTML('beforeend', templateString);
                    count++;
                });
            }else{
                templateString = `
                    <tr>
                        <td colspan='10'><label class="warning">nothing Found</label></td>
                    </tr>
                `;
                itemContainer.innerHTML = templateString;
            }
        break;
        case 'invoice':
            templateString = '';
            if(data.length > 0){
                data.forEach((itemDetails, index) => {
                    bg = (index%2 == 0) ? 'white' : 'ghostwhite';
                    templateString = `
                            <tr class="${bg} ${revealed} ${identifier}revealer">
                                <td><label class="counter">${count + 1}</label></td>
                                <td class="user-data"><label>${itemDetails.branch}</label></td>
                                <td>
                                    <label class="action">
                                        <span class="material-symbols-outlined primary all-inventory-edit">sync</span>
                                        <span class="material-symbols-outlined danger all-inventoy-delete">close</span>
                                        <span class="material-symbols-outlined success showinvoicedetails-btn">add</span>
                                    </label>
                                </td>
                                <td class="user-data count"><label class="short-fixed">${itemDetails.invoice_no}</label></td>
                                <td class="user-data count"><label class="short-fixed">${itemDetails.totalItems}</label></td>
                                <td class="user-data"><label>${itemDetails.totalPrice}</label></td>
                                <td class="inventory-data select-data" ><label >${itemDetails.attendant}</label></td>
                                <td class="user-data"><label class="price warning">${itemDetails.date}</label></td>
                                <td class="user-data  "><label class="">${itemDetails.customer_name}</label></td>
                                <td class="det">
                                    ${generateInvoiceItems(itemDetails.invoiceDetails)}
                                </td>
                            </tr>


                    `;
                    itemContainer.insertAdjacentHTML('beforeend', templateString);
                    count++;
                });

                revealDetails();
            }else{
                templateString = `
                    <tr>
                        <td colspan='10'><label class="warning">nothing Found</label></td>
                    </tr>
                `;
                itemContainer.innerHTML = templateString;
            }
            removeElement('div.preloader');
        break;

    }
    reveal(identifier);
}
      
function export_table_to_csv (table, csv_name, download_link) {
    var csv = [];
    var rows = table.querySelectorAll("tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        
        csv.push(row.join(","));        
    }

    var csv_string = csv.join("\n");
    var csv_blob = new Blob([csv_string], {type: "text/csv"});
    var csv_href = window.URL.createObjectURL(csv_blob);

    download_link.href = csv_href;
    download_link.download = csv_name + '.csv';
} 
// ADD NEW ROW TO THE TABLE 
const addTableRow = (btn, identifier, itemSpecification, epectedTblFields) => {
    btn.addEventListener('click', (e) => {
        if(btn.childNodes[1].textContent == 'add'){
            let tr = document.createElement('tr');
            tr.classList.add(`${itemSpecification}`);
            tr.classList.add(`${itemSpecification}-add`);
            document.getElementById(identifier).prepend(tr);
            let activeTr = document.querySelector(`.${itemSpecification}-add`);
            activeTr.innerHTML = (identifier == 'products_list') ? generateProductTR () : generateInventoryTR();
            // btn.childNodes[1].textContent = (btn.childNodes[1].textContent == 'add') ? 'save' : 'add';
            validateInputs(btn);
            // SAVE ACTION BTN
            saveNewRow(itemSpecification, epectedTblFields);
        }
    });
}
const saveNewRow = (itemSpecification, epectedTblFields) => {
    let tr = document.querySelector(`.${itemSpecification}-add`);
    // GET THE INLINE EDIT BTN
    let inlineEdit = (tr.childNodes[5].childNodes[1].childNodes[1]);
    // ADD CLICK EVENT TO THE INLINE EDIT BTN
    inlineEdit.addEventListener('click', () => {
        tr.parentElement.after(preloader());
        let dataToSave = {};
        tr.childNodes.forEach((td, index) => {
            if((index != 0) && (index % 2 != 0) && td.classList.contains('editable-data')){  
                let data = (td.childNodes[1].childNodes[1].value);
                if(data != ''){
                    // COLLECT DATA TO UPDATE  
                    if(td.classList.length === 3){
                        let filteredItemDetails = site[td.classList[2]].filter(info => info.name == data);
                        dataToSave[td.dataset.name] = filteredItemDetails[0].id;
                    }else{
                        dataToSave[td.dataset.name] = data;
                    }
                }
            }
        });
        if(Object.keys(dataToSave).length == epectedTblFields){
            // UPDATE DATA
            requestDataChange(dataToSave, inlineEdit, 'saveProduct' , 'save', inlineEdit);
        }else if(Object.keys(dataToSave).length == 0){
            deliverNotification('All fields were empty! Operation canceled', 'danger');
            tr.remove();
            removeElement('div.preloader');
        }
        else{
            removeElement('div.preloader');
            deliverNotification('All fields required! Operation canceled', 'warning');

        }
    })
}

const generateProductTR = (categoryList, sizeList, supplierList, brandList) => {
    let dataList = [];
    let addRow = `
        <tr class="ghostwhite item-details">
            <td data-d-type="text"><label class="counter">0</label></td>
            <td data-d-type="text"  class="editable-data directInput" data-info="productList" data-action="negative" data-name="product_name">
                <label class="fixed-width">
                    <input  class="allInputs" type="text" placeholder="Enter Product Name">
                </label>
            </td>
            <td data-d-type="text">
                <label class="action">
                    <span class="material-symbols-outlined primary inline-edit" data-tb="product">save_as</span>
                    <span class="material-symbols-outlined danger inline-delete" data-tb="product">close</span>
                </label>
            </td>
            <td data-d-type="text"  class="editable-data select-data categoryList" data-name="category_id">
                <label class="category">
                    <input  class="allInputs" list="sels0" name="sel0" placeholder="Category" id="sel0">
                    <datalist id="sels0">
                    ${dataList = []}
                    ${site.categoryList.forEach(details => {dataList.push({'name': details.name})})}
                    ${generateOptions(dataList)}
                    </datalist>
                </label>
            </td>
            <td data-d-type="int"  class="editable-data  directInput" data-info="productList" data-action="negative"  data-name="buy_price">
                <label class="price warning">
                    <input  class="allInputs" type="text" placeholder="Buy price">
                </label>
            </td>
            <td data-d-type="int"  class="editable-data  directInput" data-info="productList" data-action="negative" data-name="sale_price">
                <label class="price success">
                    <input  class="allInputs" type="text" placeholder="Sale price">
                </label>
            </td>
            <td data-d-type="text"  class="editable-data select-data brandList" data-name="brand_id">
                <label class="brand">
                    <input  class="allInputs" list="sels01" name="sel01" placeholder="Choose brand"" id="sel01">
                    <datalist id="sels01">
                    ${dataList = []}
                    ${site.brandList.forEach(details => {dataList.push({'name': details.name})})}
                    ${generateOptions(dataList)}
                    </datalist>
                </label>
            </td>
            <td data-d-type="text"  class="editable-data select-data sizeSchemeList" data-name="size_scheme_id">
                <label class="sizing">
                    <input  class="allInputs" list="sels02" name="sel02" placeholder="Size scheme" id="sel02">
                    <datalist id="sels02">   
                    ${dataList = []}
                    ${site.sizeSchemeList.forEach(details => {dataList.push({'name': details.name})})}
                    ${generateOptions(dataList)}                     
                    </datalist>
                </label>
            </td>
            <td data-d-type="text"  class="editable-data  directInput" data-info="productList" data-action="negative" data-name="code_initual">
                <label class=" primary">
                    <input  class="allInputs" type="text" placeholder="Code ">
                </label>
            </td>
            <td data-d-type="text"  class="editable-data select-data supplierList" data-name="supplier_id">
                <label class="supplier">
                    <input  class="allInputs" list="sels03" name="sel03" placeholder="Add Supplier" id="sel03">
                    <datalist id="sels03">
                    ${dataList = []}
                    ${site.supplierList.forEach(details => {dataList.push({'name': details.name})})}
                    ${generateOptions(dataList)}
                    </datalist>
                </label>
            </td>
        </tr>
        `;

    return addRow;
}
const inlineTableClickActions = (identifier, epectedTblFields, requestAction) => {
    if(document.querySelector(`#${identifier} .title-modifications`)){
        let newItem = document.querySelector(`#${identifier} .title-modifications .new`);            
        let editItem = document.querySelector(`#${identifier} .title-modifications .edit`);            
        let deleteItem = document.querySelector(`#${identifier} .title-modifications .delete`);            
        let exportItem = document.querySelector(`#${identifier} .title-modifications .export`);                        
        let limitItem = document.querySelector(`#${identifier} .title-modifications .limit`);                        
        let filterItem = document.querySelector(`#${identifier} .title-modifications .filter`);                        

        // TABLE DATA
        const inlineEditBtns = document.querySelectorAll(`#${identifier} .inline-edit`);
        const inlineDeleteBtns = document.querySelectorAll(`#${identifier} .inline-delete`);
        // SINGLE ITEM INLINE EDIT
        tableRowModification(inlineEditBtns, 'editable-data', requestAction);
        // SINGLE ITEM INLINE DELETE
        tableRowModification(inlineDeleteBtns, 'editable-data', requestAction);

        // ADD NEW PRODUCT IN THE TABLE
        addTableRow(newItem, `${identifier.toLowerCase()}_list`, 'item-details', epectedTblFields);
        // EXPORT TABLE DATA
        if(site.session.user_type_id == 1){
            exportItem.addEventListener('click', () => {
                let table = document.getElementById(`${identifier}_export_tb`);
                let csv_name = `lifestyle ${identifier} as of ${today}`;
                let download_link = exportItem;
                export_table_to_csv (table, csv_name, download_link);
            });
        } 
    }
}
const generateInvoiceItems = (data) => {
    console.log(data); //active
    let totalPrice = 0;
    let templateString;
    if(data.length > 0){
        templateString = `
            <div class="moreinvoicedetails">
                <div class="invoice_header">
                    <div class="head">
                        <h3>Sale Information</h3>
                    </div>
                    <div class="attendant_info">
                        <div class="small-imag">
                            <img src="./images/${data[0]['user_image']}">
                        </div>
                        <div class="det-edit-box">
                            <label>Attendant</label>
                            <select>
                                <option>${data[0]['username']} ${data[0]['first_name'].split('')[0]}</option>
                            </select>
                        </div>
                    </div>
                    <div class="det-edit-box">
                        <label>branch</label>
                        <select>
                            <option>${data[0]['branch_location']}</option>
                        </select>
                    </div>
                    <div class="det-edit-box">
                        <label>purchase date</label>
                        <input type="date" value="${data[0]['purchase_date']}">
                    </div>
                    <div class="invoice_pricing">
                        <h3>Billing Information</h3>
                        <div class="det-edit-box">
                            <label>Total Price</label>
                            <div class="price-and-currency">
                                <b>${getTotalPrice(data)}
                                </b> 
                                <select>
                                    <option>$</option>
                                    <option selected>/=</option>
                                </select>
                            </div>
                        </div>
                        <div class="det-edit-box">
                            <label>Discount</label>
                            <select>
                                <option>Discount</option>
                            </select>
                        </div>
                        <div class="det-edit-box">
                            <label>Payment Type</label>
                            <select>
                                <option>Payment Type</option>
                            </select>
                        </div>
                    </div>
                    <div class="customer">
                        <h3>Customer Details</h3>
                        <div class="det-edit-box">
                            <label>F.Name</label>
                            <input type="text" value="${data[0]['customer_fname']}">
                        </div>
                        <div class="det-edit-box">
                            <label>L.Name</label>
                            <input type="text" value="${data[0]['customer_lname']}">
                        </div>
                        <div class="det-edit-box">
                            <label>Email</label>
                            <input type="text" value="${data[0]['customer_email']}">
                        </div>
                        <div class="det-edit-box">
                            <label>Telephone</label>
                            <input type="text" value="${data[0]['customer_telephone']}">
                        </div>
                    </div>
                </div>
                <div class="invoice_items">
                    <h4>Invoice No.${data[0]['invoice_no']} Items</h4>
                    
        `;
        data.forEach(itemDetails => {
            templateString += `
                    <div class="invoice_item">
                        <div class="besic_det">
                            <div class="invoice_item_image">
                                <img src="./images/${itemDetails.product_image}">
                            </div>
                            <label>
                                <b>Name: </b> 
                                <span>
                                    <select>
                                        <option>${itemDetails.product_name}</option>
                                    </select>
                                </span>
                            </label>
                            <label>
                                <b>category: </b> 
                                <span>${itemDetails.category_name}</span>
                            </label>
                            <label>
                                <b>Brand: </b> 
                                <span>${itemDetails.brand_name}</span>
                            </label>
                            <label>
                                <b>Code: </b> 
                                <span>
                                    <select>
                                        <option>${itemDetails.product_code}</option>
                                    </select>
                                </span>
                            </label>

                            <label>
                                <b>Price: </b> 
                                <span>
                                    <input type="text" value="${itemDetails.sale_price}">
                                </span>
                            </label>
                            <div class="cart_quantity_adjuster">
                                <b>Adjust quantity</b>
                                <label class="adjust">
                                    <span data-purchase_id="813" class="material-symbols-outlined modifier">remove</span>
                                    <input type="text" id="item_quantity_813" value="${itemDetails.purchase_quantity}" disabled="disabled" class="modified_quantity cart_modified_quantity straight_altered" data-available-quantity="59">
                                    <span data-purchase_id="813" class="material-symbols-outlined modifier">add</span>
                                </label>
                            </div>
                        </div>
                        <div class="color-n-sizes">
                            <label class="desc">
                                <b>Description: </b> 
                                <textarea>${itemDetails.remarks}</textarea>
                            </label>
                            <h3>Product Color</h3>
                            <div class="invoice_color_list" id="invoice_color_list${data[0]['invoice_no']}">
                                ${generateProductColor(itemDetails.product_colors, itemDetails.colour_name)}
                            </div>
                            <h3>Product Size</h3>
                            <div class="invoice_size_list">
                                ${generateProductColorSizes(itemDetails.product_colors, itemDetails.colour_name, itemDetails.size_innitual)}
                            </div>
                        </div>
                    </div>
            `;
        });
        templateString +=`
                </div>
            </div>`;
    }
    return templateString;
}
const getTotalPrice = (data, id) => {
    let totalPrice = 0;
    data.forEach(itemDetails => {
        totalPrice +=(Number(itemDetails.purchase_quantity) * Number(itemDetails.sale_price))
    })
    return totalPrice;
}
const generateProductColor = (data, colour_name) => {
    let templateString = '';
    if(data.length > 0){
        data.forEach(itemDetails => {
            templateString += `
                <i data-color-sizes="${JSON.stringify(itemDetails.color_products_sizes)}" class="${(itemDetails.colour_name == colour_name) ? 'update_sale_color active' : 'update_sale_color'}">${itemDetails.colour_name}<small>${itemDetails.color_products_sizes.length}</small></i>
            `;
        });
    }
    return templateString;
}
const generateProductColorSizes = (productColors, colour_name, size_innitual) => {
    let data = productColors.filter(productColor => (productColor.colour_name == colour_name));
    let templateString = '';
    if(data.length > 0){
        data = data[0].color_products_sizes;
        data.forEach(itemDetails => {
            console.log(itemDetails)
            templateString += `
                <i onclick="" class="${(itemDetails.size_innitual == size_innitual) ? 'update_sale_size active' : 'update_sale_size'}">${itemDetails.size_innitual}<small>${itemDetails.quantity}</small></i>
            `;
        });
    }
    return templateString;
}
const revealDetails = () => {
    const sInvoiceDtlBtns = document.querySelectorAll('.showinvoicedetails-btn');
    sInvoiceDtlBtns.forEach((sInvoiceDtlBtn, index) => sInvoiceDtlBtn.addEventListener('click', () => {
        sInvoiceDtlBtns.forEach(sInvoiceDtlBtn => sInvoiceDtlBtn.closest('tr').classList.remove('active'));
        if(sInvoiceDtlBtn.textContent == 'add'){
            sInvoiceDtlBtn.closest('tr').style.top = `-${index * 3.07}rem`;
            sInvoiceDtlBtn.closest('tr').classList.add('active');
            sInvoiceDtlBtn.textContent = 'remove';

        }else{
            sInvoiceDtlBtn.closest('tr').style.top = '0rem';
            sInvoiceDtlBtn.closest('tr').classList.remove('active');
            sInvoiceDtlBtn.textContent = 'add';

        }
    }))
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

function addComma (num) {
    let numArr = num.split('');
    let commadNumber = '', count = 0;

    for (var i = numArr.length - 1; i >= 0; i--) {
        count++;
        commadNumber += numArr[i];
        if(count == 3){
            commadNumber += ",";
            count = 0;
        }
    }
    let commadNumberArr = commadNumber.split('');
    // REMOVE LAST COMMA
    if (commadNumberArr[commadNumberArr.length - 1] ===',') {
        commadNumberArr.pop();
    }
    commadNumber="";
    // REARRANGE THE NUMBER BACK TO NORMAL
    for (var i = commadNumberArr.length - 1; i >= 0; i--) {
        commadNumber += commadNumberArr[i];
    }
    if(commadNumber.includes('.')){
        let removeCommaBeforePoint = commadNumber.split('.');
        let pointValue = removeCommaBeforePoint[1];
        let actualValue = removeCommaBeforePoint[0];
        let actualValueArr = actualValue.split('');
        actualValueArr.pop();
        actualValue = '';
        actualValueArr.forEach(c => {
            actualValue += c;
        });
        commadNumber = actualValue + '.' + pointValue;

    }

    return commadNumber;
}
function removeComma (num) {
    let numArr = num.split(',');
    let nomalNumber = "";
    numArr.forEach((number) => {
        nomalNumber += number;
    });
    return nomalNumber;
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


    // LOAD HELPER DATA LIST
    setTimeout(run({'reload': false, 'action':'getCategories', 'name': 'categoryList'}), 0);
    setTimeout(run({'reload': false, 'action':'getStatus', 'name': 'statusList'}), 0);
    setTimeout(run({'reload': false, 'action':'getBrands', 'name': 'brandList'}), 0);
    setTimeout(run({'reload': false, 'action':'getSizeSchemes', 'name': 'sizeSchemeList'}), 0);
    setTimeout(run({'reload': false, 'action':'getBranches', 'name': 'branchList'}), 0);
    setTimeout(run({'reload': false, 'action':'getUserTypes', 'name': 'userTypeList'}), 0);
    setTimeout(run({'reload': false, 'action':'getCustomers', 'name': 'customerList'}), 0);
    setTimeout(run({'reload': false, 'action':'getColors', 'name': 'colorList'}), 0);
    setTimeout(run({'reload': false, 'action':'getSizes', 'name': 'sizeList'}), 0);

    // ON PAGE LOAD & RELOAD
    setTimeout(() => {
        loadSessionData('product', limit);
        loadSessionData('warehouseinventory', limit);
        loadSessionData('user', limit);
        loadSessionData('invoice', limit);
        loadSessionData('supplier', limit);
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

    	});
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


    // FILTRATION validat
    const filtrationBox = document.querySelectorAll('.title-modifications');
    const filtrationBtn = document.querySelectorAll('.section-title span.table-filter');
    filtrationBtn.forEach(btn => btn.addEventListener('click', () => {
    	filtrationBox.forEach(ftBx => ftBx.classList.toggle('hide'));
    	console.log(filtrationBox, filtrationBtn)
    }));
});

// *************************************************** TABLE MUNIPULATION ***************************************

// SINGLE ITEM INLINE EDIT
const tableRowModification = (buttonArray, identifier, requestAction) => {
    buttonArray.forEach(inlineBtn => { //material-symbols-outlined warning check-all
        inlineBtn.addEventListener('click', (e) => {
            let tr = inlineBtn.parentElement.parentElement.parentElement;
            if(inlineBtn.classList.contains('inProgress')){
                asignDataAfterEdit(tr, inlineBtn, identifier, requestAction);
            }else if(inlineBtn.textContent == "edit"){
                asignDataForEdit(tr, inlineBtn, identifier); 
            }else if(inlineBtn.textContent == "close"){  
                // WARN BEFORe DELETE
                if(!document.getElementById('warningBox')){
                    document.querySelector(`#${inlineBtn.dataset.tb}s_list`).before(warningNotification(`Delete ${tr.childNodes[3].childNodes[0].textContent} form product list`));
                    let warningBoxBtns = document.querySelectorAll('#warningBox button');
                    warningBoxBtns.forEach(actionBtn => actionBtn.addEventListener('click', () => {
                        if(actionBtn.childNodes[1].textContent == 'Continue'){
                            document.getElementById('warningBox').remove();
                            tr.parentElement.after(preloader());
                            deleteData = {'tb': inlineBtn.dataset.tbl, 'id': inlineBtn.dataset.id, 'field': inlineBtn.dataset.field}
                            requestDataChange(deleteData, inlineBtn, 'delete_info' , 'delete', tr);
                        }else{
                            document.getElementById('warningBox').remove();
                        }
                    }));
                }

            }    
        })
    }); 
}
const  warningNotification = (message) => {
    const warningBox = document.createElement('div');
    warningBox.classList.add('warning-notification');
    warningBox.setAttribute('id', 'warningBox');
    warningBox.innerHTML = `
        <span>${message}</span>
        <label>
            <button>
                <span class="material-symbols-outlined">arrow_back</span>
                <b>Cancel</b>
            </button>
            <button>
                <b>Continue</b>
                <span class="material-symbols-outlined">done</span>
            </button>
        </label>
    `;
    return warningBox;
}
// GET TABLE DATA (td) AND ASSIGN IT TO AN INPUT FIELD/DATA LIST FOR EDIT
const asignDataForEdit = (tr, inlineEdit, identifier) => {
    tr.childNodes.forEach((td, index) => {
        if((index != 0) && (index % 2 != 0) && td.classList.contains(identifier)){  
            let data = (td.classList.contains('select-data')) ? '<input class="allInputs" list="sels'+index+'" name="sel'+index+'"  value="'+ td.childNodes[0].textContent.trim()+'" id="sel'+index+'"><datalist id="sels'+index+'">'+optionDataIsolation(td)+'</datalist>':'<input class="allInputs" type="text" value="' + td.childNodes[0].textContent.trim() + '" />';  
            tr.childNodes[index].childNodes[0].innerHTML = data;
        }
    });
    inlineEdit.classList.add('inProgress');
    inlineEdit.textContent = 'save_as';

    // VALIDATE DATA TYPE
    validateInputs(inlineEdit);
}
const validateInputs = (btn) => {
    const allInputs = document.querySelectorAll('.allInputs');
    allInputs.forEach(allInput => allInput.addEventListener('input', () => {
        const parent = allInput.parentElement.parentElement;
        if(parent.dataset.dType == 'int'){
            if(!Number(allInput.value)){
                allInput.style.borderColor = '#f00';
                allInput.setAttribute('title', 'Invalid value, number expected not text');
                btn.style.pointerEvents = 'none';
                deliverNotification('Invalid value, number expected not text', 'danger');
            }else{
                allInput.style.borderColor = 'gray';
                allInput.setAttribute('title', 'valid value');
                removeNotification(1);
                btn.style.pointerEvents = 'All';
            }
        }
        if(parent.classList.length == 3){
            console.log(parent.classList[2])
            let response = site[parent.classList[2]].filter(item => {
                let name = item.name.toLowerCase().trim();
                return (name == allInput.value.toLowerCase().trim());
            });
            if(response.length > 0){
                allInput.style.borderColor = 'gray';
                allInput.setAttribute('title', 'valid value');
                removeNotification(1);
                btn.style.pointerEvents = 'All';
            }else{
                allInput.style.borderColor = '#f00';
                allInput.setAttribute('title', 'Invalid value');
                deliverNotification('Invalid value, value shoud much with one of the suggestions', 'danger');
                btn.style.pointerEvents = 'none';
            }
        }
        // let dependent = document.getElementsByName('autoBased')
        // console.log(dependent)
        // if(parent.classList.contains('autogenerated')){
        //     console.log(parent.children[0].textContent)

        // }
    }));
}
// GENERATE DROPDOWN OPTION FOR TABLE INLINE EDIT validat
const optionDataIsolation = (td) => {
    let data = td.dataset;
    let dataList = [];
    if(td.classList.length == 3){
        site[td.classList[2]].forEach(details => {
            dataList.push({'name': details.name});
        });
    }
    
    return generateOptions(dataList);
}
const generateOptions = (dataArray) => {
    let allOptions 
    dataArray.forEach(option => {
        allOptions += `<option>${option.name}</option>`;
    })
    return allOptions;
}
const generateTblTitleFilter  = (identifier, filterValue, filterName, filterPlaceholder) => {
    let showLimit = document.querySelector(`#${identifier}s .showlimit`);
    let dataName = `${filterPlaceholder}List`;

    if(!document.querySelector(`#${identifier}s .${filterName}`)){
        let filter = document.createElement('select');
        filter.classList.add('filter');
        filter.classList.add(filterName);
        let filterContent = `<option value="show" selected="">Show by ${filterPlaceholder}</option>`;
        // GENERATE DROPDOWN OPTIONS
        site[dataName].forEach(details => {
            filterContent += `<option value="${details.id}">${details.name}</option>`;
        });
        filter.innerHTML = filterContent;
        showLimit.after(filter);
        // ADD CLICK EVENT TO OPTIONS
        filter.addEventListener('change', () => {
            searchLocalData(filter, filterValue, identifier, showLimit,  'filter');
        })
    }
}
const filterByLimit = (identifier, filterValue, filterName, filterPlaceholder) => {
    let showLimit = document.querySelector(`#${identifier}s .showlimit`);
    let dataList = null;
    showLimit.addEventListener('change', () => {
        let filter = showLimit.parentElement.childNodes[2];
        console.log(filter)
        let searchValue = showLimit.parentElement.childNodes[2].value;
        if(searchValue.trim() != 'show'){
            limit = (showLimit.value == 'All') ? Number(dataList.length) : Number(showLimit.value);
            dataList = searchLocalData(filter, filterValue, identifier, showLimit,  'showLimit');
        }else{
            dataList = site[`${identifier.toLowerCase()}List`];
            limit = (showLimit.value == 'All') ? Number(dataList.length) : Number(showLimit.value);
            // RENDER DATA
            document.getElementById(`${identifier.toLowerCase()}s_list`).innerHTML = '';
            renderPageData(dataList.slice(0, (0 + limit)), 0, identifier.toLowerCase());
        }
        generatePegination(dataList, identifier.toLowerCase(), limit);
    });
}
const searchLocalData = (searchBy, filterValue, identifier, showLimit, basedOn) => {
    let searchValue = searchBy.value.toLowerCase();
    let filterList = [];
    if(searchValue == 'show'){
        filterList = site[`${identifier.toLowerCase()}List`];
    }else{
        filterList = site[`${identifier.toLowerCase()}List`].filter(item => {
            if((item[filterValue].toLowerCase()) == searchValue){
                return item;
            }
        });
    }
    limit = showLimit.value == 'All' ? Number(filterList.length) : Number(showLimit.value);
    // RENDER DATA
    document.getElementById(`${identifier.toLowerCase()}s_list`).innerHTML = '';
    renderPageData(filterList.slice(0, (0 + limit)), 0, identifier.toLowerCase());

    if(basedOn == 'filter'){
        generatePegination(filterList, identifier.toLowerCase(), limit);
    }
    return filterList;
};

// GET TABLE DATA (td) IN THE INPUT FIELD AND ASIGN IT TO THE (td) ELEMENT AS TEXTCONTENT AFTER EDIT
const asignDataAfterEdit = (tr, inlineBtn, identifier, requestAction) => {
    let dataToUpdate = {};
    tr.parentElement.after(preloader());
    tr.childNodes.forEach((td, index) => {
        if((index != 0) && (index % 2 != 0) && td.classList.contains(identifier)){  
            let data = (td.childNodes[0].childNodes[0].value);
            tr.childNodes[index].childNodes[0].innerHTML = data; 

            // COLLECT DATA TO UPDATE  
            if(td.classList.length === 3){
                let filteredItemDetails = site[td.classList[2]].filter(info => info.name == data);
                dataToUpdate[td.dataset.name] = filteredItemDetails[0].id;
            }else{
                dataToUpdate[td.dataset.name] = data;
            }
        }
    });
    inlineBtn.classList.remove('inProgress');
    inlineBtn.textContent = 'edit';

    // UPDATE DATA
    requestDataChange(dataToUpdate, inlineBtn, requestAction, 'update');
}
const requestDataChange = (data, btn, requestAction, reqType, otherActionableElement=null) => {
    let identifier = btn.dataset.tb;
    console.log(identifier, btn.dataset.id, requestAction)
    let res = '';

    if(reqType == 'update'){
        res = generalRequest({'data': data, 'id': btn.dataset.id, 'action': requestAction});
        updateOperation(res, identifier, btn);
    }else if(reqType == 'save'){
        res = generalRequest({'data': data, 'action': requestAction});
        saveOperation(res, identifier, otherActionableElement);
    }else if(reqType == 'delete'){
        res = generalRequest({'data': data, 'action': requestAction});
        deleteOperaton(res, identifier, otherActionableElement, Number(btn.dataset.index));
    }
}
const deleteOperaton = (res, identifier, otherActionableElement, index) => {
    res.always((details) => {
        removeElement('div.preloader');
        if(details.response == 'success'){
            // REMOVE ROW FROM THE TABLE
            otherActionableElement.remove();
            // DELETE ROW DATA FROM LOACAL STORAGE LIST
            let name = `${identifier}List`;
            site[name].splice(index, 1);
            // UPDAT LOCAL STORAGE DATA
            updateSiteData(site);
        }
        deliverNotification(details.message, details.response);
    });
}
const saveOperation = (res, identifier, inlineBtn = null) => {
    res.always((details) => {
        removeElement('div.preloader');
        if(details.response == 'warning'){
            deliverNotification(details.message, details.response);
            inlineBtn.textContent = 'save_as';
        }
        else if(details.response == 'success'){
            inlineBtn.textContent = 'edit';
            let name = `${identifier}List`;
            // ADD NEW DETAILS TO LOCAL STORAGE LIST 
            site[name].unshift(details.info);
            updateSiteData(site);
            // RENDER DATA
            document.getElementById(`${identifier}s_list`).innerHTML = '';
            renderPageData(site.productList.slice(0, (0 + limit)), 0, identifier);
            deliverNotification(details.message , details.response);
        }
        else{
            inlineBtn.textContent = 'save_as';
            deliverNotification(details.message , details.response);
        }
    });
}
const updateOperation = (res, identifier, btn) => {
    res.always((details) => {
        // console.log(details)
        removeElement('div.preloader');
        if(details.response == 'danger'){
            deliverNotification(details.message , details.response);
        }else if(details.response == 'success'){
            // UPDATE DETAILS IN LOCAL STORAGE LIST 
            let name = `${identifier}List`;
            site[name][btn.dataset.index] = details.info;
            updateSiteData(site);
            deliverNotification(details.message , details.response);
        }
        else{
            deliverNotification('Something went wrong', 'warning');
        }
    });
}
// const activePage = document.querySelector('.page.active');
const pageTbModifications = () => {
    // console.log(activePage); material-symbols-outlined danger inline-delete
    if(document.querySelector(`.page.active .title-modifications`)){
        // TITLE DATA BOARD console.log(document.querySelector(`.page.active .title-modifications`))
        let newItem = document.querySelector(`.page.active .title-modifications .new`);            
        let editItem = document.querySelector(`.page.active .title-modifications .edit`);            
        let deleteItem = document.querySelector(`.page.active .title-modifications .delete`);            
        let exportItem = document.querySelector(`.page.active .title-modifications .export`);                        
        let limitItem = document.querySelector(`.page.active .title-modifications .limit`);                        
        let filterItem = document.querySelector(`.page.active .title-modifications .filter`);                        

        console.log(newItem, editItem, deleteItem, exportItem, limitItem, filterItem)
        // TABLE DATA
        const inlineEditBtns = document.querySelectorAll('.page.active .inline-edit');
        // SINGLE ITEM INLINE EDIT
        tableRowModification(inlineEditBtns, 'editable-data');
    }
}
// PRODUCT TABLE EDITABLE
const productData = document.querySelectorAll('.item-details');
const deleteProduct = document.getElementById('deleteProduct');
const newProduct = document.getElementById('newProduct');
const allProductEdit = document.getElementById('editProduct');
const allProductDeleteBtns = document.querySelectorAll('.allDelete');
const allCheckBtns = document.querySelectorAll('.allCheck');
const inlineEditBtns = document.querySelectorAll('.inline-edit');

const run = (data) => {
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
        return ajaxRequest;
    }
}

const generalRequest = (data) => {
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
const removeNotification = (time=8000) => {
    setTimeout(function(){
        document.querySelector('.notification_messages').classList.forEach((nclass) => {
            if(nclass !== 'notification_messages'){
                document.querySelector('.notification_messages').classList.remove(nclass);
            }
        });

    }, time);
}
