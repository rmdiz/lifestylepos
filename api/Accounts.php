<?php  
class Accounts{

	function __construct($_p_instance){
		$this->p_instance = $_p_instance;
	}

	public function getLimitedUsers($limit, $incomingPage){
		$dataArr = array();
		if($incomingPage > 1)
		{
			$start = (($incomingPage - 1) * $limit);
		}
		else
		{
			$start = 0;
		}
		$sql = "SELECT ut.*, bt.branch_location, st.status_name, utt.user_type, upt.image FROM user_tb ut 
					LEFT OUTER JOIN user_type_tb utt 
					ON ut.user_type_id  = utt.user_type_id
					LEFT OUTER JOIN status_tb st 
					ON ut.status_id  = st.status_id
					LEFT OUTER JOIN branch_tb bt 
					ON bt.branch_id  = ut.branch_id
					LEFT OUTER JOIN user_profile_image_tb upt 
					ON ut.user_id = upt.user_id ORDER BY user_id";

		$filter_query = $sql . ' LIMIT ' . $start . ', ' . $limit;
		$result = $this->p_instance->getDetails($filter_query, array());

		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);
			$dataArr[] = array(
				'user_id'			=>	$user_id,
				'username'		=>	$username,
				'first_name'		=>	$first_name,
				'last_name'			=>	$last_name,
				'telephone'		=>	$telephone,
				'email'			=>	$email,
				'address'		=>	$address,
				'date'		=>	$created_at,
				'user_type_id'			=>	$user_type_id,
				'user_type'		=>	$user_type,
				'status'		=>	$status_name,
				'branch'		=>	$branch_location,
				'image'	=>	$image
			);
		}
		// CONVERT OT JSON home_sea
		echo json_encode($dataArr);
	}
	public function getAllUsers(){
		$dataArr = array();
		$sql = "SELECT ut.*, bt.branch_location, st.status_name, utt.user_type, upt.image FROM user_tb ut 
					LEFT OUTER JOIN user_type_tb utt 
					ON ut.user_type_id  = utt.user_type_id
					LEFT OUTER JOIN status_tb st 
					ON ut.status_id  = st.status_id
					LEFT OUTER JOIN branch_tb bt 
					ON bt.branch_id  = ut.branch_id
					LEFT OUTER JOIN user_profile_image_tb upt 
					ON ut.user_id = upt.user_id ORDER BY user_id";

		$result = $this->p_instance->getDetails($sql, array());

		
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$dataArr[] = array(
				'user_id'			=>	$user_id,
				'username'		=>	$username,
				'first_name'		=>	$first_name,
				'last_name'			=>	$last_name,
				'telephone'		=>	$telephone,
				'email'			=>	$email,
				'address'		=>	$address,
				'date'		=>	$created_at,
				'user_type_id'			=>	$user_type_id,
				'user_type'		=>	$user_type,
				'status'		=>	$status_name,
				'branch'		=>	$branch_location,
				'image'	=>	$image
			);

		}
		// CONVERT OT JSON 
		echo json_encode($dataArr);
	}
}
?>