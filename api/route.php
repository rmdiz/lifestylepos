<?php  

    // INNITUALIAZE API
	require_once('../core/init.php');
	// INSTANCIATE MODEL/ALL THE CLASSES
	$Model = new Model($db);

    // INSTANCIATE THE OTHE CLASSES AND PASS THE MODEL CLASS TO THEM
    $productController = new Products($Model);
	$accountController = new Accounts($Model);
	$suppliercontroller = new Supplier($Model);
	$salecontroller = new Sales($Model);
	$categoryController = new Categories($Model);
	$statusController = new Statuses($Model);
	$brandController = new Brands($Model);
	$sizeController = new Sizes($Model);
	$branchController = new Branches($Model);
	$colorController = new Colors($Model);


    $request = $_POST['action'];

	// ROUTES updateSpecificSaleInform
	switch ($request) {
		case 'authenticate':
			$auth = new Auth($Model);
			$user_details = $auth->authenticate($_POST["username"], $_POST["password"]);
        break;
		case 'getCategories':
			$category_list = $categoryController->getCategories();
        break;
		case 'getStatus':
			$status_list = $statusController->getStatus();
        break;
		case 'getBrands':
			$brand_list = $brandController->getBrands();
        break;
		case 'getBranches':
			$branch_list = $branchController->getBranches();
        break;
		case 'getSizeSchemes':
			$sizeScheme_list = $sizeController->getSizeSchemes();
        break;
		case 'getUserTypes':
			$userType_list = $accountController->getUserTypes();
        break;
		case 'getCustomers':
			$client_list = $accountController->getClients();
        break;
		case 'getColors':
			$color_list = $colorController->getColors();
        break;
		case 'getSizes':
			$size_list = $sizeController->getSizes();
        break;
		case 'getAllProducts':
			$productList = $productController->getAllProducts();
        break;
		case 'getLimitedProducts':
			$productList = $productController->getLimitedProducts((int) $_POST["limit"], (int) $_POST["page"]);
        break;
		case 'getAllWarehouseInventorys':
			$productList = $productController->getAllWarehouseInventorys();
        break;
		case 'getLimitedWarehouseInventory':
			$productList = $productController->getLimitedWarehouseInventory((int) $_POST["limit"], (int) $_POST["page"]);
        break;
		case 'getAllUsers':
			$accountList = $accountController->getAllUsers();
        break;
		case 'getLimitedUsers':
			$accountList = $accountController->getLimitedUsers((int) $_POST["limit"], (int) $_POST["page"]);
        break;
		case 'getAllSuppliers':
			$supplierList = $suppliercontroller->getAllSuppliers();
        break;
		case 'getLimitedSuppliers':
			$supplierList = $suppliercontroller->getLimitedSuppliers((int) $_POST["limit"], (int) $_POST["page"]);
        break;
		case 'getAllInvoices': 
			$slaeList = $salecontroller->getAllInvoices();
        break;
		case 'getLimitedInvoices':
			$slaeList = $salecontroller->getLimitedInvoices((int) $_POST["limit"], (int) $_POST["page"]);
        break;
		case 'saveProduct':
			$productList = $productController->saveProduct($_POST);
        break;
		case 'updateProduct':
			$productList = $productController->updateProduct($_POST);
			break;
		case 'updateWarehouseinventory':
			$warehouseinventoryList = $productController->updateWarehouseinventory($_POST);
			break;
		case 'delete_info':
			if($Model->delete($_POST['data']['tb'], $_POST['data']['field'] , (int)$_POST['data']['id'])){
				echo json_encode(array('response' => 'success', 'message' => "Deleted successfully"));
			}
			else{
				echo json_encode(array('response' => "danger", 'message' => 'Something went wrong'));
			}
		break;
        case 'getTotal':
        	$dt = explode('|', $_POST['tbs']);
			$res = array();
			$counter = 1;
        	foreach ($dt as $value) {
        		if($counter % 2 == 0){
        			$index = $counter - 1;
					$sql = "SELECT COUNT(*) AS total FROM " . $dt[$index];
					$result = $Model->getDetails($sql, array());
					$total_data = $result->fetch(PDO::FETCH_ASSOC);
					// echo json_encode($total_data);
					$res[] = array($dt[$index - 1] => (int)$total_data['total']);

        		}
        		$counter++;
        	}
			echo json_encode($res);
        break;
    }

?>