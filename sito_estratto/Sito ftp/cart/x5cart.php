<?php

include ("../res/x5engine.php");
$ecommerce = new ImCart();
// Setup the coupon data
$couponData = array();
$couponData['cart'] = array('coupon' => 'SIMO10', 'amount' => 0.1000000);
$couponData['products'] = array(
	'5k0qr99q' => 'SIMO10',
	'3usj0w17' => 'SIMO10',
	'69wh1dav' => 'SIMO10',
	'etj6p9cp' => 'SIMO10',
	'7z4qn1x7' => 'SIMO10',
	'pis44385' => 'SIMO10',
	'0tr857cv' => 'SIMO10',
	'vu7aup06' => 'SIMO10',
	'm9b276jv' => 'SIMO10',
	'15wte3x7' => 'SIMO10',
	'jdxd1669' => 'SIMO10',
	'0ot09a76' => 'SIMO10',
	'vkbh5t9p' => 'SIMO10',
	'2erxll83' => 'SIMO10',
	'gavc83at' => 'SIMO10',
	'7252eff5' => 'SIMO10',
	'9g7nrkcx' => 'SIMO10',
	'hp6u407x' => 'SIMO10',
	'y8c5n1t1' => 'SIMO10',
	'p5q01q44' => 'SIMO10',
	'd8lhhhex' => 'SIMO10',
	'thpc9k9a' => 'SIMO10',
	'3m6m3z58' => 'SIMO10',
	'4havm33r' => 'SIMO10',
	'31c4h314' => 'SIMO10',
	'i88id7cm' => 'SIMO10',
	'dog9s3fb' => 'SIMO10',
	'75753pox' => 'SIMO10',
	'9x3999u1' => 'SIMO10',
	'd6w57bk2' => 'SIMO10',
	'r9b0p13i' => 'SIMO10',
	'k19gwz90' => 'SIMO10',
	'gmd234hm' => 'SIMO10',
	'63oq21s9' => 'SIMO10',
	'r4mlf07i' => 'SIMO10',
	'gjp0y7en' => 'SIMO10',
	'81b43041' => 'SIMO10',
	'593ae3iq' => 'SIMO10',
	'lo6gxxy5' => 'SIMO10',
	'924rdwi8' => 'SIMO10',
	'0vp67o19' => 'SIMO10',
	'j53n570k' => 'SIMO10',
	'41usqj39' => 'SIMO10',
	'tf5g76i3' => 'SIMO10',
	'22qd6s13' => 'SIMO10',
	'om1279sm' => 'SIMO10',
	'1nl5w2s6' => 'SIMO10',
	'94ewli65' => 'SIMO10',
	'd24hna5c' => 'SIMO10',
	'0z26i952' => 'SIMO10',
	'4w49a76d' => 'SIMO10',
	'g3940im6' => 'SIMO10',
	'g179b800' => 'SIMO10',
	'5w780e3o' => 'SIMO10',
	'9a897492' => 'SIMO10',
	'z25226w4' => 'SIMO10',
	'2m225972' => 'SIMO10',
	'hh3507wo' => 'SIMO10'
);
// Setup the cart
$ecommerce->setPublicFolder('');
$ecommerce->setCouponData($couponData);
$ecommerce->setSettings(array(
	'force_sender' => false,
	'email_opening' => 'Gentile Cliente,<br /><br />Ringraziandola per il Suo acquisto le inviamo il riepilogo del suo Ordine.<br /><br />Qui di seguito può trovare l\'elenco dei prodotti ordinati, i dati di fatturazione e le istruzioni per la spedizione ed il pagamento scelto.',
	'email_closing' => 'Rimaniamo a Sua disposizione per ulteriori informazioni.<br /><br />Cordiali Saluti, Staff Commerciale.',
	'useCSV' => false,
	'header_bg_color' => '#BF8F00',
	'header_text_color' => '#FFFFFF',
	'cell_bg_color' => 'transparent',
	'cell_text_color' => '#403000',
	'border_color' => '#806000',
	'owner_email' => 'ordini@labottegadisimo.it',
	'vat_type' => 'included'
));

// Check the coupon code
if (@$_GET['action'] == 'chkcpn' && isset($_POST['coupon'])) {
	header('Content-type: application/json');
	echo $ecommerce->checkCoupon($_POST['coupon']);
	exit();
} else if (@$_GET['action'] == 'sndrdr' && isset($_POST['orderData'])) {
	$orderNo = $_POST['orderData']['orderNo'];
	$ecommerce->setOrderData($_POST['orderData']);
	$ecommerce->sendOwnerEmail();
	$ecommerce->sendCustomerEmail();
	header('Content-type: application/json');
	echo '{ "orderNo": "' . $orderNo . '" }';
	exit();
}

// End of file x5cart.php