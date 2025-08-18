<?php
header('Content-Type: application/json');
$images = glob("*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}", GLOB_BRACE);
echo json_encode($images);
?>
