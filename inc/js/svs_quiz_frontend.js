jQuery(document).ready(function($){

	$( '[data-visibility="show"]' ).hide();

	$( '[data-toolkey]' ).each(function(){
		var _this = $( this );

		var keys = $( this ).data('toolkey').split('/');
		keys.pop();

		var values = $( this ).data('value').split('/');
		values.pop();

		var operators = $( this ).data('operator').split('/');
		operators.pop();
		
		$.each(keys, function(index, key){
			var conditionVal = values[index];
			var operator = operators[index];
			var element = $( "[data-key='" + key + "']" ).find('.svs-quiz-tool-element');
			if( element.is('input:text') || element.is('input[type="email"]') || element.is('textarea') ){
				element.on('keyup', function(){
					var inputVal = $( this ).val();
					svsDoCondition( inputVal, operator, conditionVal, _this );
				});
			}
			else{
				element.on('change', function(){
					var inputVal = $( this ).val();
					svsDoCondition( inputVal, operator, conditionVal, _this );
				});				
			}
		});

	});

	function svsDoCondition( inputVal, operator, conditionVal, _this ){
		switch( operator ){
			case 'equals to': 

				if ( inputVal == conditionVal ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'not equals to':

				if ( inputVal != conditionVal ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'greater than':

				if ( inputVal > conditionVal ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'less than':

				if ( inputVal < conditionVal ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'contains':

				if ( inputVal.search(conditionVal) != -1 ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'does not contain':

				if ( inputVal.search(conditionVal) == -1 ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'starts with':

				if ( inputVal.indexOf(conditionVal) == 0 ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;
			case 'ends with':

				if ( inputVal.indexOf(conditionVal, inputVal.length - conditionVal.length ) !== -1 ){
					_this.show();
				}
				else{
					_this.hide();
				}

				break;

		}
	}

});