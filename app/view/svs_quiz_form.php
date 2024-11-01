<div class="svs-add-new-form">
	<header class="svs-content-header">
		<div>
			<h2><?php echo $data['title'] ?></h2>
		</div>
		<div>
			<span class="svs-quiz-btn svs-quiz-btn-blue svs-quiz-form-settings"><i class="fa fa-cog"></i><span>Settings</span></span>
		</div>
		<div>
			<label for="svs-form-name"><?php echo __( 'Form Name', 'svs' ) ?></label>
			<input type="text" placeholder="Form name" id="svs-form-name" value="<?php echo $data['form_name'] ?>">
		</div>
	</header>
	<div class="svs-quiz-dashboard">
		<ul class="svs-quiz-sidebar">
			<li class="svs-quiz-sidebar-parent">
				<a href="javascript:void(0)"><i class="fa fa-caret-down"></i>Static Elements</a>
				<ul class="svs-quiz-sidebar-child">
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-row">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Row</span>
							<i class="fa fa-columns svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-header">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Header</span>
							<i class="fa fa-header svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-text">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Static Text</span>
							<i class="fa fa-font svs-quiz-icon-right"></i>
						</div>
					</li>
				</ul>
			</li>
			<li class="svs-quiz-sidebar-parent">
				<a href="javascript:void(0)"><i class="fa fa-caret-down"></i>Text Inputs</a>
				<ul class="svs-quiz-sidebar-child">
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-text-input">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Text Input</span>
							<i class="fa fa-italic svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-textarea">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Large Text Input</span>
							<i class="fa fa-file-text-o svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-name">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Name (Stored in DB)</span>
							<i class="fa fa-user svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-email">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Email (Stored in DB)</span>
							<i class="fa fa-envelope-o svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-phone">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Phone (Stored in DB)</span>
							<i class="fa fa-phone svs-quiz-icon-right"></i>
						</div>
					</li>
				</ul>
			</li>
			<li class="svs-quiz-sidebar-parent">
				<a href="javascript:void(0)"><i class="fa fa-caret-down"></i>Multi Options</a>
				<ul class="svs-quiz-sidebar-child">
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-combo">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Combo Box</span>
							<i class="fa fa-list-ul svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-single-select">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Single Select</span>
							<i class="fa fa-dot-circle-o svs-quiz-icon-right"></i>
						</div>
					</li>
					<li>
						<div class="svs-quiz-tools ui-widget-content" id="svs-quiz-multi-select">
							<i class="fa fa-arrows-alt"></i>
							<span class="svs-quiz-tool-title">Multi Select</span>
							<i class="fa fa-check-square-o svs-quiz-icon-right"></i>
						</div>
					</li>
				</ul>
			</li>
		</ul>
		<div class="svs-quiz-content">
			<ul class="connectedSortable"><?php echo $data['dashboard'] ?></ul>
		</div>
	</div>
	<footer class="svs-content-footer">
		<a href="javascript:void(0)" class="svs-quiz-btn svs-quiz-btn-blue svs-add-new-form-btn" data-form="<?php echo $data['form_id'] ?>"><?php echo __( 'Save', 'svs' ) ?></a>
	</footer>
	<div class="svs-dashboard-clone"></div>
</div>
<div class="svs-modal">
	<div class="svs-modal-header">
		<span class="svs-modal-title"><?php echo __( 'Settings', 'svs' ) ?></span>
		<span class="svs-modal-close"><i class="fa fa-times"></i></span>
	</div>
	<div class="svs-modal-content">

	</div>
	<div class="svs-modal-footer">
		<a href="javascript:void(0)" class="svs-quiz-btn svs-quiz-btn-green"><?php echo __( 'Save', 'svs' ) ?></a>
	</div>
</div>