<?php


if(($format == 'a4')||($format == 'a4_page')){

    $pdf = new GenericPdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
     
    // set document (meta) information
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('RADIUSdesk');
    $pdf->SetTitle('Internet voucher');
    $pdf->SetSubject('Internet voucher');
    $pdf->SetKeywords('Internet voucher');
     
    $pdf->Title = "Internet Access Voucher"; 
    $pdf->setRTL($rtl);

    //A4 all vouchers per realm
    if($format == 'a4'){
        foreach(array_keys($voucher_data) as $key){
            $d = $voucher_data["$key"];
            // add a page
            $pdf->AddPage();
            //Define logo
            $pdf->Logo = 'img/realms/'.$d['icon_file_name'];
            $pdf->AddRealm($d);
          //  $pdf->SetXY( 10, 20 );
            $pdf->AddVouchers($d['vouchers']);
        } 
    }

    //A4 page per voucher
    if($format == 'a4_page'){
        foreach(array_keys($voucher_data) as $key){
            $d = $voucher_data["$key"];
            foreach($d['vouchers'] as $v){
                // add a page
                $pdf->AddPage();
                //Define logo
                $pdf->Logo = 'img/realms/'.$d['icon_file_name'];
                $pdf->AddRealm($d);
                $pdf->AddVouchers(array($v));
            }
        } 
    }
    //Close and output PDF document
    $pdf->Output('test.pdf', 'I');
}else{
    App::import('Vendor', 'label_pdf');
    $pdf = new LabelPdf($format);
    $pdf->setRTL($rtl);
    $pdf->AddPage();
    foreach(array_keys($voucher_data) as $key){
        $d = $voucher_data["$key"];
        foreach($d['vouchers'] as $v){
            $pdf->Logo = 'img/realms/'.$d['icon_file_name'];
            $pdf->Add_Label($v);
        }
    } 
    $pdf->Output('test.pdf', 'I');
}
?>


?>
