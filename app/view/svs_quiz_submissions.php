<h2>Submissions</h2>
<div class="svs-list">
	<?php if( !empty( $data ) ): ?>
	<?php $theads = array_keys( $data[0] ); ?>
	<table>
		<thead>
			<tr>
				<th>#</th>
				<?php 
				foreach( $theads as $th ){
					if ( $th == 'ID' ){
						continue;
					}
				?>
				<th><?php echo $th ?></th>
				<?php
				}
				?>
				<th>Details</th>
			</tr>
		</thead>
		<tbody>
			<?php
			$i = 0; 
			foreach( $data as $submission ){
				$i ++;
			?>
			<tr>
				<td><?php echo $i ?></td>
				<?php 
				foreach( $submission as $key => $value ){
					if ( $key == 'ID' ){
				?>
				<td><a href="<?php admin_url()?>admin.php?page=svs_quiz_submissions&Action=svs_quiz_show_details&id=<?php echo $value ?>">more</a></td>
				<?php
						continue;
					}
				?>
				<td><?php echo $value ?></td>
				<?php
				}
				?>
			</tr>
			<?php
			}
			?>
		</tbody>
	</table>
	<?php else: ?>
	<p>No submission found.</p>
	<?php endif; ?>
</div>