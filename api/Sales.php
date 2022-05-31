<?php  
class Sales{

	function __construct($_p_instance){
		$this->p_instance = $_p_instance;
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
				'invoice_no'			=>	$id,
				'puchase_ids'	=>	$invoice_no,
				'totalItems'	=>	$invoiceDetails[1],
				'totalPrice'	=>	$invoiceDetails[2],
				'invoiceDetails' => $invoiceDetails[0],
				'branch'	=>	$invoiceDetails[0][0]['branch_location'],
				'customer_name'	=>	$invoiceDetails[0][0]['customer_name'],
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
				'branch'	=>	$invoiceDetails[0][0]['branch_location'],
				'customer_name'	=>	$invoiceDetails[0][0]['customer_name'],
				'attendant'	=>	$invoiceDetails[0][0]['username'],
				'date'			=>	$date
			);
		}
		// CONVERT OT JSON 
		echo json_encode($dataArr);
	}

	public function getInvoiceDetails($invoice_no){
		$sql = "SELECT sd.*, iv.code, pt.product_name, ptt.payment_type_name, CONCAT(ct.fname, ' ' , ct.lname) as customer_name, pt.sale_price, btt.brand_name, bt.branch_location, cy.category_name, ut.username FROM `sold_tb` sd 
				LEFT OUTER JOIN product_detail_tb pt
			    ON sd.product_id = pt.product_id 
				LEFT OUTER JOIN inventory_detail_tb iv
			    ON sd.ivid = iv.inventory_id
			    LEFT OUTER JOIN brand_tb btt 
			    ON pt.brand_id = btt.brand_id
			    LEFT OUTER JOIN category_tb cy 
			    ON pt.category_id = cy.category_id
			    LEFT OUTER JOIN customer_tb ct 
			    ON sd.customer_id = ct.customer_id 
			    LEFT OUTER JOIN user_tb ut 
			    ON sd.attendant_id = ut.user_id 
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
				'modified_at' => $modified_at, 	
				'deleted_at' => $deleted_at, 	
				'product_code' => $code, 	
				'product_name' => $product_name, 	
				'customer_name' => $customer_name, 	
				'sale_price' => $sale_price, 	
				'invoice_no' => $invoice_no, 	
				'brand_name' => $brand_name, 	
				'date' => $date, 	
				'branch_location' => $branch_location, 	
				'category_name' => $category_name, 	
				'username' => $username, 
			);

		}
		$totalItems = count($dataArr);
		return [$dataArr, $totalItems, $totalPrice];
		
	}
}
?>