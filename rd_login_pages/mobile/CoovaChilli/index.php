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
<html manifest="" lang="en-US">
<head>
    <meta charset="UTF-8">
    <title>CoovaChilli</title>
    <style type="text/css">
         /**
         * Example of an initial loading indicator.
         * It is recommended to keep this as minimal as possible to provide instant feedback
         * while other resources are still being loaded for the first time
         */
        html, body {
            height: 100%;
            background-color: #1985D0
        }

        #appLoadingIndicator {
            position: absolute;
            top: 50%;
            margin-top: -15px;
            text-align: center;
            width: 100%;
            height: 30px;
            -webkit-animation-name: appLoadingIndicator;
            -webkit-animation-duration: 0.5s;
            -webkit-animation-iteration-count: infinite;
            -webkit-animation-direction: linear;
        }

        #appLoadingIndicator > * {
            background-color: #FFFFFF;
            display: inline-block;
            height: 30px;
            -webkit-border-radius: 15px;
            margin: 0 5px;
            width: 30px;
            opacity: 0.8;
        }

        @-webkit-keyframes appLoadingIndicator{
            0% {
                opacity: 0.8
            }
            50% {
                opacity: 0
            }
            100% {
                opacity: 0.8
            }
        }
    </style>
    <!-- The line below must be kept intact for Sencha Command to build your application -->
    <script id="microloader" type="text/javascript" src=".sencha/app/microloader/development.js"></script>
    <link rel="stylesheet" href="resources/css/login.css"> 
</head>
<body>
    <div id="appLoadingIndicator">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</body>
</html>
