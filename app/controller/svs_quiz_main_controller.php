<?php
class svs_quiz_main_controller {

	private $add_scripts = false;

	public function __construct() {
		// Load model
        $this->svs_quiz_main_model = new svs_quiz_main_model();

		// Register shortcodes
		add_shortcode( 'svs_quiz', array( $this, 'svs_quiz_register_shortcode' ) );

		// Enqueue scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'svs_quiz_load_resources' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'svs_quiz_load_front_resources' ) );
	}

    public function index(){
        $action = array_key_exists('Action', $_GET) ? $_GET['Action'] : 'svs_quiz_init';
        if (method_exists($this, $action)){
            $this->$action();
        } else {
            $this->svs_quiz_init();
        };
    }

	public function svs_quiz_init(){
		$data = $this->svs_quiz_main_model->get_form_list();
		$this->svs_quiz_load_view( 'main', $data );
	}

	public function svs_quiz_delete_form(){
		if ( isset( $_GET['id'] )  && isset(  $_GET['Action']) ){
			if ( $_GET['Action'] == 'delete' ){
				$id = intval($_GET['id']);
				$this->svs_quiz_main_model->delete_form( $id );
				$location = admin_url() . 'admin.php?page=svs_quiz';
				wp_redirect( $location );exit;
			}
		}
	}

	public function svs_quiz_edit_form(){
		if ( !isset( $_GET['id'] ) ){
			return;
		}

		$id = intval( $_GET['id'] );
		$result = $this->svs_quiz_main_model->get_backend_form( $id );

		if ( !$result ){
			return;
		}

		$data['title'] = 'Edit Form';
		$data['form_name'] = $result['name'];
		$data['dashboard'] = base64_decode( $result['backend'] );
		$data['form_id'] = $id;

		$this->svs_quiz_load_view( 'form', $data );
	}

	public function svs_quiz_load_view( $file = null, $data = null ) {
		require_once plugin_dir_path( __DIR__ ) . 'view/svs_quiz_header.php';

		if ( file_exists( plugin_dir_path( __DIR__ ) . 'view/svs_quiz_' . $file . '.php' ) ){
			require_once plugin_dir_path( __DIR__ ) . 'view/svs_quiz_' . $file . '.php';
		}
		else{
			require_once plugin_dir_path( __DIR__ ) . 'view/svs_quiz_main.php';
		}

		require_once plugin_dir_path( __DIR__ ) . 'view/svs_quiz_footer.php';
	}

	public function svs_quiz_add_new_form() {
		$data['title'] = 'Add New Form';
		$data['form_name'] = '';
		$data['dashboard'] = '';
		$data['form_id'] = '';
		$this->svs_quiz_load_view( 'form', $data );
	}

	public function svs_quiz_save_form() {
		if ( !isset( $_POST['form_name'] ) ){
			echo FALSE; exit;
		}

		$data['form_name'] = htmlspecialchars( $_POST['form_name'], ENT_QUOTES );
		$data['frontend'] = $_POST['frontend'];
		$data['backend'] = $_POST['backend'];
		$data['settings'] = $_POST['form_settings'];

		if ( !empty( $_POST['form_id'] ) ){
			$form_id = intval( $_POST['form_id'] );

			if ( !$this->svs_quiz_main_model->update_form( $form_id, $data ) ){
				return false;
			}

			return true;

		}

		if ( !$this->svs_quiz_main_model->save_form( $data ) ){
			echo FALSE; exit;
		}

		echo TRUE; exit;
	}

	public function svs_quiz_load_resources($hook) {
		$page =  get_admin_page_title();
		$all_pages = array('SVS Quiz', 'Submissions');

		if ( in_array( $page, $all_pages ) ){
			// load css files
			wp_register_style( 'svs_quiz_main', SVS_QUIZ_CSS_DIR . 'svs_quiz_main.css' );
			wp_enqueue_style( 'svs_quiz_main' );
	
			// load font awesome
			wp_register_style( 'svs_quiz_font_awesome', SVS_QUIZ_FONTS_DIR . 'font-awesome/css/font-awesome.min.css' );
			wp_enqueue_style( 'svs_quiz_font_awesome' );

			// load js files
			wp_register_script( 'svs_quiz_main_js', SVS_QUIZ_JS_DIR . 'svs_quiz_main.js', array( 'jquery', 'jquery-ui-draggable', 'jquery-ui-droppable', 'jquery-ui-sortable' ), null, true );
			wp_enqueue_script( 'svs_quiz_main_js' );
		}
	}

	public function svs_quiz_load_front_resources(){

		// only where shortcode is found
		if ( $this->add_scripts ){
			return;
		}

		// load css
		wp_register_style( 'svs_quiz_frontend_css', SVS_QUIZ_CSS_DIR . 'svs_quiz_front.css' );
		wp_enqueue_style( 'svs_quiz_frontend_css' );

		// load js
		wp_register_script( 'svs_quiz_frontend_js', SVS_QUIZ_JS_DIR . 'svs_quiz_frontend.js', array( 'jquery' ), null, true );
		wp_enqueue_script( 'svs_quiz_frontend_js' );
	}

	public function svs_quiz_create_database() {
		$this->svs_quiz_main_model->create_database();
	}

	public function svs_quiz_register_shortcode( $args ){
		if ( !isset( $args['id'] ) ){
			return;
		}

		$this->add_scripts = true;

		$id = intval( $args['id'] );

		$data = $this->svs_quiz_main_model->get_form( $id );
		$form = base64_decode( $data['frontend'] );
		$settings = json_decode( $data['settings'], true );

		$html = '<div class="svs-quiz-main-container">';
		$html .= '<form method="post" action="">'; 
		$html .= $form;
		$html .= '<input type="hidden" name="svs_quiz_form_id" value="' . $id . '">';

		if ( isset( $settings['redirect'] ) ){
			$html .= '<input type="hidden" name="svs_quiz_redirect" value="' . $settings['redirect'] . '">';
		}

		$html .= '<div>';
		$html .= '<input type="submit" name="submit" class="svs-quiz-submit-btn">';
		$html .= '</div>';
		$html .= '</form>';
		$html .= '</div>';

		return  $html;
	}

	public function svs_quiz_save_data( ){
        if ( isset( $_POST['submit'] ) ){
            $form_id = intval( $_POST['svs_quiz_form_id'] );
            $name = (isset( $_POST['svs-quiz-name'] ) ? $_POST['svs-quiz-name'] : '');
            $email = (isset( $_POST['svs-quiz-email'] ) ? $_POST['svs-quiz-email'] : '');
            $phone = (isset( $_POST['svs-quiz-phone'] ) ? $_POST['svs-quiz-phone'] : '');
            $redirect = (isset( $_POST['svs_quiz_redirect'] ) ? $_POST['svs_quiz_redirect'] : false);

            // print_r($_POST);exit();
            unset( $_POST['svs_quiz_form_id'], $_POST['svs-quiz-name'], $_POST['svs-quiz-email'], $_POST['svs-quiz-phone'], $_POST['svs_quiz_redirect'] );


            $user_info['ip'] = $this->getUserIp();
            $user_info['country'] = $this->getUserCountry($user_info['ip']);

            if ( !$this->svs_quiz_main_model->save_data( $form_id, $name, $email, $phone, json_encode($_POST), json_encode($user_info) ) ){
                return;
            }

            if ( $redirect ){
                wp_redirect( $redirect );exit;
            }
        }

	}

	public function svs_quiz_show_submissions(){
        $action =  isset( $_GET['Action']) ? $_GET['Action'] : false;

        if ( $action ){
        	if ( method_exists($this, $action) ){
        		$this->$action();
        		return;
        	}
        }

		$data = $this->svs_quiz_main_model->get_submissions();

		array_walk_recursive($data, function (&$value) {
		    $value = htmlentities($value);
		});


		$this->svs_quiz_load_view('submissions', $data);
	}

	public function svs_quiz_show_details(){

		if ( !isset( $_GET['id'] ) ){
			exit;
		}

		$id = intval( $_GET['id'] );
		$data = $this->svs_quiz_main_model->get_submissions( $id );

		$data = isset( $data[0] ) ? $data[0] : '';

		$this->svs_quiz_load_view('submissions_details', $data);
	}

    /**
     * Get user IP
     * @return mixed
     */
    private function getUserIp(){
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

    /**
     * Get country using geoplugin.net public service
     */
    private function getUserCountry($ip){
        $details = json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=$ip"));
        return (!empty($details->geoplugin_countryName) ? $details->geoplugin_countryName : "Unknown");
    }
}