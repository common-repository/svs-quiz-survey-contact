jQuery(document).ready(function($){
// Create Base64 Object
var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

function svs_quiz(){
	this.addNewFormBtn = '.svs-add-new-form-btn';
	this.formName = '#svs-form-name';
	this.formSettingsBtn = '.svs-quiz-form-settings';
	this.addNewFormContent = '.svs-add-new-form';
	this.dashboard = '.svs-quiz-dashboard .svs-quiz-content ul';
	this.dashboardContent = '.svs-quiz-dashboard .svs-quiz-content';
	this.sidebarTools = '.svs-quiz-dashboard .svs-quiz-sidebar .svs-quiz-tools';
	this.dashboardTools = '.svs-quiz-dashboard .svs-quiz-content .svs-quiz-tools';
	this.settingsBtn = '.svs-quiz-tool-settings';
	this.svsModal = '.svs-modal';
	this.svsModalContent = '.svs-modal-content';
	this.svsModalClose = '.svs-modal-close';
	this.saveSettingsBtn = '.svs-modal-footer .svs-quiz-btn';
	this.rowLayoutOption = '.svs-row-layout li';
	this.rowColWrapper = '.svs-quiz-col-wrapper';
	this.rowTool = '.svs-quiz-col-wrapper ul';
	this.rowColumns = '.svs-row-columns ul';
	this.headingText = '#svs-heading-text';
	this.headingType = '#svs-heading-type option:selected';
	this.textToolText = '#svs-text-tool';
	this.deleteElement = '.svs-quiz-delete-element';
	this.deleteForm = '.svs-quiz-delete-form';

	/* save new quiz */
	this.saveForm = function( formId ){
		var name = $( this.formName ).val();

		if ( name.trim() == '' ){

			if ( $( '.svs-alert-danger' ).is(':visible') ){
				$( '.svs-alert-danger' ).remove();
			}

			var error = this.alertDanger( 'Form Name must not be empty!' );
			$( this.addNewFormContent ).append( error );
			return;
		}

		// get form settings from cookie and delete cookie
		var formSettings = this.readCookie( 'svs-form-settings' );

		// mark row tool as stored in database
		$( this.rowTool ).addClass( 'svs-quiz-from-db' );

		var frontend = this.parseForm();
		var backend = Base64.encode( $( this.dashboard ).html() );

		if ( backend.length == 0 ){
			var error = this.alertDanger( 'Dashboard is empty.Please add tools before clicking on save.' );
			$( this.addNewFormContent ).append( error );
			return false;
		}

		$.ajax({
			method: "POST",
			url: "/wp-admin/admin.php?page=svs_quiz&Action=svs_quiz_save_form",
			data: 
			{ 
				form_name : name, 
				frontend : frontend, 
				backend : backend, 
				form_id : formId,
				form_settings :  formSettings
			}
		})
		.done(function( data ) {
			window.location.href = '/wp-admin/admin.php?page=svs_quiz';
		});
	}

	/* Get cookie by name */
	this.readCookie = function( name ) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' '){ 
	        	c = c.substring(1,c.length);
	        }
	        if (c.indexOf(nameEQ) == 0){
	        	document.cookie = "svs-form-settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	        	return c.substring(nameEQ.length,c.length);
	        }
	    }
	    return null;
	}

	/* parse form html */
	this.parseForm = function(){
		var html = $( this.dashboardContent ).html();
		$( '.svs-dashboard-clone' ).append(html).find('.svs-quiz-tools-header').remove();
		var newHtml = '';
		$( '.svs-dashboard-clone > ul > li' ).each(function(){
			newHtml += $( this ).html();
		});

		return Base64.encode( newHtml.replace( /connectedSortable|ui-droppable|ui-sortable|ui-widget-content|ui-state-default|active/gi, '' ) );
	}

	/* show alert message */
	this.alertDanger = function( msg ){
		var html = '<div class="svs-alert-danger">';
		html += '<span>' + msg + '<span>';
		html += '</div>';
		return html;
	}

	/* Make elements droppable and sortable */
	this.dropAndSort = function( element ){
		$( element ).droppable({
			greedy:true,
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept: ":not(.ui-sortable-helper, .svs-modal)",
		}).sortable({
		connectWith: ".connectedSortable",
		revert: true,
		sort: function() {
				$( this ).removeClass( "ui-state-default" );
			}
		});
	}

	/* show droppped tool on dashboard */
	this.appendTool = function( target, tool ){
		var html = '';
		var toolKey = 0;

		var numberOfTools = $( this.dashboardTools  ).length;

		// set key for the next appended tool
		if ( numberOfTools > 0 ){
			var keys = [];
			$( this.dashboardTools  ).each(function(index){
				var key = $( this ).data('key');
				keys.push(key);
				if ( index + 1 == numberOfTools ){
					toolKey = Math.max.apply(Math, keys) + 1;
				}
			});
		}

		switch( tool ){
			case 'svs-quiz-row':
				html = SvsQuiz.setRow( toolKey );
				break;
			case 'svs-quiz-header':
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-header', 'Header', 'fa-header' );
				break;
			case 'svs-quiz-text-input':
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-text-input', 'Text input', 'fa-italic' );
				break;
			case 'svs-quiz-combo':
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-combo', 'Combo Box', 'fa-list-ul' );
				break;
			case 'svs-quiz-single-select':
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-single-select', 'Single Select', 'fa-dot-circle-o' );
				break;
			case 'svs-quiz-multi-select':
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-multi-select', 'Multi Select', 'fa-check-square-o' );
				break;
			case 'svs-quiz-textarea':
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-textarea', 'Large Text', 'fa-file-text-o' );
				break;
			case 'svs-quiz-name':
				html = SvsQuiz.setDbElement( toolKey, 'svs-quiz-name', 'Name (Stored in DB)', 'fa-user', 'Name', 'text' );
				break;
			case 'svs-quiz-email':
				html = SvsQuiz.setDbElement( toolKey, 'svs-quiz-email', 'Email (Stored in DB)', 'fa-envelope-o', 'Email', 'email' );
				break;
			case 'svs-quiz-phone':
				html = SvsQuiz.setDbElement( toolKey, 'svs-quiz-phone', 'Phone (Stored in DB)', 'fa-phone', 'Phone', 'text' );
				break;
			default:
				html = SvsQuiz.setElement( toolKey, 'svs-quiz-text', 'Text', 'fa-font' );
		}

		$( target ).append( '<li>' + html + '</li>'  );
	}

	this.setRow = function( toolKey ){
		var html = '<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-row" data-key="' + toolKey + '">' +
						'<div class="svs-quiz-tools-header">' + 
							'<i class="fa fa-arrows-alt"></i>' +
							'<span class="svs-quiz-tool-settings"><i class="fa fa-cog"></i></span>' +
							'<i class="fa fa-trash-o svs-quiz-delete-element"></i>' + 
							'<span class="svs-quiz-tool-title">Row</span>' +
							'<span class="svs-quiz-tool-key">( key: ' + toolKey + ' )</span>' +
							'<i class="fa fa-columns svs-quiz-icon-right"></i>' +
						'</div>' +
						'<div class="svs-quiz-col-wrapper"><ul class="connectedSortable"></ul></div>' +
					'</div>';

		return html;
	}

	this.setElement = function( toolKey, id, text, icon ){
		var html = '<div class="svs-quiz-tools ui-widget-content" id="' + id + '" data-key="' + toolKey + '">' + 
						'<div class="svs-quiz-tools-header">' + 
							'<i class="fa fa-arrows-alt"></i>' +
							'<span class="svs-quiz-tool-settings"><i class="fa fa-cog"></i></span>' +
							'<i class="fa fa-trash-o svs-quiz-delete-element"></i>' + 
							'<span class="svs-quiz-tool-title">' + text + '</span>' + 
							'<span class="svs-quiz-tool-key">( key: ' + toolKey + ' )</span>' + 
							'<i class="fa ' + icon + ' svs-quiz-icon-right"></i>' +
						'</div>' +
					'</div>';
		return html;
	}

	this.setDbElement = function( toolKey, id, text, icon, label, type ){
		var html = '<div class="svs-quiz-tools ui-widget-content" id="' + id + '" data-key="' + toolKey + '">' + 
						'<div class="svs-quiz-tools-header">' + 
							'<i class="fa fa-arrows-alt"></i>' +
							'<span class="svs-quiz-tool-settings"><i class="fa fa-cog"></i></span>' +
							'<i class="fa fa-trash-o svs-quiz-delete-element"></i>' + 
							'<span class="svs-quiz-tool-title">' + text + '</span>' + 
							'<span class="svs-quiz-tool-key">( key: ' + toolKey + ' )</span>' + 
							'<i class="fa ' + icon + ' svs-quiz-icon-right"></i>' +
						'</div>' +
						'<div class="svs-input-tool-content">' + 
							'<label for="' + id + '">' + label + '</label>' + 
							'<input class="svs-quiz-tool-element" type="' + type + '" id="' + id + '" name="' + id + '">'
						'</div>';
					'</div>';
		return html;
	}

	/* show keys options for conditional logic */
	this.showKeysOptions = function(){
		var html = '<tr>' +
						'<td>' + 
							'<select class="svs-quiz-cond-key">';

		$( SvsQuiz.dashboardTools ).each(function(){

			if ( $( this ).attr('id') == 'svs-quiz-row' || $( this ).attr('id') == 'svs-quiz-text' || $( this ).attr('id') == 'svs-quiz-header' || $( this ).hasClass('active') ){
				return true;
			}

			html +=				'<option>' + $( this ).data('key') + '</option>';
		});

		html +=				'</select>' + 
						'</td>' + 
						'<td>' + 
							'<select class="svs-quiz-cond-operator">' +
								'<option>equals to</option>' + 
								'<option>not equals to</option>' +
								'<option>greater than</option>' +
								'<option>less than</option>' +
								'<option>contains</option>' +
								'<option>does not contain</option>' +
								'<option>starts with</option>' +
								'<option>ends with</option>' +
							'</select>' + 
						'</td>' +
						'<td>' + 
							'<input type="text" class="svs-quiz-cond-value">' +
						'</td>' + 
						'<td>' + 
							'<span class="svs-quiz-cond-delete"><i class="fa fa-trash-o"></i></span>' +
						'</td>' +
					'</tr>';

		return html;
	}

	/* show settings for each tool */
	this.showSettings = function( tool ){
		var html = '';
		switch( tool ){
			case 'svs-quiz-header':
				html = this.showHeaderSettings();
				break;
			case 'svs-quiz-row':
				html = this.showRowSettings();
				break;
			case 'svs-quiz-text-input':
				html = this.showFormControlSettings( 'Text input', 'input' );
				break;
			case 'svs-quiz-textarea':
				html = this.showFormControlSettings( 'Large Text', 'textarea' );
				break;
			case 'svs-quiz-combo':
				html = this.showFormControlSettings( 'Combo Box' );
				break;
			case 'svs-quiz-single-select':
				html = this.showFormControlSettings( 'Single Select' );
				break;
			case 'svs-quiz-multi-select':
				html = this.showFormControlSettings( 'Multi Select' );
				break;
			case 'svs-quiz-name':
				html = this.showDbInputSettings( 'Name' );
				break;
			case 'svs-quiz-email':
				html = this.showDbInputSettings( 'Email' );
				break;
			case 'svs-quiz-phone':
				html = this.showDbInputSettings( 'Phone' );
				break;
			default:
				html = this.showTextSettings();
		}

		html += '<div class="svs-col-1"><span class="svs-tool-settings-title">Conditional Logic</span></div>' + 
				'<div class="svs-col-1">' +
					'<label for="svs-quiz-cond-use">Use conditional logic on this element</label>' + 
					'<select id="svs-quiz-cond-use">' +
						'<option value="false">No</option>' + 
						'<option value="true">Yes</option>' + 
					'</select>' + 
				'</div>' + 
				'<div class="svs-col-1" id="svs-quiz-cond-visibility-wrapper">' +
					'<select id="svs-quiz-cond-visibility">' +
						'<option value="show">Show</option>' + 
						'<option value="hide">Hide</option>' + 
					'</select>' + 
					'<label for="svs-quiz-cond-visibility">This element if following conditions are true</label>' + 
				'</div>' + 
				'<div class="svs-col-1" id="svs-quiz-cond-table-wrapper">' +
					'<table id="svs-quiz-cond-table">' +
						'<thead>' +
							'<tr>' +
								'<th>Key</th><th>Operator</th><th>Value</th><th><i class="fa fa-trash-o"></i></th>' + 
							'</tr>' +
						'</thead>' +
						'<tbody>' +
							this.showKeysOptions() + 
						'</tbody>' +
					'</table>' + 
					'<div class="svs-col-1">' +
						'<a class="svs-quiz-btn svs-quiz-btn-blue svs-quiz-cond-add" href="javascript:void(0)">Add New Logic</a>' +
					'</div>' + 
				'</div>';

		$( this.svsModalContent ).empty().append( html);

		this.showSettingsSet();
		
	}

	this.showSettingsSet = function(){
		// set label
		var label = $( this.dashboardTools + '.active .svs-input-tool-content .svs-form-control-label' ).text() || $( this.dashboardTools + '.active .svs-input-tool-content label' ).text();
		$( '#svs-tool-label' ).val(label);
		// console.log(label);

		// set active columns button for row tool
		if ( $( this.dashboardTools + '.active' ).attr('id') == 'svs-quiz-row' ){
			var columns = $( this.dashboardTools + '.active .svs-quiz-col-wrapper ul' ).length;
			if ( typeof columns !== 'undefined' ){
				$( '.svs-row-layout [data-col="' + columns + '"]' ).addClass('active');
			}
		}

		// set header type and text for header tool
		if ( $( this.dashboardTools + '.active' ).attr('id') == 'svs-quiz-header' ){
			var headerType =  $( this.dashboardTools + '.active .svs-tool-content' ).children(':first').prop('tagName');
			var headerValue = $( this.dashboardTools + '.active .svs-tool-content' ).children(':first').text();
			if ( typeof headerType !== 'undefined' ){
				$( '#svs-heading-type' ).val( headerType ).prop( 'selected',true );
				$( '#svs-heading-text' ).val( headerValue );
			}
		}

		// set text for text tool
		if ( $( this.dashboardTools + '.active' ).attr('id') == 'svs-quiz-text' ){
			var textValue = $( this.dashboardTools + '.active .svs-tool-content p' ).text();
			$( '#svs-text-tool' ).text( textValue );
		}

		// set options for combo tool
		if ( $( this.dashboardTools + '.active' ).attr('id') == 'svs-quiz-combo' ){
			var numberOfOptions = $( this.dashboardTools + '.active .svs-input-tool-content select option' ).length;
			if ( typeof numberOfOptions !== 'undefined' ){
				$( this.dashboardTools + '.active .svs-input-tool-content select option' ).each(function(){
					var option = $( this ).val();	
					$('.svs-tool-options-wrapper').append('<li><i class="fa fa-times svs-delete-option"></i><span class="svs-option-input">' + option + '</span></li>');
				});
			}
		}

		// set options for single select
		if ( $( this.dashboardTools + '.active' ).attr('id') == 'svs-quiz-single-select' ){
			var numberOfOptions = $( this.dashboardTools + '.active .svs-input-tool-content input[type="radio"]' ).length;
			if ( typeof numberOfOptions !== 'undefined' ){
				$( this.dashboardTools + '.active .svs-input-tool-content input[type="radio"]' ).each(function(){
					var option = $( this ).val();	
					$('.svs-tool-options-wrapper').append('<li><i class="fa fa-times svs-delete-option"></i><span class="svs-option-input">' + option + '</span></li>');
				});
			}
		}

		// set options for multi select
		if ( $( this.dashboardTools + '.active' ).attr('id') == 'svs-quiz-multi-select' ){
			var numberOfOptions = $( this.dashboardTools + '.active .svs-input-tool-content input[type="checkbox"]' ).length;
			if ( typeof numberOfOptions !== 'undefined' ){
				$( this.dashboardTools + '.active .svs-input-tool-content input[type="checkbox"]' ).each(function(){
					var option = $( this ).val();	
					$('.svs-tool-options-wrapper').append('<li><i class="fa fa-times svs-delete-option"></i><span class="svs-option-input">' + option + '</span></li>');
				});
			}
		}

		// set conditional login
		if ( typeof $( this.dashboardTools + '.active' ).attr('data-toolkey') !== 'undefined' ){
			var visibility = $( this.dashboardTools + '.active' ).attr('data-visibility');
			$('#svs-quiz-cond-visibility').val( visibility ).prop('selected', true);
			$( '#svs-quiz-cond-use' ).val( 'true' ).prop( 'selected',true );

			var keys = $( this.dashboardTools + '.active' ).data('toolkey').split('/');
			keys.pop();

			var values = $( this.dashboardTools + '.active' ).data('value').split('/');
			values.pop();

			var operators = $( this.dashboardTools + '.active' ).data('operator').split('/');
			operators.pop();

			$('#svs-quiz-cond-table-wrapper table tbody').empty();

			for ( var i = 0; i < keys.length; i++ ){
				var html = SvsQuiz.showKeysOptions();

				$('#svs-quiz-cond-table-wrapper table tbody').append( html );
				$('#svs-quiz-cond-table-wrapper table tbody tr:last-child .svs-quiz-cond-key').children('option:contains("' + keys[i] + '")').prop( 'selected',true );
				$('#svs-quiz-cond-table-wrapper table tbody tr:last-child .svs-quiz-cond-operator').val( operators[i] ).prop( 'selected',true );
				$('#svs-quiz-cond-table-wrapper table tbody tr:last-child .svs-quiz-cond-value').val( values[i] );
			}
		}

	}

	this.showHeaderSettings = function(){
		var html = '<span class="svs-tool-settings-title">Header settings</span>' +
					'<div class="svs-col-1">' +
						'<select id="svs-heading-type">' +
							'<option class="h1">H1</option>' +
							'<option class="h2">H2</option>' +
							'<option class="h3">H3</option>' +
							'<option class="h4">H4</option>' +
							'<option class="h5">H5</option>' +
						'</select>' +
					'</div>' +
					'<div class="svs-col-1">' +
						'<label for="svs-heading-text">Enter your text.</label>' +
						'<input type="text" id="svs-heading-text">' +
					'</div>';
		return html;
	}

	this.showRowSettings = function(){
		var html = '<span class="svs-tool-settings-title">Row layout</span>' + 
					'<ul class="svs-row-layout">' + 
						'<li data-col="1">1/1</li>' +
						'<li data-col="2">1/2</li>' +
						'<li data-col="3">1/3</li>' +
					'</ul>';
		return html;
	}

	this.showTextSettings = function(){
		var html = '<span class="svs-tool-settings-title">Text settings</span>' + 
					'<div class="svs-col-1">' +
						'<div class="svs-col-1"><label for="svs-text-tool">Enter your text.</label></div>' + 
						'<div class="svs-col-1"><textarea id="svs-text-tool"></textarea></div>' + 
					'</div>';
		return html;
	}

	this.showFormControlSettings = function( title, type, label ){

		label = typeof label !== 'undefined' ? label : 'Enter your label';

		var html = '<span class="svs-tool-settings-title">' + title + ' settings</span>' + 
					'<div class="svs-col-1">' +
						'<div class="svs-col-1"><label for="svs-tool-label">' + label + '</label><input type="text" id="svs-tool-label"></div>';

		if ( type == 'input' || type == 'textarea' ){
			html += '</div>';
			return html;
		}

		html += '<div class="svs-col-1 svs-quiz-options-title"><span class="svs-tool-settings-title">Options</span></div>' + 
				'<div class="svs-col-1"><label for="svs-tool-option">Add Option</label><input type="text" id="svs-tool-option"><span class="svs-add-option"><i class="fa fa-plus"></i><span></div>' + 
				'<ul class="svs-tool-options-wrapper"></ul>' + 
				'</div>';

		return html;

	}

	this.showDbInputSettings = function( title, label ){
		label = typeof label !== 'undefined' ? label : 'Enter your label';
		var value = $( this.dashboardTools + '.active .svs-input-tool-content label' ).text();

		var html = '<span class="svs-tool-settings-title">' + title + ' settings</span>' + 
					'<div class="svs-col-1">' +
						'<div class="svs-col-1"><label for="svs-tool-label">' + label + '</label></div>' + 
						'<div class="svs-col-1"><input type="text" id="svs-tool-label" value="' + value + '"></div>' + 
					'</div>';

		return html;
	}

	/* save settings for each tool in dashboard */
	this.saveSettings = function( tool ){
		switch( tool ){
			case 'svs-quiz-row':
				this.saveRowSettings();
				break;
			case 'svs-quiz-header':
				this.saveHeaderSettings();
				break;
			case 'svs-quiz-text-input':
				this.saveInput( 'text' );
				break;
			case 'svs-quiz-combo':
				this.saveInput( 'combo' );
				break;
			case 'svs-quiz-single-select':
				this.saveInput( 'radio' );
				break;
			case 'svs-quiz-multi-select':
				this.saveInput( 'checkbox' );
				break;
			case 'svs-quiz-textarea':
				this.saveInput( 'textarea' );
				break;
			case 'svs-quiz-text':
				this.saveTextSettings();				
				break;
			case 'svs-form-settings':
				this.saveFormSettings();				
				break;
			default:
				this.saveDbInput();
		}
	}

	this.saveRowSettings = function(){

		if ( $( this.dashboardTools + '.active' ).find('.svs-quiz-tools').length > 0 ){
			var msg = 'If you will change layout settings all the tools in this row will be removed. Are you sure you want to continue?';
			if ( confirm( msg ) == false ){
				return false;
			}
		}

		var columns = 1;
		var html = '';

		if ( $( this.rowLayoutOption ).hasClass('active') ){
			columns = $( this.rowLayoutOption + '.active' ).attr('data-col');
		}

		$( this.dashboardTools + '.active' ).find( this.rowColWrapper ).empty();

		if ( columns == 1 ){
			$( this.dashboardTools + '.active' ).find( this.rowColWrapper ).append('<ul class="svs-col-1 connectedSortable"></ul>');
		}
		else{
			for ( var i = 1; i <= columns; i++ ){
				html += '<ul class="svs-col-' + columns + ' svs-row-columns connectedSortable"></ul>';
			}

			$( this.dashboardTools + '.active' ).find( this.rowColWrapper ).html( html );
		}

		this.dropAndSort( this.rowTool );

	}

	this.saveHeaderSettings = function(){
		var text = $( this.headingText ).val();
		var type = $( this.headingType ).attr('class');
		var html = '';

		if ( $( this.dashboardTools + '.active .svs-tool-content' ).is(':visible') ){
			html = '<' + type + '>' + text + '</' + type + '>';
			$( this.dashboardTools + '.active .svs-tool-content' ).empty().append( html );
			return;
		}

		html = '<div class="svs-tool-content">' +
					'<' + type + '>' + text + '</' + type + '>' +
				'</div>';
		$( this.dashboardTools + '.active' ).append( html );
	}

	this.saveTextSettings = function(){
		var text = $( this.textToolText ).val();
		var html = '';

		if ( $( this.dashboardTools + '.active .svs-tool-content' ).is(':visible') ){
			html = '<p>' + text + '</p>';
			$( this.dashboardTools + '.active .svs-tool-content' ).empty().append( html );
			return;
		}

		html = '<div class="svs-tool-content">' +
					'<p>' + text + '</p>' +
				'</div>';
		$( this.dashboardTools + '.active' ).append( html );
	}

	this.saveInput = function( type ){
		var mainLabel = $( '#svs-tool-label' ).val();
		var inputId = 'svs_' + mainLabel.replace(/ /g, '');
		var options = $('.svs-option-input').length;
		var html = '<div class="svs-input-tool-content">';

		switch( type ){
			case 'text':
				html += '<label for="' + inputId + '">' + mainLabel + '</label>' + 
						'<input class="svs-quiz-tool-element" type="text" id="' + inputId + '" name="' + mainLabel + '">';
				break;
			case 'combo':
				html += '<p class="svs-form-control-label">' + mainLabel + '</p>';
				html += '<select class="svs-quiz-tool-element" id="' + inputId + '" name="' + mainLabel + '">';
				$('.svs-option-input').each(function( index, element ){
					var uniqId = Math.round(new Date().getTime() + (Math.random() * 100));
					var optionLabel = $( this ).text();
					var id = 'svs_' + optionLabel.replace(/ /g, '');
					html += '<option id="' + id + "_" + uniqId + '">' + optionLabel + '</option>';
				});

				html += '</select>';
				break;
			case 'textarea':
				html += '<label for="' + inputId + '">' + mainLabel + '</label>' + 
						'<textarea class="svs-quiz-tool-element" id="' + inputId + '" name="' + mainLabel + '"></textarea>';
				break;
			case 'checkbox':
				html += '<p class="svs-form-control-label">' + mainLabel + '</p>';
				$('.svs-option-input').each(function( index, element ){
					var uniqId = Math.round(new Date().getTime() + (Math.random() * 100));
					var optionLabel = $( this ).text();
					var id = 'svs_' + optionLabel.replace(/ /g, '');
					html += '<label for="' + id +"_"+ uniqId + '">' + optionLabel + '</label>';
					html += '<input class="svs-quiz-tool-element" type="' + type + '" value="' + optionLabel + '" id="' + id + "_" + uniqId + '" name="' + mainLabel + '[]">';
				});
				break;
			default:
				html += '<p class="svs-form-control-label">' + mainLabel + '</p>';
				$('.svs-option-input').each(function( index, element ){
					var uniqId = Math.round(new Date().getTime() + (Math.random() * 100));
					var optionLabel = $( this ).text();
					var id = 'svs_' + optionLabel.replace(/ /g, '');
					html += '<label for="' + id +"_"+ uniqId + '">' + optionLabel + '</label>';
					html += '<input class="svs-quiz-tool-element" type="' + type + '" value="' + optionLabel + '" id="' + id + "_" + uniqId + '" name="' + mainLabel + '">';
				});

		}

		html += '</div>';

		$( this.dashboardTools + '.active .svs-input-tool-content' ).remove();
		$( this.dashboardTools + '.active' ).append( html );
	}

	this.saveDbInput = function(){
		var value = $( '#svs-tool-label' ).val();
		$( this.dashboardTools + '.active .svs-input-tool-content label' ).text( value );
	}

	this.saveFormSettings = function(){
		var redirect = $( '#svs-form-redirect' ).val().trim();
		var formSettings = {};

		if ( redirect !== '' ){
			formSettings.redirect = redirect;
		}

		document.cookie = "svs-form-settings = " + JSON.stringify( formSettings );
	}
}

var SvsQuiz = new svs_quiz;

/* Modal */

$( SvsQuiz.svsModal ).draggable();

$( SvsQuiz.svsModalClose ).on('click', function(){
	$( SvsQuiz.svsModal ).hide();
});

/* save new quiz */
$( SvsQuiz.addNewFormBtn ).on('click', function(){
	var formId = $( this ).attr('data-form');
	SvsQuiz.saveForm( formId );
});

/* quiz dashboard drag and drop, sort */
$( SvsQuiz.sidebarTools ).draggable({
	appendTo: "body",
	helper: "clone"
});


SvsQuiz.dropAndSort( SvsQuiz.rowTool );


/* init drop event only for dropped row tool */
$( document ).on('drop', SvsQuiz.rowTool, function( event, ui ){

	if ( $( this ).hasClass('svs-quiz-from-db') ){
		return false;
	}

	var tool = ui.draggable.attr('id');	

	if ( tool == 'svs-quiz-row' ){
		return false;
	}

	SvsQuiz.appendTool( $(this), tool );
});


$( SvsQuiz.dashboard ).droppable({
	activeClass: "ui-state-default",
	hoverClass: "ui-state-hover",
	accept: ":not(.ui-sortable-helper, .svs-modal)",
	drop: function( event, ui ) {
		var tool = ui.draggable.attr('id');

		if ( $( this ).find('.ui-state-hover').length == 0 ){
			var tool = ui.draggable.attr('id');
			SvsQuiz.appendTool( $(this), tool );

			if ( tool == 'svs-quiz-row' ){
				SvsQuiz.dropAndSort( SvsQuiz.rowTool );
			}
			
		}
		else{
			$( SvsQuiz.dashboard ).unbind('drop');
			$( SvsQuiz.rowTool ).unbind('drop');
			$( SvsQuiz.rowTool ).on('drop', function( event, ui ){	
				if ( tool == 'svs-quiz-row' ){
					return false;
				}

				SvsQuiz.appendTool( $(this), tool );
			});
		}

		if ( !$( SvsQuiz.rowTool ).hasClass('ui-droppable') ){
			SvsQuiz.dropAndSort( SvsQuiz.rowTool );
		}

	}
}).sortable({
connectWith: ".connectedSortable",
revert: true,
sort: function() {
		$( this ).removeClass( "ui-state-default" );
	}
});

/* Show Settings */
$( document ).on('click', SvsQuiz.settingsBtn, function(){
	var parent = $( this ).parent( '.svs-quiz-tools-header' ).parent( SvsQuiz.dashboardTools );
	var parentID = parent.attr('id');

	$( SvsQuiz.dashboardTools ).removeClass('active');
	parent.addClass('active');

	$( SvsQuiz.svsModal ).show();

	$( SvsQuiz.saveSettingsBtn ).attr('data-settings', parentID);
	SvsQuiz.showSettings( parentID );

	// if "use conditional logic" is set tu "yes" show conditional logic
	if ( $( '#svs-quiz-cond-use' ).val() == 'true' ){
		$( '#svs-quiz-cond-visibility-wrapper' ).add('#svs-quiz-cond-table-wrapper').show();
	}
});

/* Save Settings */
$( SvsQuiz.saveSettingsBtn ).on('click', function(){
	var conditionLogic = $('#svs-quiz-cond-use').val();

	if ( conditionLogic == 'true' ){
		var visibility = $('#svs-quiz-cond-visibility').val();
		var toolKey = '';
		var operator = '';
		var value = '';
		var numberOfCond = $( '#svs-quiz-cond-table tbody tr' ).length;

		$( '#svs-quiz-cond-table tbody tr' ).each(function( index ){
			toolKey += $( this ).find( '.svs-quiz-cond-key' ).val() + '/';
			operator += $( this ).find( '.svs-quiz-cond-operator' ).val() + '/';
			value += $( this ).find( '.svs-quiz-cond-value' ).val() + '/';

			if ( index + 1 == numberOfCond ){
				$( SvsQuiz.dashboardTools + '.active' )
				.attr('data-visibility', visibility)
				.attr('data-toolkey', toolKey)
				.attr('data-operator', operator)
				.attr('data-value', value);
			}

		});

	}

	var tool = $( this ).attr('data-settings');
	SvsQuiz.saveSettings( tool );
	$( SvsQuiz.svsModal ).hide();
});

/* Row */
$( document ).on('click', SvsQuiz.rowLayoutOption, function(){
	$( SvsQuiz.rowLayoutOption ).removeClass('active');
	$( this ).addClass('active');
});

/* input options */
$( document ).on('click', '.svs-add-option', function(){
	var option = $('#svs-tool-option').val();

	if ( option.trim() == '' ){
		return false;
	}

	$('.svs-tool-options-wrapper').append('<li><i class="fa fa-times svs-delete-option"></i><span class="svs-option-input">' + option + '</span></li>');
});

$( document ).on('click', '.svs-delete-option', function(){
	$( this ).parent('li').remove();
});

/* Remove elements from dashboard */
$( document ).on('click', SvsQuiz.deleteElement, function(){
	var confirmation = confirm('Are you sure you want to delete this tool?');

	if ( !confirmation ){
		return false;
	}

	$( this ).parent('.svs-quiz-tools-header').parent('.svs-quiz-tools').parent('li').remove();
});

/* Delete form confirmation */
$( SvsQuiz.deleteForm ).on('click', function(e){
	var confirmation = confirm('Are you sure you want to delete this form?');
	if ( !confirmation ){
		e.preventDefault();
	}
});

/* Sidebar accordion */
$( '.svs-quiz-sidebar-parent' ).on('click', function(){

	if ( $( this ).hasClass('active') ){
		$( this ).children( 'a' ).children( 'i' ).attr('class', 'fa fa-caret-down');
		$( this ).removeClass('active');
		$( this ).children( '.svs-quiz-sidebar-child' ).slideUp();
		return;
	}

	$( this ).children( 'a' ).children( 'i' ).attr('class', 'fa fa-caret-right');
	$( this ).addClass('active');
	$( this ).children( '.svs-quiz-sidebar-child' ).slideDown();
});

/* Form settings */
$( SvsQuiz.formSettingsBtn ).on('click', function(){
	$( SvsQuiz.svsModal ).show();

	var html = '<div class="svs-col-1">' + 
					'<label for="svs-form-redirect">Form redirection</label>' +
					'<input type="text" id="svs-form-redirect">' +
				'</div>';

	$( SvsQuiz.svsModalContent ).empty().append( html );
	$( SvsQuiz.saveSettingsBtn ).attr('data-settings', 'svs-form-settings');
});

/* Conditional logic settings */

$( document ).on('change', '#svs-quiz-cond-use', function(){
	if ( $( this ).val() == 'true' ){
		$( '#svs-quiz-cond-visibility-wrapper' ).add('#svs-quiz-cond-table-wrapper').show();
	}
	else{
		$( '#svs-quiz-cond-visibility-wrapper' ).add('#svs-quiz-cond-table-wrapper').hide();
	}
});

// add new condition
$( document ).on('click', '.svs-quiz-cond-add', function(){
	var html = SvsQuiz.showKeysOptions();

	$('#svs-quiz-cond-table-wrapper table tbody').append( html );
});

// delete condition
$( document ).on('click', '.svs-quiz-cond-delete', function(){
	$( this ).parents('tr').remove();
});

});