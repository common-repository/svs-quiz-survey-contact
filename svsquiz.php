<?php 
/*
 * Plugin Name: SVS Quiz & Survey & Contact
 * Plugin URI: http://www.svs-websoft.com
 * Description: WordPress plugin that makes it easy to create and publish quizes, surveys and contact forms using a wizard and a visual builder. SVS Quiz & Survey & Contact works with any WordPress theme and you can publish your quizes/surveys/forms anywhere on your site using a shortcode.
 * Version: 1.0.0
 * Author: SVS WebSoft
 * Author URI: http://www.svs-websoft.com
 * License: GPL2
 */
if ( !function_exists( 'add_action' ) ) { // Make sure we don't expose any info if called directly
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit;
}

define( 'SVS_QUIZ_CSS_DIR', plugins_url( 'inc/css/', __FILE__ ) );
define( 'SVS_QUIZ_JS_DIR', plugins_url( 'inc/js/', __FILE__ ) );
define( 'SVS_QUIZ_IMG_DIR', plugins_url( 'inc/img/', __FILE__ ) );
define( 'SVS_QUIZ_FONTS_DIR', plugins_url( 'inc/fonts/', __FILE__ ) );

require_once 'app/model/svs_quiz_main_model.php';
require_once 'app/controller/svs_quiz_main_controller.php';

$svs_quiz_main_controller = new svs_quiz_main_controller();

add_action( 'wp_loaded', array($svs_quiz_main_controller, "svs_quiz_save_data"));

// Create table structure on plugin activation
register_activation_hook( __FILE__, array( $svs_quiz_main_controller, 'svs_quiz_create_database' ) );

// Add admin menu "SVS Quiz"
function svs_show_quiz_menu() {
	global $svs_quiz_main_controller;
    add_menu_page('SVS Quiz', 'SVS Quiz & Survey', 'manage_options', 'svs_quiz', array( $svs_quiz_main_controller, 'index' ), 'dashicons-grid-view');
    add_submenu_page('svs_quiz', 'SVS Quiz', 'Forms', 'manage_options', 'svs_quiz', array( $svs_quiz_main_controller, 'index' ));
    add_submenu_page('svs_quiz', 'Submissions', 'Submissions', 'manage_options', 'svs_quiz_submissions', array( $svs_quiz_main_controller, 'svs_quiz_show_submissions' ));
}

add_action('admin_menu', 'svs_show_quiz_menu');

// delete form and redirect
add_action( 'wp_loaded', array( $svs_quiz_main_controller, 'svs_quiz_delete_form' ) );