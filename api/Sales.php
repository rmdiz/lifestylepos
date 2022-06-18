<?php  
class Sales{

	function __construct($_p_instance){
		$this->p_instance = $_p_instance;
	}
	public function getCurrencys(){
		$result = $this->p_instance->fetchAll('currency_tb');
		$res;
		// GET NUMBER OF ROWS
		$num = $result->rowCount();
		if($num > 0){
			$dataArr = array();

			while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
				extract($row);

				$dataArr[] = array(
					'id' => $id,
					'name' => $name, 
					'rate' => $rate, 
					'symbol' => $symbol, 
				);
			}
			$res = $dataArr;
		}
		else{
			$res = 'Nothing found';
		}
		echo json_encode($res);

	}

	public function getLimitedInvoices($limit, $incomingPage){
		$dataArr = array();
		if($incomingPage > 1)
		{
			$start = (($incomingPage - 1) * $limit);
		}
		else
		{
			$start = 0;
		}
		$sql = "SELECT * FROM `invoice_tb`";

		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
		$result = $this->p_instance->getDetails($filter_query, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);
			$invoiceDetails = $this->getInvoiceDetails((int)$id);
			$dataArr[] = array(
				'invoice_no'	=>	$id,
				'puchase_ids'	=>	$invoice_no,
				'totalItems'	=>	$invoiceDetails[1],
				'totalPrice'	=>	$invoiceDetails[2],
				'invoiceDetails' => $invoiceDetails[0],
				'payment_type_name' => $invoiceDetails[0][0]['payment_type_name'],
				'branch'	=>	$invoiceDetails[0][0]['branch_location'],
				'customer_name'	=>	$invoiceDetails[0][0]['customer_fname'] .' '.$invoiceDetails[0][0]['customer_lname'],
				'attendant'	=>	$invoiceDetails[0][0]['username'],
				'date'			=>	$date
			);
		}
		// CONVERT OT JSON home_sea
		echo json_encode($dataArr);
	}
	public function getAllInvoices(){
		$dataArr = array();
		$sql = "SELECT * FROM `invoice_tb`";

		$result = $this->p_instance->getDetails($sql, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);
			$invoiceDetails = $this->getInvoiceDetails((int)$id);
			$dataArr[] = array(
				'invoice_no'	=>	$id,
				'puchase_ids'	=>	$invoice_no,
				'totalItems'	=>	$invoiceDetails[1],
				'totalPrice'	=>	$invoiceDetails[2],
				'invoiceDetails' => $invoiceDetails[0],
				'payment_type_name' => $invoiceDetails[0][0]['payment_type_name'],
				'branch'	=>	$invoiceDetails[0][0]['branch_location'],
				'customer_name'	=>	$invoiceDetails[0][0]['customer_fname'] .' '.$invoiceDetails[0][0]['customer_lname'],
				'attendant'	=>	$invoiceDetails[0][0]['username'],
				'date'			=>	$date
			);
		}
		// CONVERT OT JSON 
		echo json_encode($dataArr);
	}

	public function getInvoiceDetails($invoice_no){
		$sql = "SELECT sd.*, iv.code, dt.discount_name, dt.discount_percentage, cl.colour_name, sz.innitual AS size_innitual, im.image_name, pt.product_name, ptt.payment_type_name, ct.fname AS customer_fname, ct.lname AS customer_lname, ct.email as customer_email, ct.telephone as customer_telephone, pt.sale_price, btt.brand_name, bt.branch_location, cy.category_name, ut.username, ut.first_name, ut.last_name, up.image AS user_image FROM `sold_tb` sd 
				LEFT OUTER JOIN product_detail_tb pt
			    ON sd.product_id = pt.product_id 
				LEFT OUTER JOIN warehouseInventory_tb iv
			    ON sd.ivid = iv.inventory_id
				LEFT OUTER JOIN colour_tb cl
			    ON cl.colour_id = iv.colour_id
				LEFT OUTER JOIN size_tb sz
			    ON sz.size_id = iv.size_id
				LEFT OUTER JOIN inventory_product_images_tb im
			    ON im.inventory_id = iv.inventory_id
			    LEFT OUTER JOIN brand_tb btt 
			    ON pt.brand_id = btt.brand_id
			    LEFT OUTER JOIN category_tb cy 
			    ON pt.category_id = cy.category_id
			    LEFT OUTER JOIN customer_tb ct 
			    ON sd.customer_id = ct.customer_id 
			    LEFT OUTER JOIN user_tb ut 
			    ON sd.attendant_id = ut.user_id 
			    LEFT OUTER JOIN user_profile_image_tb up 
			    ON up.user_id = ut.user_id 
			    LEFT OUTER JOIN branch_tb bt 
			    ON bt.branch_id = sd.branch_id  
			    LEFT OUTER JOIN payment_type_tb ptt 
			    ON sd.payment_type_id = ptt.payment_type_id 
			    LEFT OUTER JOIN discount_tb dt 
			    ON sd.discount_id = dt.discount_id 
			    WHERE sd.invoice_no = ?   
			    ORDER BY sd.purchase_id
			    
		";
		$result = $this->p_instance->getDetails($sql, array('sd.invoice_no' => $invoice_no));
		// GET NUMBER OF ROWS

		$dataArr = array();
		$totalPrice = 0;
		$totalItems = 0;

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);
			$totalPrice += ((int)$quantity * (int) $sale_price);
			$dataArr[] = array(
				'purchase_id' => $purchase_id, 	
				'product_id' => $product_id, 	
				'inventory_id' => $ivid, 	
				'purchase_date' => $purchase_date, 	
				'customer_id' => $customer_id, 	
				'attendant_id' => $attendant_id, 	
				'purchase_quantity' => $quantity, 	
				'payment_type_id' => $payment_type_id, 	
				'payment_type_name' => $payment_type_name, 	
				'discount_id' => $discount_id, 	
				'discount' => $discount_name,
				'percentage' => $discount_percentage,
				'modified_at' => $modified_at, 	
				'deleted_at' => $deleted_at, 	
				'product_code' => $code, 	
				'product_name' => $product_name, 	
				'customer_fname' => $customer_fname, 	
				'customer_lname' => $customer_lname, 	
				'customer_email' => $customer_email, 	
				'customer_telephone' => $customer_telephone, 	
				'sale_price' => $sale_price, 	
				'invoice_no' => $invoice_no, 	
				'brand_name' => $brand_name, 	
				'date' => $date, 	
				'branch_location' => $branch_location, 	
				'category_name' => $category_name, 	
				'first_name' => $first_name, 
				'last_name' => $last_name, 
				'user_image' => $user_image, 
				'username' => $username, 
				'product_image' => $image_name, 
				'remarks' => $remarks,
				'branch_id' => $branch_id,
				'colour_name' => $colour_name,
				'size_innitual' => $size_innitual,
				'product_colors' => $this->get_inventory_product_color($product_id, $branch_id),
			);

		}
		$totalItems = count($dataArr);
		return [$dataArr, $totalItems, $totalPrice];
		
	}
	public function get_inventory_product_color($product_id, $sales_branch_id){
		$sql = "
		SELECT DISTINCT(iv.colour_id), bhiv.quantity AS availableQuantity, cl.colour_name, img.image_name FROM `warehouseInventory_tb` iv 
		LEFT OUTER JOIN branch_inventory_tb bhiv ON bhiv.warehouse_inventory_id = iv.inventory_id 
		LEFT OUTER JOIN colour_tb cl ON cl.colour_id = iv.colour_id 
		LEFT OUTER JOIN inventory_product_images_tb img ON iv.inventory_id = img.inventory_id WHERE iv.product_id = ? AND bhiv.branch_id = ? AND bhiv.quantity > 0 
		";

		$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int)$product_id, 'bhiv.branch_id' => (int) $sales_branch_id));
		$dataArr = array();

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'product_id' => (int)$product_id,
				'branch_id' => (int)$sales_branch_id,
				'product_image' => ($image_name != null) ? $image_name: "default.png", 
				'colour_name' => $colour_name,
				'availableQuantity' => $availableQuantity,
				'colour_id' => $colour_id,
				"color_products_sizes" => $this->get_inventoryproduct_sizes($colour_id,  (int)$product_id, $sales_branch_id),
			);
		}

		return $dataArr;


	}

	public function get_inventoryproduct_sizes($colour_id, $product_id, $sales_branch_id){
		$inventory_id = 0;
		$quantity = 0;
		$sql = "

			SELECT iv.*, bhiv.quantity AS availableQuantity, pt.product_name, pt.sale_price, pt.buy_price, cl.colour_name, sz.size_label, sz.innitual, sz.size_id, cl.colour_id, cy.category_name, bd.brand_name, sc.scheme_name, CONCAT(sr.fname, ' ', sr.lname)AS supplier, im.image_name, im.image_id FROM warehouseInventory_tb iv 
			LEFT OUTER JOIN branch_inventory_tb bhiv 
            ON iv.inventory_id = bhiv.warehouse_inventory_id 
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
			WHERE iv.product_id = ? AND iv.colour_id = ? AND  bhiv.branch_id = ? AND bhiv.quantity > 0 ORDER BY pt.product_name DESC 
		";
		$result = $this->p_instance->getDetails($sql, array('iv.product_id' => (int) $product_id, 'iv.colour_id' => (int) $colour_id, 'bhiv.branch_id' => (int) $sales_branch_id));
		$dataArr = array();
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'inventory_id' => $inventory_id,
				'product_id' => $product_id,
				'name' => $product_name,
				'sale_price' => $sale_price, 
				'buy_price' => $buy_price, 
				'brand_name' => $brand_name, 
				'category_name' => $category_name, 
				'supplier' => $supplier, 
				'scheme_name' => $scheme_name, 
				'branch_id' => $sales_branch_id, 
				'availableQuantity' => $availableQuantity,
				'size_label' => $size_label,
				'size_innitual' => $innitual,
				'size_id' => $size_id,
				'colour_id' => $colour_id,
				'colour_name' => $colour_name,
				'code' => $code,
				'desc' => $description,
				'remarks' => $brand_name .' ' . $product_name .' ' . $colour_name .' ' . $size_label,
				'date' => $date,
				'image_id' => ($image_id != null) ? $image_id: 0,
				'image' => ($image_name != null) ? $image_name: "default.png"
			);
		}

		return $dataArr;

	}

	public function updateSale($post){
		// foreach($post['data'] as $data){
		// 	$info = array(
		// 		'quantity' 	=> (int) $data['newQuantity'],
		// 		// 'customer_id' => (int) $data['quantity'],
		// 		'ivid' => (int) $data['newQuantity'],
		// 		'remarks' => $data['remarks'],
		// 		'quantity' => (int) $data['quantity'],
		// 		'price' => (int) $data['price'],
		// 		'currency' => $data['currency'],
		// 		'rate' => (int) $data['rate'],
		// 		'payment_type_id' => (int) $data['payment_type_id'],
		// 		'discount_id' => (int) $data['discount_id'],
		// 		'purchase_date' => $data['purchase_date'],
		// 	);

		// 	$updated = $this->p_instance->updateDetails('sold_tb', 'invoice_no', (int) $post['id'], $info);
		// }
		$qty =(int)$post['data']['newQuantity'];
		$info = array(
			'quantity' 	=> $qty,
			// 'customer_id' => (int) $post['data']['quantity'],
			'ivid' => (int) $post['data']['newInventory_id'],
			'remarks' => $post['data']['remarks'],
			'price' => (int) $post['data']['price'],
			'currency' => $post['data']['currency'],
			'rate' => (int) $post['data']['rate'],
			'payment_type_id' => (int) $post['data']['payment_type_id'],
			'discount_id' => (int) $post['data']['discount_id'],
			'purchase_date' => $post['data']['purchase_date'],
		);

		$updated = $this->p_instance->updateDetails('sold_tb', 'purchase_id', (int) $post['data']['purchase_id'], $info);
		if($updated){
			echo json_encode(array('response' => 'success', 'message' => " details updated successfully", 'test' => $info, 'qyt' => (int)$post['data']['newQuantity']));
		}else{
			echo json_encode(array('response' => 'danger', 'message' => " update failded"));

		}

	}
}
?>