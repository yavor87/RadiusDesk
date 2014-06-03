var rdDynamic = (function () {

  //Immediately returns an anonymous function which builds our modules
  return function (co,$) {    //co is short for config object

    //Public -> Test for hotspot  
    var isHotspot = function(){     
        var byName = $.getUrlVar(co.queryItem);
        if(byName == undefined){
            return false;
        }else{
            return true;
        }
    }

    //Public -> Add Dynamic info
    var addDynamicInfo = function(){
        var retInfo;
        var url = co.dynUrl+document.location.search;
        $.getJSON(url, null, function(j) { //We send the ruery string along

            //______________________________________
            //____Add the photo's if there are any

            var small, large, caption, item;
            var img_scaler  = co.scaler+'?height='+co.thumb_h+'&width='+co.thumb_w+'&image=';

            for(i in j.data.photos){
              //  console.log(j.data.photos[i]);
                small   = img_scaler+j.data.photos[i].file_name;
                large   = j.data.photos[i].file_name;
                caption = j.data.photos[i].title;
                item    = "<li><a href='"+large+"' rel='external'><img src='"+small+"' alt='"+caption+"' /></a></li>";
               // console.log(item)
                $('#GalUl').append(item);      
            }

            //______________________________________________
            //___ Populate the dynamic info ________________
            $('#dynAbout').text(j.data.detail.name);
            $('#dynIcon').attr('src',j.data.detail.icon_file_name);
            $('#dynLogo').attr('src',j.data.detail.icon_file_name);
            $('#dynPhone').text(j.data.detail.phone);
            $('#dynFax').text(j.data.detail.fax);
            $('#dynCell').text(j.data.detail.cell);
            $('#dynAddr').html(j.data.detail.street_no+" "+j.data.detail.street+"<br>"+j.data.detail.town_suburb+"<br>"+j.data.detail.city);
           // $('#dynLat').text(j.data.detail.lat);
          //  $('#dynLng').text(j.data.detail.lon);
            $('#dynUrl').text(j.data.detail.url);
            $('#dynUrl').attr('href',j.data.detail.url);
            $('#dynMail').text(j.data.detail.email);
            $('#dynMail').attr('href','mailto:'+j.data.detail.email);

            //Add the own pages as content of Help page
             for(i in j.data.pages){
                var previous = $('#HelpContent').html();
                $('#HelpContent').html(previous+"<h2>"+j.data.pages[i].name+"</h2>"+j.data.pages[i].content+"<br>");
            }
   
        });
    }

    //Expose those public items...
    return {         
        isHotspot       : isHotspot,
        addDynamicInfo  : addDynamicInfo
    }   
  }
})();
