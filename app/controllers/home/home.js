var home = phox.createController(phox.main, 'phox.home')
.onload(function() {
        var origin = this.getOrigin();
        TRegistry.item(this.name).token = this.getToken();

        TWebObject.getCSS('css/accordion.css');
        this.getScript('js/accordion.js', function() {
        
            $('.accordion').multiaccordion({defaultIcon: "ui-icon-plusthick", activeIcon: "ui-icon-minusthick"});
            home.showToken();
            home.dragAndDrop(gridData);

            var handleDrop = function(e, ui) {

                var element = ui.draggable.clone().appendTo($(this));
                element.draggable({
                    cancel: "a.ui-icon", 
                    revert: "invalid", 
                    containment: "#dropper", 
                    helper: "clone",
                    cursor: "move"
                });
            };

            $("#dropper").droppable({
                accept: '#grid div'
                , drop: handleDrop
            });
        });
    }
).actions({
    showToken : function() {
        
        var token = TRegistry.item(this.name).token;

        this.getPartialView('token.html', 'showToken', '#token', {'token': token}, function(data) {
            $("#tokenLink").on("click", function() {
                home.showToken();
            });
            
        });
        return false;
    }
    , showArtist : function(name) {
        $('#wikipedia').attr('src', 'https://en.wikipedia.org/wiki/' + name);
    }
    , showAlbum : function(name) {
        try {
            this.getJSON('home.html', {'action': 'wikiArtist', 'artist': name}, function(data) {
                if(data.return == 200) {
                    TUtils.html64('#wikipedia', data.view);
                } else {
            	        debugLog(base64_decode(data.view));
                }
            });
        } catch (e) {
            debugLog(e);
        }
     }
    , showTitle : function(id) {
        $("#vikipedia").html("Title #" + id);
    }
    , getData : function(count, index, anchor) {

        this.getJSON('grid.html'
            , {
                'action': "getData"
                , 'pagecount': count
                , 'pagenum': index
                //, 'token'
            }
            , function (data) {
                TAccordion.create().bind('#grid', data.grid.names, data.grid.values, data.grid.templates, data.grid.elements);
                $(anchor).html(index);
                $(".accordion").multiaccordion({defaultIcon: "ui-icon-plusthick", activeIcon: "ui-icon-minusthick"});
                home.dragAndDrop(data.grid);
            }
        );

        return false;
    }
    , dragAndDrop : function(data) {
        $("div[name='draggable']").each(function() {
           var id = $(this).data('draghelperid');
           var index = data.names.indexOf('TitleId');
           var dragValues = TUtils.find(data.values, index, id);

           var dragIndex = $(this).data('draghelperindex');
           var dragTemplate = TPlugin.applyDragHelper(data.templates, dragValues, dragIndex);

           var dragHelper = function(e) {
              return dragTemplate;
           }               

           $(this).draggable({
                cursor: 'move'
                , containment: 'document'
                , stack: '#grid div'
                , helper: dragHelper
            });
        });
        
    }
});