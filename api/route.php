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


    $request = $_POST['action'];

	// ROUTES updateSpecificSaleInform
	switch ($request) {
		case 'authenticate':
			$auth = new Auth($Model);
			$user_details = $auth->authenticate($_POST["username"], $_POST["password"]);
        break;
		// case 'fetchAllProducts':
		// 	$productList = $productController->fetchAllProducts((int) $_POST["limit"], (int) $_POST["page"], (int) $_POST["branch_id"]);
  //       break;
		// case 'fetchTotals':
		// 	// $accountList = $productController->fetchTotalProducts();
		// 	// $supplierList = $productController->fetchTotalProducts();
		// 	$productList = $productController->fetchTotalProducts((int)$_POST["branch_id"]);
  //       break;
		// case 'fetchAllBranchProducts':
		// 	$productList = $productController->fetchAllBranchProducts((int)$_POST["branch_id"]);
  //       break;
        // FORMATED
		case 'getAllProducts':
			$productList = $productController->getAllProducts();
        break;
		case 'getLimitedProducts':
			$productList = $productController->getLimitedProducts((int) $_POST["limit"], (int) $_POST["page"]);
        break;
		case 'getAllWarehouseInventorys':
			$productList = $productController->getAllWarehouseInventory();
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
    }

?>