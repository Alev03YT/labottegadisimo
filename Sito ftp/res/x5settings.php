<?php

/*
|-------------------------------
|	GENERAL SETTINGS
|-------------------------------
*/

$imSettings['general'] = array(
	'url' => 'http://www.labottegadisimo.it',
	'public_folder' => '',
	'salt' => 'v40a3np6rq2294jlkl89e59at528n8p6ab'
);


/*
|--------------------------------------------------------------------------------------
|	DATABASES SETTINGS (used only in the administration settings, in the 'test' page)
|--------------------------------------------------------------------------------------
*/

$imSettings['databases'] = array();

/*
|-------------------------------------------------------------------------------------------
|	GUESTBOOK SETTINGS (used only in the administration settings, in the 'guestbooks' page)
|-------------------------------------------------------------------------------------------
*/

$imSettings['guestbooks'] = array();
/*
|-------------------------------------------------------------------------------------------
|	Dynamic Objects SETTINGS (used only in the administration settings, in the 'test' page)
|-------------------------------------------------------------------------------------------
*/

$imSettings['dynamicobjects'] = array(
);

/*
|-------------------------------
|	EMAIL SETTINGS
|-------------------------------
*/

$ImMailer->setEmailType('html');
$ImMailer->setExpose(true);
$ImMailer->setHTMLHeader('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' . "\n" . '<html>' . "\n" . '<head>' . "\n" . '<meta http-equiv="content-type" content="text/html; charset=utf-8">' . "\n" . '<meta name="generator" content="Incomedia WebSite X5 v10 - www.websitex5.com">' . "\n" . '</head>' . "\n" . '<body bgcolor="#806000" style="background-color: #806000;">' . "\n\t" . '<table border="0" cellpadding="0" align="center" cellspacing="0" style="padding: 0; margin: 0 auto; width: 700px;">' . "\n\t" . '<tr><td id="imEmailHeader" style="text-align: center; width: 700px;border-top-style: solid; border-top-color: #403000; border-top-width: 1px; border-left-style: solid; border-left-color: #403000; border-left-width: 1px; border-right-style: solid; border-right-color: #403000; border-right-width: 1px; border-bottom-style: none; border-bottom-color: transparent; border-bottom-width: 0px; border-bottom: none; background-color: #FFFFFF;" width="700px"><img src="http://www.labottegadisimo.it/images/Logo_biglietto_da_visita-removebg-preview-1-.png" style="width: 200px; border: none;" width="200px"></td></tr>' . "\n\t" . '<tr><td id="imEmailContent" style="min-height: 300px; padding: 10px; font: normal normal normal 12.0pt \'Century Gothic\'; color: #403000; background-color: #FFFFFF; text-align: left; text-decoration: none;  width: 700px;border-style: solid; border-color: #403000; border-top-width: 0px; border-top: none; border-right-width: 1px; border-bottom-width: 0; border-bottom: none; border-left-width: 1px;background-color: #FFFFFF" width="700px">' . "\n\t\t");
$ImMailer->setHTMLFooter("\n\t" . '</td></tr>' . "\n\t" . '<tr><td id="imEmailFooter" style="font: normal normal normal 7.0pt Tahoma; color: #000000; background-color: transparent; text-align: center; text-decoration: none;  width: 700px;border-style: solid; border-color: #403000; border-top-width: 0; border-top: none; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; padding: 10px; background-color: #FFFFFF" width="700px">' . "\n\t\t" . 'Questo messaggio di posta elettronica contiene informazioni rivolte esclusivamente al destinatario sopra indicato.<br>Nel caso aveste ricevuto questo messaggio di posta elettronica per errore, siete pregati di segnalarlo immediatamente al mittente e distruggere quanto ricevuto senza farne copia.' . "\n\t" . '</td></tr>' . "\n\t" . '</table>' . "\n" . '</body>' . "\n" . '</html>');
$ImMailer->setBodyBackground('#FFFFFF');
$ImMailer->setBodyBackgroundEven('#FFFFFF');
$ImMailer->setBodyBackgroundOdd('#F0F0F0');
$ImMailer->setBodyBackgroundBorder('#CDCDCD');
$ImMailer->setBodySeparatorBorderColor('#403000');
$ImMailer->setEmailBackground('#806000');
$ImMailer->setEmailContentStyle('font: normal normal normal 12.0pt \'Century Gothic\'; color: #403000; background-color: #FFFFFF; text-align: left; text-decoration: none; ');

// End of file x5settings.php