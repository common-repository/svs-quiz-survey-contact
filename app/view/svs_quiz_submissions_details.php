<?php 
	$data['Details'] = json_decode($data['Details'], TRUE);
	$user_info = json_decode( $data['User Information'], true );
?>
<?php if ( !empty($data) ) : ?>
<div class="svs-quiz-submissions-details">
	<h2>Details (<?php echo $data['Form'] ?>)</h2>
	<ul>
		<li><b>Name: </b><?php echo $data['Name'] ?></li>
		<li><b>Email: </b><?php echo $data['Email'] ?></li>
		<li><b>Phone: </b><?php echo $data['Phone'] ?></li>
		<li>
			<b>Details: </b> 
			<?php 
			if ( !empty($data['Details']) ){
			?>
			<ul>
			<?php
				foreach ($data['Details'] as $key => $value) {
				?> 
				<?php 
					if (is_array($value)) { ?>
						<li><b><?php echo $key . ': </b>'?>
				<?php
					$last = array_pop(array_keys($value));
						foreach ($value as $key => $value_array) { 
							if($key != $last) {
								echo $value_array.", "; 
							} else {
								echo $value_array;
							}
						}
				?>
						</li>
				<?php
					} else {
				?>
					<li><b><?php echo $key . ': </b>' . $value ?></li>
				<?php
					}
				}
			?>
			</ul>
			<?php
			} 
			?>
		</li>
		<li>
			<b>User Information: </b> 
			<ul>
				<li><b>IP: </b><span><?php echo $user_info['ip'] ?></span></li>
				<li><b>Country: </b><?php echo $user_info['country'] ?></li>
			</ul>
		</li>
	</ul>
	<?php else : ?>
	<p>No data found.</p>
	<?php endif; ?>
</div>