<?php
class svs_quiz_main_model {
    public function __construct() {
        global $wpdb;
        $this->db = & $wpdb;
        $this->quiztable = $this->db->prefix . 'svs_quiz';
        $this->quiz_submit_table = $this->db->prefix . 'svs_quiz_form_submit';
    }

    /**
     * Create database structure on plugin activation
     */
    public function create_database() {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $quiztable = "CREATE TABLE IF NOT EXISTS {$this->quiztable} (
            `ID` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(255) NOT NULL,
            `frontend` text NOT NULL,
            `backend` text NOT NULL,
            `settings` text NOT NULL,
            PRIMARY KEY ID (ID)
            );";
        dbDelta($quiztable);

        $quiz_submit_table = "CREATE TABLE IF NOT EXISTS {$this->quiz_submit_table} (
            `ID` int(11) NOT NULL AUTO_INCREMENT,
            `form_ID` int(11) NOT NULL,
            `Name` varchar(255) NOT NULL,
            `Email` varchar(255) NOT NULL,
            `Phone` varchar(255) NOT NULL,
            `Details` text NOT NULL,
            `user_info` text NOT NULL,
            `Date` TIMESTAMP NOT NULL,
            PRIMARY KEY ID (ID)
            );";
        dbDelta($quiz_submit_table);
    }

    public function save_form( $data ){
        if ( empty( $data ) ){
            return false;
        }

        $query = "INSERT INTO $this->quiztable (name, frontend, backend, settings) 
            VALUES( '{$data['form_name']}', '{$data['frontend']}', '{$data['backend']}', '{$data['settings']}' )";

        return $this->db->query( $query );
    }

    public function update_form( $form_id, $data ){
        $query = "UPDATE $this->quiztable SET name = '{$data['form_name']}', frontend = '{$data['frontend']}', backend = '{$data['backend']}' 
                WHERE ID = $form_id";
        return $this->db->query( $query );
    }

    public function get_form_list(){
        $query = "SELECT * FROM $this->quiztable";
        return $this->db->get_results( $query, 'ARRAY_A' );
    }

    public function get_form( $id ){
        $query = "SELECT frontend, settings FROM $this->quiztable WHERE ID = $id LIMIT 1";
        $result = $this->db->get_results( $query, 'ARRAY_A' );

        if ( !isset( $result[0] ) ){
            return false;
        }

        return $result[0];
    }

    public function get_backend_form( $id ){
        $query = "SELECT name, backend FROM $this->quiztable";
        $query .= " WHERE ID = $id LIMIT 1";
        $result = $this->db->get_results( $query, 'ARRAY_A' );

        if ( !isset( $result[0] ) ){
            return false;
        }

        return $result[0];
    }

    public function save_data( $form_id, $name, $email, $phone, $data, $user_info ){

        if ( empty( $data ) || empty( $form_id ) ){
            return false;
        }

        $name = esc_sql( $name );
        $email = esc_sql( $email );
        $phone = esc_sql( $phone );
        $data = esc_sql( $data );

        $query = "INSERT INTO $this->quiz_submit_table (form_ID, Name, Email, Phone, Details, user_info) 
            VALUES( '{$form_id}', '{$name}', '{$email}', '{$phone}', '{$data}', '$user_info' )";
        return $this->db->query( $query );
    }

    public function get_submissions( $id = null ){
        $query = "SELECT {$this->quiztable}.name AS Form, {$this->quiz_submit_table}.Name, {$this->quiz_submit_table}.Email, {$this->quiz_submit_table}.Phone, {$this->quiz_submit_table}.Date,{$this->quiz_submit_table}.ID"; 
        $query .= $id !== null ? ", {$this->quiz_submit_table}.Details, {$this->quiz_submit_table}.user_info AS 'User Information'" : "";
        $query .= " FROM $this->quiz_submit_table 
                JOIN  {$this->quiztable} ON {$this->quiztable}.ID = {$this->quiz_submit_table}.form_ID ";

        if ( $id !== null ){
            $query .= "WHERE {$this->quiz_submit_table}.ID = $id LIMIT 1";
        }

        $result = $this->db->get_results( $query, 'ARRAY_A' );
        return $result;
    }

    public function delete_form( $id ){
        $query = "DELETE FROM {$this->quiztable} WHERE ID = $id";
        $this->db->query( $query );
        $query = "DELETE FROM {$this->quiz_submit_table} WHERE form_ID = $id";
        $this->db->query( $query );
    }
}