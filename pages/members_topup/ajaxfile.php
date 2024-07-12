<?php

if (isset($_FILES['file']['name'])) {
    // file name
    $filename = $_FILES['file']['name'];
    $type_pic = '';
    if ($_FILES['file']['type'] == "image/jpeg") {
        $type_pic = ".jpg";
    } else if ($_FILES['file']['type'] == "image/png") {
        $type_pic = ".png";
    }

    $newName = date("Y-m-d") . "_" . rand(100000, 999909) . $type_pic;
    $_FILES['file']['name'] = $newName;
    $filename = $newName;

    // Location
    $location = 'upload/' . $filename;

    // file extension
    $file_extension = pathinfo($location, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);

    // Valid image extensions
    $valid_ext = array("pdf", "doc", "docx", "jpg", "png", "jpeg");


    if (in_array($file_extension, $valid_ext)) {
        // Upload file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
            $arr = array('status' => true, 'name' => $filename);
        }else{
            $arr = array('status' => false);
        }
    }

    // echo $response;
    echo json_encode($arr);
    exit;
}
