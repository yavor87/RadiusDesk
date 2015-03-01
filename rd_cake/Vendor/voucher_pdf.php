<?php

App::import('Vendor', 'tcpdf/tcpdf');

class VoucherPdf extends TCPDF {

    var $Logo           = 'img/realms/logo.jpg';       //Default Logo
    var $Title          = 'Set The Title';
    var $Language       = 'en';
	//We specify a max hight and max width for the logo - beyond that we force a scale
	var $logo_max_x_px	= 800;
	var $logo_max_y_px	= 100;
	var $px_to_mm		= 3.8;

	var $incl_logo		= true;
	var $incl_title		= true;

	var $OutputInstr	= array(); //Dummy value - will be set just after instantiation

	public function Header() {

		$this->_setBasics();

		//The Header will depending on what is enabled or disabled 
		//call various things to insert on the page if specified

		//We start with the Logo
		if($this->incl_logo){
			$this->_doLogo();
		}

		//Do they need the date?
		if($this->OutputInstr['date']){
			$this->_doDate();
		}

		//Do they need the title?
		if($this->incl_title){
			$this->_doTitle();
		}

		//What about social media
		if($this->OutputInstr['social_media']){
			$this->_doSocialMedia();
		}

		if($this->OutputInstr['realm_detail']){
			$this->_doRealmDetail();
		}

/*
		$style = array(
			'border' => 2,
			'vpadding' => 'auto',
			'hpadding' => 'auto',
			'fgcolor' => array(0,0,0),
			'bgcolor' => false, //array(255,255,255)
			'module_width' => 1, // width of a single module in points
			'module_height' => 1 // height of a single module in points
		);

*/
		//$this->write2DBarcode('www.radiusdesk.com', 'QRCODE,L', 20, 30, 20, 20, $style, 'N');
		
	}

	// Page footer
    public function Footer() {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
        $this->SetFont('helvetica', 'I', 8);

        // Page number
		$pn = $this->getAliasNumPage();
		$np = $this->getAliasNbPages();
        $this->Cell(0, 10, 'Page '.$pn.'/'.$np, 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }

	private function _doLogo(){

		//Get the pixel size of the image
		list($width, $height, $type, $attr) = getimagesize(WWW_ROOT.$this->Logo);

		if($width > $this->logo_max_x_px){ //If it is to wide - we make it less wide
			$we_do = 'x scaling';
			$w 		= $this->logo_max_x_px / $this->px_to_mm;
			$h		= 0;

		}elseif($height > $this->logo_max_y_px){ //If it is to high - we make it less high
			$we_do = 'y scaling';
			$w 		= 0;
			$h		= $this->logo_max_y_px / $this->px_to_mm;

		}else{ //it fits both sides - Normal size here
			$this->setImageScale(1.53);
			$w		= 0;
			$h		= 0;

		}

		// Image($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='',
		// $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false)
		$this->Image(WWW_ROOT.$this->Logo, 0, 16, $w, $h, '', false, 'N', true, 300, 'C', false, false, 0, false, false, false);

	}

	private function _setBasics(){
		$this->SetDrawColor(180,180,180);
        $this->SetTextColor(50,50,50);
        $this->SetLineWidth(0.1);
	}

	private function _doDate(){
		$this->SetFont('dejavusans','',8);
		$this->Cell(0,0,date("F j, Y, g:i a"),0,1,'R');
	}

	private function _doTitle(){
		$this->SetFont('dejavusans','',12);
		$this->Cell(0,0,$this->Title,0,1,'C');
	}

	private function _doSocialMedia(){

		

		//Calculate the amount of items we will fit into a row
		$sm = array(
			array('name' 	=> 'facebook', 		'url' => "http://facebook.com"),
			array('name' 	=> 'twitter', 		'url' => 'http://twitter.com'),
			array('name' 	=> 'youtube',		'url' => 'http://youtube.com'),
			array('name' 	=> 'google_plus',	'url' => 'http://google.com'),
			//array('name' 	=> 'linkedin',	    'url' => 'http://linkedin.com'),
		);

		//Find out how many there are
		$sm_items = count($sm);

		$page_width 	= $this->w;
		$section		= $page_width / $sm_items;
		$padding		= 10;
		$y_start		= 45;
		$width			= 35;

		$height         = 17;               //Hight of borders
        $radius         = 2.5;              //Radius of corners

		$x_start = $padding;
		foreach($sm as $s){
			$this->RoundedRect($x_start,$y_start,$width,$height,$radius,'1111','',
            array('width' => 0.1, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(122, 122, 143)),array());

			$this->Image(WWW_ROOT."img/social_media/".$s['name'].'.png', $x_start+$radius, $y_start+1, 10,10, '', false, '', true, 300, '', false, false, 0, false, false, false);

			$style = array(
				'border' => 2,
				'vpadding' => 'auto',
				'hpadding' => 'auto',
				'fgcolor' => array(0,0,0),
				'bgcolor' => false, //array(255,255,255)
				'module_width' => 1, // width of a single module in points
				'module_height' => 1 // height of a single module in points
			);

			$this->write2DBarcode($s['url'], 'QRCODE,L', $x_start+$width-$radius-15, $y_start+1, 15, 15, $style, 'N');

			//Increase the offset
			$x_start = $x_start + $section;
		}

	}

	private function _doRealmDetail(){

		$d = $this->RealmDetail;
        
        $font_type_1    = 'dejavusans';
        $font_type_2    = 'dejavusans';
        $font_encode    = 'windows-1252';
        $font_format_b  = 'B';
        $font_format_i  = '';
       
        //===== 2 x Borders =======
        //We start by placing two rounded borders which within we will place the realm info.
        $x_start        = $this->w - 200;   //Page width minus 200 start X position
        $x_txt          = $x_start+5;

        $x_start_mid    = $this->w - 100;   //Middle of page start position
        $x_mid_txt      = $x_start_mid+5;

        $y_start        = 70;               //Start Y position of the borders
        $y_txt          = $y_start+2;
        $width          = 90;               //How wide the borders will be
        $height         = 35;               //Hight of borders
        $radius         = 2.5;              //Radius of corners

        $cell_width     = 100;
        $cell_outline   = 0;     

        //Border starts left side of page
        $this->RoundedRect($x_start,$y_start,$width,$height,$radius,'1111','',
            array('width' => 0.2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(122, 122, 143)),array());

        //Border starts in middle of page
        $this->RoundedRect($x_start_mid,$y_start,$width,$height,$radius,'1111','',
            array('width' => 0.2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(122, 122, 143)),array());

        
        //=== LEFT Side =====
        //AP Name
        $this->SetXY($x_txt,$y_txt); //Position the start place
        $this->SetFont($font_type_1,$font_format_b,12);
        $this->Cell($cell_width, 5,$d['name'],$cell_outline,2);  //Name of AP

        //AP Address
        $this->SetFont($font_type_1,$font_format_b,10);
        $this->Cell($cell_width,4,__("Address"),$cell_outline,2);
        $this->SetFont($font_type_2,'',8);
        $address = $d['street_no']." ".$d['street']."\n".$d['town_suburb']."\n".$d['city']."\n".$d["country"]."\nLat ".$d["lat"]."\n"."Lng ".$d["lon"];
        $this->MultiCell($cell_width,3,$address,$cell_outline,2);

        //=== RIGHT Side ===
        //Contact Detail
        $this->SetXY( $x_mid_txt, $y_txt );
        $this->SetFont($font_type_1,$font_format_b,8);
        $this->Cell($cell_width,4,__('Contact Detail'),$cell_outline,2);
        //url
        if($d['url'] != ''){
            $this->SetFont($font_type_2,$font_format_i,8);
           // $this->SetTextColor(0,0,255);
            $this->Cell($cell_width,3,$d['url'],$cell_outline,2);
        }
        //email
        if($d['email'] != ''){
            $this->SetFont($font_type_2,$font_format_i,8);
          //  $this->SetTextColor(0,0,255);
            $this->Cell($cell_width,3,$d['email'],$cell_outline,2);
        }

        $this->SetTextColor(0);

        //phone
        if($d['phone'] != ''){
            $this->SetFont($font_type_2,$font_format_i,8);
            $this->Cell($cell_width,3,$d['phone'].' ('.__('phone').')',$cell_outline,2);
        }

        //cell
        if($d['fax'] != ''){
            $this->SetFont($font_type_2,$font_format_i,8);
            $this->Cell($cell_width,3,$d['fax'].' ('.__('fax').')',$cell_outline,2);
        }

         //fax
        if($d['cell'] != ''){
            $this->SetFont($font_type_2,$font_format_i,8);
            $this->Cell($cell_width,3,$d['fax'].' ('.__('cell').')',$cell_outline,2);
        }
    
	}

	public function addSocialMedia(){

		$page_width 	= $this->w;
		$mid_page		= $page_width / 2;
		$padding		= 10;
		$y_start		= 40;
		$width			= $mid_page - (2*$padding);

			//===== 2 x Borders =======
        //We start by placing two rounded borders which within we will place the realm info.
    
       // $width          = 90;               //How wide the borders will be
        $height         = 22;               //Hight of borders
        $radius         = 2.5;              //Radius of corners


        //Border starts left side of page
        $this->RoundedRect($padding,$y_start,$width,$height,$radius,'1111','',
            array('width' => 0.1, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(122, 122, 143)),array());

        //Border starts in middle of page
        $this->RoundedRect($mid_page+$padding,$y_start,$width,$height,$radius,'1111','',
            array('width' => 0.1, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(122, 122, 143)),array());

		//Place the image:
		$this->Image(WWW_ROOT."img/social_media/facebook.png", $padding+$radius, $y_start+2, 15,15, '', false, '', true, 300, '', false, false, 0, false, false, false);

		$this->Image(WWW_ROOT."img/social_media/twitter.png", $mid_page+$padding+$radius, $y_start+2, 15,15, '', false, '', true, 300, '', false, false, 0, false, false, false);


		$style = array(
			'border' => 2,
			'vpadding' => 'auto',
			'hpadding' => 'auto',
			'fgcolor' => array(0,0,0),
			'bgcolor' => false, //array(255,255,255)
			'module_width' => 1, // width of a single module in points
			'module_height' => 1 // height of a single module in points
		);

		$this->write2DBarcode('www.facebook.com', 'QRCODE,L', $padding+$width-$radius-20, $y_start+1, 20, 20, $style, 'N');

		$this->write2DBarcode('www.twitter.com', 'QRCODE,L', $mid_page+$padding+$width-$radius-20, $y_start+1, 20, 20, $style, 'N');
	}

}

?>  

