<?php  
class Products{

	function __construct($_p_instance){
		$this->p_instance = $_p_instance;
	}
	public function updateWarehouseinventory($post){
		$inventory_id = (int) $post['id'];
		$updateData = array(
			'product_id' =>  (int)  $post['data']['product_id'],
			'colour_id' =>   (int) $post['data']['colour_id'],
			'code' => $post['data']['code'],
			'size_id' =>  (int) $post['data']['size_id'],
			'quantity' => (int) $post['data']['quantity'],
			'description' => $post['data']['description'],
		);
		$res =  $this->p_instance->updateDetails('warehouseInventory_tb', 'inventory_id', $inventory_id, $updateData);
		if($inventory_id){
			$inventoryDetails = $this->getOneWarehouseInventoryProduct($inventory_id);
			echo json_encode(array('response'=> "success", 'message' => 'Inventory  Details updated successfully', 'info' => $inventoryDetails));
		}else{
			echo json_encode(array('response'=> "danger", 'message' => 'Operation failed'));
		}
		// echo json_encode($updateData);
	}
	public function updateProduct($post){
		$product_id = (int) $post['id'];
		$updateData = array(
			'product_name' => $post['data']['product_name'],
			'code_initual' => $post['data']['code_initual'],
			'category_id' => (int) $post['data']['category_id'],
			'sale_price' => $post['data']['sale_price'],
			'buy_price' => $post['data']['buy_price'],
			'brand_id' => (int) $post['data']['brand_id'],
			'size_scheme_id' => (int) $post['data']['size_scheme_id'],
			'supplier_id' => (int) $post['data']['supplier_id'],
		);
		$res =  $this->p_instance->updateDetails('product_detail_tb', 'product_id', $product_id, $updateData);
		if($product_id){
			$productDetails = $this->getSingleProduct($product_id);
			echo json_encode(array('response'=> "success", 'message' => 'Product Details updated successfully', 'info' => $productDetails));
		}else{
			echo json_encode(array('response'=> "danger", 'message' => 'Operation failed'));
		}
		// echo json_encode($res);
	}
	public function saveProduct($post){
		$sql = "SELECT * FROM `product_detail_tb` WHERE product_name = ? ";
		$doesProductExist = $this->p_instance->getDetails($sql, array('product_name' => $post['data']['product_name']));
        $num = $doesProductExist->rowCount();
		if($num > 0){ 
			echo json_encode(array('response'=> "warning", 'message' => 'Product already Exist'));
		}else{
			$product_details = array(
				'product_name' => $post['data']['product_name'],
				'code_initual' => strtoupper($post['data']['code_initual']),
				'category_id' => (int) $post['data']['category_id'],
				'sale_price' => $post['data']['sale_price'],
				'buy_price' => $post['data']['buy_price'],
				'brand_id' => (int) $post['data']['brand_id'],
				'size_scheme_id' => (int) $post['data']['size_scheme_id'],
				'supplier_id' => (int) $post['data']['supplier_id'],
			);

			$product_id = $this->p_instance->Save("product_detail_tb", $product_details);

			if($product_id){
				$productDetails = $this->getSingleProduct($product_id);
				echo json_encode(array('response'=> "success", 'message' => 'Product added successfully', 'info' => $productDetails));
			}else{
				echo json_encode(array('response'=> "danger", 'message' => 'Operation failed'));
			}
		}
	}
	public function getSingleProduct($product_id){
		$dataArr = array();
		$sql = "SELECT pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM product_detail_tb pt LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id WHERE pt.product_id = ?";

		$result = $this->p_instance->getDetails($sql, array('pt.product_id' => $product_id));

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $product_id,
				'name' => $product_name,
				'code_initual' => $code_initual,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name
			);

		}
		return $dataArr[0];
	}
	public function getOneWarehouseInventoryProduct($inventory_id){
		$dataArr = array();
		$sql = "SELECT 
			iv.*, cl.colour_name, sz.size_label, im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM warehouseInventory_tb iv 
			LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id 
		    LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id 
		    LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id 
		    LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id 
		    LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id 
		    LEFT OUTER JOIN colour_tb cl ON iv.colour_id = cl.colour_id 
		    LEFT OUTER JOIN size_tb sz ON iv.size_id = sz.size_id 
		    LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id 
		    WHERE iv.inventory_id = ? 
		    ORDER BY iv.inventory_id  DESC";

		$result = $this->p_instance->getDetails($sql, array('iv.inventory_id' => $inventory_id));

		
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $inventory_id,
				'product_id' => $product_id,
				'name' => $product_name,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'color' => $colour_name, 
				'desc' => $description, 
				'code' => $code, 
				'size' => $size_label, 
				'quantity' => $quantity, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name, 
				'image' => ($image_name == null) ? 'default.png' : $image_name,
			);

		}
		// CONVERT OT JSON 
		return $dataArr[0];
	}


	// public function search_products($branch_id, $data){
	// 	$dataArr = array();
	// 	// aLLL DATA
	// 	if((int)$branch_id == 0){
	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0)";

	// 		$sql = (isset($data['search'])) ? $sql . " AND (pt.product_name LIKE '%".$data['search']."%' 
	// 			OR bd.brand_name LIKE '%".$data['search']."%') 
	// 			 ORDER BY pt.product_name DESC" : $sql . " ORDER BY pt.product_name DESC";
			
	// 		$result = $this->p_instance->getDetails($sql, array());
	// 	}else{

	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id 
	// 			WHERE (iv.branch_id = ? AND iv.quantity > 0)";
	// 		$sql = (isset($data['search'])) ? $sql . " AND (pt.product_name LIKE '%".$data['search']."%' 
	// 			OR bd.brand_name LIKE '%".$data['search']."%') 
	// 			ORDER BY pt.product_name DESC" : $sql . " ORDER BY pt.product_name DESC";
	// 		$result = $this->p_instance->getDetails($sql, array('branch_id' => (int)$branch_id));
	// 	}

	// 	while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
	// 		extract($row);

	// 		$dataArr[] = array(
	// 			'id' => $product_id,
	// 			'name' => $product_name,
	// 			'category_id' => $category_id, 
	// 			'sale_price' => $sale_price, 
	// 			'buy_price' => $buy_price, 
	// 			'brand_id' => $brand_id, 
	// 			'brand_name' => $brand_name, 
	// 			'category_name' => $category_name, 
	// 			'supplier' => $supplier, 
	// 			'supplier_id' => $supplier_id, 
	// 			'scheme_name' => $scheme_name, 
	// 			'branch_id' => $branch_id, 
	// 			'product_colors' => $this->get_inventory_product_color($branch_id, $product_id),
	// 			'image' => ($image_name == null) ? 'default.png' : $image_name,
	// 		);

	// 	}
	// 	echo json_encode($dataArr);
	// }

	// public function get_branch_inventory($branch_id){
	// 	$dataArr = array();
	// 	// aLLL DATA
	// 	if((int)$branch_id == 0){
	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE iv.quantity > 0  ORDER BY pt.product_name DESC";
	// 		$result = $this->p_instance->getDetails($sql, array());
	// 	}else{

	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE iv.branch_id = ? AND iv.quantity > 0  ORDER BY pt.product_name DESC";
	// 		$result = $this->p_instance->getDetails($sql, array('branch_id' => (int)$branch_id));
	// 	}

	// 	while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
	// 		extract($row);

	// 		$dataArr[] = array(
	// 			'id' => $product_id,
	// 			'name' => $product_name,
	// 			'category_id' => $category_id, 
	// 			'sale_price' => $sale_price, 
	// 			'buy_price' => $buy_price, 
	// 			'brand_id' => $brand_id, 
	// 			'brand_name' => $brand_name, 
	// 			'category_name' => $category_name, 
	// 			'supplier' => $supplier, 
	// 			'supplier_id' => $supplier_id, 
	// 			'scheme_name' => $scheme_name, 
	// 			'branch_id' => $branch_id, 
	// 			'product_colors' => $this->get_inventory_product_color($branch_id, $product_id),
	// 			'image' => ($image_name == null) ? 'default.png' : $image_name,
	// 		);

	// 	}
	// 	return $dataArr;
	// }

	// public function get_inventory_product_color($branch_id, $product_id)
	// {
	// 	if((int)$branch_id == 0){
	// 		$sql = "
	// 			SELECT DISTINCT(iv.colour_id), cl.colour_name, img.image_name FROM `inventory_detail_tb` iv LEFT OUTER JOIN colour_tb cl ON cl.colour_id = iv.colour_id LEFT OUTER JOIN inventory_product_images_tb img ON iv.inventory_id = img.inventory_id WHERE iv.product_id = ? AND quantity > 0  
	// 		";
	// 		$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int)$product_id));
	// 	}else{
	// 		$sql = "
	// 			SELECT DISTINCT(iv.colour_id), cl.colour_name, img.image_name FROM `inventory_detail_tb` iv LEFT OUTER JOIN colour_tb cl ON cl.colour_id = iv.colour_id LEFT OUTER JOIN inventory_product_images_tb img ON iv.inventory_id = img.inventory_id WHERE iv.product_id = ? AND iv.branch_id = ? AND quantity > 0   
	// 		";
	// 		$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int)$product_id, 'iv.branch_id' => (int)$branch_id));
	// 	}
	// 	$dataArr = array();
	// 	while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
	// 		extract($row);

	// 		$dataArr[] = array(
	// 			'product_id' => (int)$product_id,
	// 			'branch_id' => (int)$branch_id, 
	// 			'product_image' => ($image_name != null) ? $image_name: "default.png", 
	// 			'colour_name' => $colour_name,
	// 			'colour_id' => $colour_id,
	// 			"color_products_sizes" => $this->get_inventoryproduct_sizes($colour_id,  (int)$product_id, (int)$branch_id),
	// 		);
	// 	}

	// 	return $dataArr;


	// }
	public function get_inventoryproduct_sizes($colour_id, $product_id, $branch_id){
		$inventory_id = 0;
		$quantity = 0;
		if((int)$branch_id == 0){
			$sql = "
				SELECT iv.*, pt.product_name, pt.sale_price, pt.buy_price, cl.colour_name, sz.size_label, sz.innitual, sz.size_id, cl.colour_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier, im.image_name, im.image_id FROM inventory_detail_tb iv 
				LEFT OUTER JOIN product_detail_tb pt 
                ON pt.product_id = iv.product_id 
				LEFT OUTER JOIN category_tb cy 
				ON pt.category_id = cy.category_id 
				LEFT OUTER JOIN brand_tb bd 
				ON pt.brand_id = bd.brand_id 
				LEFT OUTER JOIN size_Scheme_tb sc
				ON sc.scheme_id = pt.size_scheme_id
				LEFT OUTER JOIN supplier_tb sr 
				ON pt.supplier_id = sr.supplier_id 
                LEFT OUTER JOIN colour_tb cl 
                ON cl.colour_id = iv.colour_id
                LEFT OUTER JOIN size_tb sz 
                ON sz.size_id = iv.size_id
                LEFT OUTER JOIN inventory_product_images_tb im 
                ON iv.inventory_id = im.inventory_id
				WHERE iv.product_id = ? AND iv.colour_id = ? AND iv.quantity > 0  ORDER BY pt.product_name DESC 
			";
			$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int) $product_id, 'iv.colour_id' => (int) $colour_id));
		}else{
			$sql = "
				SELECT iv.*, pt.product_name, pt.sale_price, pt.buy_price, cl.colour_name, sz.size_label, sz.innitual, sz.size_id, cl.colour_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier, im.image_name, im.image_id FROM inventory_detail_tb iv 
				LEFT OUTER JOIN product_detail_tb pt 
                ON pt.product_id = iv.product_id 
				LEFT OUTER JOIN category_tb cy 
				ON pt.category_id = cy.category_id 
				LEFT OUTER JOIN brand_tb bd 
				ON pt.brand_id = bd.brand_id 
				LEFT OUTER JOIN size_Scheme_tb sc
				ON sc.scheme_id = pt.size_scheme_id
				LEFT OUTER JOIN supplier_tb sr 
				ON pt.supplier_id = sr.supplier_id 
                LEFT OUTER JOIN colour_tb cl 
                ON cl.colour_id = iv.colour_id
                LEFT OUTER JOIN size_tb sz 
                ON sz.size_id = iv.size_id
                LEFT OUTER JOIN inventory_product_images_tb im 
                ON iv.inventory_id = im.inventory_id
				WHERE iv.product_id = ? AND iv.colour_id = ? AND iv.branch_id = ? AND iv.quantity > 0  
				ORDER BY pt.product_name DESC 
			";
			$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int)$product_id, 'iv.colour_id' => (int) $colour_id, 'iv.branch_id' => (int)$branch_id));
		}
		$dataArr = array();
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $inventory_id,
				'product_id' => $product_id,
				'name' => $product_name,
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'supplier' => $supplier, 
				'scheme_name' => $scheme_name, 
				'branch_id' => $branch_id, 
				'quantity' => $quantity,
				'size_label' => $size_label,
				'innitual' => $innitual,
				'size_id' => $size_id,
				'colour_id' => $colour_id,
				'colour_name' => $colour_name,
				'code' => $code,
				'desc' => $description,
				'remarks' => $remarks,
				'date' => $date,
				'image_id' => ($image_id != null) ? $image_id: 0,
				'image' => ($image_name != null) ? $image_name: "default.png"
			);
		}

		return $dataArr;
		// echo json_encode($dataArr);

	}

	// public function fetchAllProducts($limit, $incomingPage, $branch_id){
	// 	$dataArr = array();
	// 	// $page = 1;
	// 	if($incomingPage > 1)
	// 	{
	// 		$start = (($incomingPage - 1) * $limit);
	// 		// $page = $incomingPage;
	// 	}
	// 	else
	// 	{
	// 		$start = 0;
	// 	}
	// 	if($branch_id == 0){
	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0)";

	// 		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
	// 		$result = $this->p_instance->getDetails($filter_query, array());
	// 	}else{

	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0 AND iv.branch_id = ? )    ORDER BY pt.product_name DESC";
	// 		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
	// 		$result = $this->p_instance->getDetails($filter_query, array('branch_id' => $branch_id));
	// 	}
	// 	// aLLL DATA
	// 	// $sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0 AND iv.branch_id = 3 )    ORDER BY pt.product_name DESC";
	// 	// $result = $this->p_instance->getDetails($sql, array());
	// 	// $total_data = $result->rowCount();
	// 	// $filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
	// 	// $result = $this->p_instance->getDetails($filter_query, array());

	// 	while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
	// 		extract($row);

	// 		$dataArr[] = array(
	// 			'id' => $product_id,
	// 			'name' => $product_name,
	// 			'code_initual' => $code_initual,
	// 			'category_id' => $category_id, 
	// 			'sale_price' => $sale_price, 
	// 			'buy_price' => $buy_price, 
	// 			'brand_id' => $brand_id, 
	// 			'brand_name' => $brand_name, 
	// 			'category_name' => $category_name, 
	// 			'supplier' => $supplier, 
	// 			'supplier_id' => $supplier_id, 
	// 			'scheme_name' => $scheme_name, 
	// 			'branch_id' => $branch_id, 
	// 			'image' => ($image_name == null) ? 'default.png' : $image_name,
	// 		);

	// 	}
	// 	// CONVERT OT JSON home_sea
	// 	echo json_encode($dataArr);
	// 	// echo json_encode([$dataArr, $total_data, $limit, $page, $result->fetch(PDO::FETCH_ASSOC), $filter_query]);

	// }
	// public function fetchTotalProducts($branch_id){
	// 	// aLLL DATA
	// 	// $sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0 AND iv.branch_id = ? )  ORDER BY pt.product_name DESC";
	// 	if($branch_id == 0){
	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0)";

	// 		$result = $this->p_instance->getDetails($sql, array());
	// 	}else{

	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0 AND iv.branch_id = ? )    ORDER BY pt.product_name DESC";
	// 		$result = $this->p_instance->getDetails($sql, array('branch_id' => $branch_id));
	// 	}
	// 	$total_data = $result->rowCount();
	// 	// CONVERT OT JSON 
	// 	echo json_encode($total_data);
	// }
	// public function fetchAllBranchProducts($branch_id){
	// 	// aLLL DATA
	// 	if($branch_id == 0){
	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, iv.branch_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0)";

	// 		$result = $this->p_instance->getDetails($sql, array());
	// 	}else{

	// 		$sql = "SELECT DISTINCT(iv.product_id ), im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM inventory_detail_tb iv LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id WHERE (iv.quantity > 0 AND iv.branch_id = ? )    ORDER BY pt.product_name DESC";
	// 		$result = $this->p_instance->getDetails($sql, array('branch_id' => $branch_id));
	// 	}
	// 	$dataArr = array();
	// 	while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
	// 		extract($row);

	// 		$dataArr[] = array(
	// 			'id' => $product_id,
	// 			'name' => $product_name,
	// 			'code_initual' => $code_initual,
	// 			'category_id' => $category_id, 
	// 			'sale_price' => $sale_price, 
	// 			'buy_price' => $buy_price, 
	// 			'brand_id' => $brand_id, 
	// 			'brand_name' => $brand_name, 
	// 			'category_name' => $category_name, 
	// 			'supplier' => $supplier, 
	// 			'supplier_id' => $supplier_id, 
	// 			'scheme_name' => $scheme_name, 
	// 			'branch_id' => $branch_id, 
	// 			'image' => ($image_name == null) ? 'default.png' : $image_name,
	// 		);

	// 	}
	// 	// CONVERT OT JSON 
	// 	echo json_encode($dataArr);
	// }
	// FORMATTED
	public function getLimitedProducts($limit, $incomingPage){
		$dataArr = array();
		if($incomingPage > 1)
		{
			$start = (($incomingPage - 1) * $limit);
		}
		else
		{
			$start = 0;
		}
		$sql = "SELECT pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM product_detail_tb pt LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id ORDER BY product_id DESC";

		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
		$result = $this->p_instance->getDetails($filter_query, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $product_id,
				'name' => $product_name,
				'code_initual' => $code_initual,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name
			);

		}
		// CONVERT OT JSON home_sea
		echo json_encode($dataArr);
	}
	public function getAllProducts(){
		$dataArr = array();
		$sql = "SELECT pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM product_detail_tb pt LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id  ORDER BY product_id DESC";

		$result = $this->p_instance->getDetails($sql, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $product_id,
				'name' => $product_name,
				'code_initual' => $code_initual,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name
			);

		}
		// CONVERT OT JSON 
		echo json_encode($dataArr);
	}

	public function get_inventory_product_color($branch_id, $product_id)
	{
		if((int)$branch_id == 0){
			$sql = "
				SELECT DISTINCT(iv.colour_id), cl.colour_name, img.image_name FROM `inventory_detail_tb` iv LEFT OUTER JOIN colour_tb cl ON cl.colour_id = iv.colour_id LEFT OUTER JOIN inventory_product_images_tb img ON iv.inventory_id = img.inventory_id WHERE iv.product_id = ? AND quantity > 0  
			";
			$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int)$product_id));
		}else{
			$sql = "
				SELECT DISTINCT(iv.colour_id), cl.colour_name, img.image_name FROM `inventory_detail_tb` iv LEFT OUTER JOIN colour_tb cl ON cl.colour_id = iv.colour_id LEFT OUTER JOIN inventory_product_images_tb img ON iv.inventory_id = img.inventory_id WHERE iv.product_id = ? AND iv.branch_id = ? AND quantity > 0   
			";
			$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int)$product_id, 'iv.branch_id' => (int)$branch_id));
		}
		$dataArr = array();
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'product_id' => (int)$product_id,
				'branch_id' => (int)$branch_id, 
				'product_image' => ($image_name != null) ? $image_name: "default.png", 
				'colour_name' => $colour_name,
				'colour_id' => $colour_id,
				"color_products_sizes" => $this->get_inventoryproduct_sizes($colour_id,  (int)$product_id, (int)$branch_id),
			);
		}

		return $dataArr;


	}
	public function getLimitedWarehouseInventory($limit, $incomingPage){
		$dataArr = array();
		if($incomingPage > 1)
		{
			$start = (($incomingPage - 1) * $limit);
		}
		else
		{
			$start = 0;
		}
		$sql = "SELECT 
			iv.*, cl.colour_name, sz.size_label, im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM warehouseInventory_tb iv 
			LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id 
		    LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id 
		    LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id 
		    LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id 
		    LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id 
		    LEFT OUTER JOIN colour_tb cl ON iv.colour_id = cl.colour_id 
		    LEFT OUTER JOIN size_tb sz ON iv.size_id = sz.size_id 
		    LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id 
		    ORDER BY iv.inventory_id DESC";

		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
		$result = $this->p_instance->getDetails($filter_query, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $inventory_id,
				'product_id' => $product_id,
				'name' => $product_name,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'color' => $colour_name, 
				'code' => $code, 
				'desc' => $description, 
				'size' => $size_label, 
				'quantity' => $quantity, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name, 
				'image' => ($image_name == null) ? 'default.png' : $image_name,
			);

		}
		// CONVERT OT JSON home_sea
		echo json_encode($dataArr);
	}
	public function getAllWarehouseInventorys(){
		$dataArr = array();
		$sql = "SELECT 
			iv.*, cl.colour_name, sz.size_label, im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM warehouseInventory_tb iv 
			LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id 
		    LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id 
		    LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id 
		    LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id 
		    LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id 
		    LEFT OUTER JOIN colour_tb cl ON iv.colour_id = cl.colour_id 
		    LEFT OUTER JOIN size_tb sz ON iv.size_id = sz.size_id 
		    LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id 
		    ORDER BY iv.inventory_id  DESC";

		$result = $this->p_instance->getDetails($sql, array());

		
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $inventory_id,
				'product_id' => $product_id,
				'name' => $product_name,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'color' => $colour_name, 
				'desc' => $description, 
				'code' => $code, 
				'size' => $size_label, 
				'quantity' => $quantity, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name, 
				'image' => ($image_name == null) ? 'default.png' : $image_name,
			);

		}
		// CONVERT OT JSON 
		echo json_encode($dataArr);
	}
	public function getLimitedBranchInventory($limit, $incomingPage){
		$dataArr = array();
		if($incomingPage > 1)
		{
			$start = (($incomingPage - 1) * $limit);
		}
		else
		{
			$start = 0;
		}
		$sql = "SELECT 
			iv.*, cl.colour_name, sz.size_label, im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM warehouseInventory_tb iv 
			LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id 
		    LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id 
		    LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id 
		    LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id 
		    LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id 
		    LEFT OUTER JOIN colour_tb cl ON iv.colour_id = cl.colour_id 
		    LEFT OUTER JOIN size_tb sz ON iv.size_id = sz.size_id 
		    LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id 
		    ORDER BY pt.product_name DESC";

		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
		$result = $this->p_instance->getDetails($filter_query, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $product_id,
				'name' => $product_name,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'color' => $colour_name, 
				'code' => $code, 
				'desc' => $description, 
				'size' => $size_label, 
				'quantity' => $quantity, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name, 
				'image' => ($image_name == null) ? 'default.png' : $image_name,
			);

		}
		// CONVERT OT JSON home_sea
		echo json_encode($dataArr);
	}
	public function getAllBranchInventory(){
		$dataArr = array();
		$sql = "SELECT 
			iv.*, cl.colour_name, sz.size_label, im.image_name, pt.*, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier FROM warehouseInventory_tb iv 
			LEFT OUTER JOIN product_detail_tb pt ON pt.product_id = iv.product_id 
		    LEFT OUTER JOIN category_tb cy ON pt.category_id = cy.category_id 
		    LEFT OUTER JOIN brand_tb bd ON pt.brand_id = bd.brand_id 
		    LEFT OUTER JOIN size_Scheme_tb sc ON sc.scheme_id = pt.size_scheme_id 
		    LEFT OUTER JOIN supplier_tb sr ON pt.supplier_id = sr.supplier_id 
		    LEFT OUTER JOIN colour_tb cl ON iv.colour_id = cl.colour_id 
		    LEFT OUTER JOIN size_tb sz ON iv.size_id = sz.size_id 
		    LEFT OUTER JOIN inventory_product_images_tb im ON iv.inventory_id = im.inventory_id 
		    ORDER BY pt.product_name DESC";

		$result = $this->p_instance->getDetails($sql, array());

		
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'id' => $product_id,
				'name' => $product_name,
				'category_id' => $category_id, 
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_id' => $brand_id, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'color' => $colour_name, 
				'desc' => $description, 
				'code' => $code, 
				'size' => $size_label, 
				'quantity' => $quantity, 
				'supplier' => $supplier, 
				'supplier_id' => $supplier_id, 
				'scheme_name' => $scheme_name, 
				'image' => ($image_name == null) ? 'default.png' : $image_name,
			);

		}
		// CONVERT OT JSON 
		echo json_encode($dataArr);
	}
}
?>