<a href="<?php admin_url()?>admin.php?page=svs_quiz&Action=svs_quiz_add_new_form" class="svs-quiz-btn svs-quiz-btn-green"><i class="fa fa-file"></i><span><?php echo __( 'Add New Form', 'svs' ) ?></span></a>
<div class="svs-list">
    <table>
        <thead> 
        	<tr>
        		<th><?php echo __( 'ID', 'svs' ) ?></th>
        		<th><?php echo __( 'Name', 'svs' ) ?></th>
        		<th><?php echo __( 'ShortCode', 'svs' ) ?></th>
        		<th><?php echo __( 'Actions', 'svs' ) ?></th>
        	</tr>
        </thead>
        <?php
            if ( empty( $data ) ) {
                echo '<tr><td>';
                echo __( 'No quiz found', 'svs' );
                echo '</td></tr>';
            } else {
                foreach ( $data as $form ) {
                    echo '<tr>';
                    echo "<td>{$form['ID']}</td><td>{$form['name']}</td><td><input type='text' value='[svs_quiz id={$form['ID']}]' readonly></td>";
                    echo '<td><a href="'. admin_url() .'admin.php?page=svs_quiz&Action=delete&id=' . $form['ID'] . '" class="svs-quiz-btn svs-quiz-btn-red svs-quiz-delete-form"><i class="fa fa-trash"></i></a><a href="'. admin_url() .'admin.php?page=svs_quiz&Action=svs_quiz_edit_form&id=' . $form['ID'] . '" class="svs-quiz-btn svs-quiz-btn-orange"><i class="fa fa-pencil"></i></a></td>';
                    echo '</tr>';
                }
            }
        ?>
    </table>
</div>