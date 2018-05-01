/** REDUCE Photoshop Plugin
*   Fabrizio Pellegrini
*   luglio 2013
*   fabrizio@vanityweb.it
*/

function main(){
    
    //Controllo di partenza
    if(!confirm ("Proseguo con la conversione?", false, "Confermi lo script?")) return;
    if(!documents.length) return;
    
    //Imposto unità a pixel
    app.preferences.rulerUnits = Units.PIXELS;
    
    //Creazione cartella web
    var percorso = Folder(activeDocument.path + "/web");
    if(!percorso.exists)
        percorso.create();
    
    //Trattamento nome file
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    Name = prompt("Titolo del file?",Name);
    
    
    //Set tipo file jpg/png
    var filetype = SaveDocumentType.PNG;
    var exte =".png";
    var jpegQuality = 60;
    if ( confirm ("Formato JPG? (no=PNG-24)", false, "JPG o PNG-24?")  ){
        filetype = SaveDocumentType.JPEG;
        exte = ".jpg";
        jpegQuality = prompt("Compressione?", 60);
    }

    //Contrasto automatico
    var autocontrasto = confirm("Contrasto Automatico?", false, "Applicare il contrasto automatico?") ;

    //Impostazione misure
    var width = prompt("Larghezza",app.activeDocument.width.value);


    //Copyright
    var copyright = confirm("Aggiungo Copyright?", false, "Copyright Information") ;

    
    //Copyright+Watermark FILE
    if (copyright){

        //var wm = app.load("~/Pictures/mg_wm.png");
        var fileRef = new File("~/Pictures/mg_wm2.png")
        var docRef = app.open (fileRef)
        docRef.selection.selectAll();
        docRef.selection.copy();
        docRef.close(SaveOptions.DONOTSAVECHANGES);
        
    }    

    
    //Ciclo di tutte le immagini aperte
    for (var i=0;i<documents.length;i++){
        
        //Selezione sequenziale del documento attivo
        activeDocument = documents[i];
        
        //Contrasto automatico
        if (autocontrasto)
            activeDocument.artLayers[0].autoContrast();
        
        //Resize
        if( width != app.activeDocument.width.value)
            resizeImg(width);

        //Copyright+Watermark
        if (copyright){

            //var x = activeDocument.width.value;
            //var y = activeDocument.height.value;        
            var newLayer = activeDocument.artLayers.add();
            activeDocument.paste(); 
            //newLayer.move(activeDocument.layers[1],ElementPlacement.PLACEAFTER);
            newLayer.opacity = 25;
            activeDocument.flatten();
            
            var docInfoRef = activeDocument.info
            docInfoRef.author = "GRUPPO MG";
            docInfoRef.caption = "GRUPPO MG PICTURE";
            docInfoRef.copyrightNotice = "Copyright (c) GRUPPO MG"
            docInfoRef.copyrighted = CopyrightedType.COPYRIGHTEDWORK;
            docInfoRef.ownerUrl = "http://www.gruppo-mg.com";              
            
        }
            
        var saveFile = File(percorso + "/" + Name + "-" + i + exte);
        if(saveFile.exists){
           if(!confirm("Sovrascrivo?")) return;
            saveFile.remove();
            }
        SaveForWeb(saveFile,filetype, jpegQuality);
    }    
}

main();

//Salvataggio per Web
function SaveForWeb(saveFile, filetype, jpegQuality) {
    var sfwOptions = new ExportOptionsSaveForWeb(); 
        sfwOptions.format = filetype; 
        sfwOptions.includeProfile = false; 
        sfwOptions.interlaced = 0;
        sfwOptions.optimized = true; 
        sfwOptions.PNG8 = false;
        sfwOptions.quality = jpegQuality; //0-100
     
    activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);
}


//Ridimensionamento dell'immagine
function resizeImg(width){
    
    activeDocument.resizeImage(UnitValue(width,"px"));
}