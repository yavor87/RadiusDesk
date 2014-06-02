<?php
    //Paypal will add a tx=<transaction ID to the query string> but not always so if it does not happen; OR if we have
    // a POST we override the default!
    //Note here that the USA PayPal add tx=<transaction> while the UK one POST the whole transaction but in the POST it is txn_id
    if(array_key_exists('txn_id',$_POST)){

        //Remove the &tx=whatever of the previous one if there were any (its slapped on at the end)
        $q_s        = $_SERVER["REQUEST_URI"];
        $q_s        = preg_replace('/&tx=.*/', "", $q_s);
        $txn_id     = $_POST['txn_id'];
        $new_url    = $q_s.'&tx='.$txn_id;
        header("Location: ".$new_url);
        exit;
    }
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <!-- <x-compile> -->
        <!-- <x-bootstrap> -->
            <link rel="stylesheet" href="bootstrap.css">
            <link rel="stylesheet" href="resources/css/login.css">
            <script src="ext/ext-dev.js"></script>
            <script src="bootstrap.js"></script>
        <!-- </x-bootstrap> -->
        <script src="app.js"></script>
    <!-- </x-compile> -->
</head>
<body></body>
</html>
