<?php

try {

    header("Content-type: text/plain");

    //=================
    //First we check if the MAC is a valid MAC
    if(!(isset($_GET['mac']))){
        echo "Page called in a wrong way!";
        return;
    }else{
        $mac_addr = $_GET['mac'];
        //Check if the MAC is in the correct format
        $pattern = '/^([0-9a-fA-F]{2}[-]){5}[0-9a-fA-F]{2}$/i';
        if(preg_match($pattern, $mac_addr)< 1){
            $error = "ERROR: MAC missing or wrong";
            echo "$error";
            return;
        }
    }

    //=====================
    //Basic sanity checks complete, now connect....

    //Find the credentials to connect with
    include_once("/var/www/cake2/rd_cake/Config/database.php");
    $dbc    = & new DATABASE_CONFIG();
    $host   = $dbc->default['host'];
    $login  = $dbc->default['login'];
    $pwd    = $dbc->default['password'];
    $db     = $dbc->default['database'];

    $dbh    = new PDO("mysql:host=$host;dbname=$db", $login, $pwd, array(PDO::ATTR_PERSISTENT => true));
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Check if any of the NAS devices has this MAC defined as it's community
    $stmt_nas_id        = $dbh->prepare("SELECT id FROM nas WHERE community= :mac_addr");
    $stmt_nas_id->bindParam(':mac_addr',$mac_addr);
    $stmt_nas_id->execute();

    $result             = $stmt_nas_id->fetch(PDO::FETCH_ASSOC);
    if($result == ''){
        header("Content-type: text/plain"); //send command
        echo("ERROR: MAC not listed in database");
        return;
    }

    //==================
    //== Update the last_contact field
    //==================
    $nas_id         = $result['id'];
    $stmt_hb_upd    = $dbh->prepare("UPDATE nas SET last_contact=now() WHERE id=:nas_id");
    $stmt_hb_upd->bindParam(':nas_id',$nas_id);
    $stmt_hb_upd->execute();

    //=================
    //== Check for any actions for this one....
    //================== 

    $stmt_actions       = $dbh->prepare("SELECT id, action, command, na_id FROM actions WHERE na_id= :nas_id and status='awaiting'");
    $stmt_actions->bindParam(':nas_id',$nas_id);
    $stmt_actions->execute();

    $result             = $stmt_actions->fetchAll(PDO::FETCH_ASSOC);
    $return_string      = "";

    $stmt_upd_fetched   = $dbh->prepare("UPDATE actions SET actions.status='fetched' where actions.id= :action_id");
    $stmt_upd_fetched->bindParam(':action_id',$action_id);

    foreach($result as $item){
            $id         = $item['id'];
            $action     = $item['action'];
            $command    = $item['command'];
            $return_string = $return_string."unique_id: $id\naction: $action\n$command\n";
            $nas_id     = $item['nasid'];
            //Mark this action as fetched
            $action_id  = $id;
            $stmt_upd_fetched->execute();
    }
    header("Content-type: text/plain"); //send command
    print $return_string;
    $dbh = null;
}
catch(PDOException $e){
    echo $e->getMessage();
    
}

?>
