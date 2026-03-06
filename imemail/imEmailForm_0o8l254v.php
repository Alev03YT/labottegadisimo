<?php
if(substr(basename($_SERVER['PHP_SELF']), 0, 11) == "imEmailForm") {
	include '../res/x5engine.php';
	$form = new ImForm();
	$form->setField('Nome', $_POST['imObjectForm_1_1'], '', false);
	$form->setField('Cogmome', $_POST['imObjectForm_1_2'], '', false);
	$form->setField('Indirizzo', $_POST['imObjectForm_1_3'], '', false);
	$form->setField('Telefono', $_POST['imObjectForm_1_4'], '', false);
	$form->setField('email', $_POST['imObjectForm_1_5'], '', false);
	$form->setField('Messaggio', $_POST['imObjectForm_1_6'], '', false);
	$form->setField('Condizioni di Vendita', $_POST['imObjectForm_1_7'], '', false);
	$form->setFile('Allegato', $_FILES['imObjectForm_1_8'], $imSettings['general']['public_folder'], '', 'jpg, png, pdf');

	if(@$_POST['action'] != 'check_answer') {
		if(!isset($_POST['imJsCheck']) || $_POST['imJsCheck'] != 'jsactive' || (isset($_POST['imSpProt']) && $_POST['imSpProt'] != ""))
			die(imPrintJsError());
		$form->mailToOwner($_POST['imObjectForm_1_5'] != "" ? $_POST['imObjectForm_1_5'] : 'avid4049576@altervista.org', 'avid4049576@altervista.org', 'RICHIESTA', 'Hai ricevuto la seguente richiesta', true);
		$form->mailToCustomer('bottegadisimo@gmail.com', $_POST['imObjectForm_1_5'], '', 'Gentile cliente,

abbiamo ricevuto la tua richiesta.
Ti risponderemo nel più breve tempo possibile.

Buona giornata,
Lo staff de La Bottega di Simo', true);
		@header('Location: ../index.html');
		exit();
	} else {
		echo $form->checkAnswer(@$_POST['id'], @$_POST['answer']) ? 1 : 0;
	}
}

// End of file