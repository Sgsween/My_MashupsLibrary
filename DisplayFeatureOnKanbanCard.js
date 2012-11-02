tau.mashups
	.addDependency("libs/jquery/jquery")
	.addMashup(function () {
	    var imageURL = '';
	    var tpURL = '';
	    var acid = ''
	    var addFeatureToCards = function () {
	        $('div.kanban-item').each(function () {
	            var el = $(this);
	            var itemType = null;
	            var itemId = el.find('.kanban-item-id:first').html();
	            if (el.id().match(/kanban-item-userstory-\d+/)) {
	                itemType = 'UserStories';
	            } else if (el.id().match(/kanban-item-bug-\d+/)) {
	                itemType = 'Bugs';
	            } else if (el.id().match(/kanban-item-feature-\d+/)) {
	                itemType = 'Features';
	            }
	            if (itemType == null)
	                return;
	            if (itemType != 'UserStories')
	                return;

	            $.ajax({
	                type: 'GET',
	                url: tpURL + '/api/v1/' + itemType + '/' + itemId + '?include=[Feature[Id,Name,Description,UserStories-Count]]&format=json',
	                context: el[0],
	                contentType: 'application/json',
	                dataType: 'json',
	                success: function (resp) {
	                    if (resp.Feature != null && resp.Feature.length != 0) {
	                        if ($(this).find('.tasks-bugs')[0] == undefined) {

	                            var tbd = $('<div class="tasks-bugs"></div>');
	                            if ($(this).find('.kanban-avatars')[0] == undefined) {

	                                tbd.addClass('tasks-bugs-left');
	                            }
	                            $(this).append(tbd);
	                        }
	                        if ($(this).find('.tasks-bugs').find('.featureInfo')[0] == undefined) {
	                            $(this).find('.tasks-bugs').append('<a id="featureInfo" href="' + tpURL + '/restui/tpview.aspx?acid=' + acid + '#feature/' + resp.Feature.Id + '" class="featureInfo" title="ID: ' + resp.Feature.Id + '<br />Feature: ' + resp.Feature.Name + '<br />Description: ' + (resp.Feature.Description != null ? resp.Feature.Description.replace('<div>', '').replace('</div>', '') : '') + '<br />User Stories: ' + resp.Feature["UserStories-Count"] + '">FEAT:' + resp.Feature.Id + '</a>');
	                            $(this).find('.featureInfo').mouseover(function (e) {
	                                var tip = $(this).attr('title');

	                                $(this).attr('title', '');

	                                $(this).append('<div id="tooltip"><div class="tipHeader"></div><div class="tipBody">' + tip + '</div><div class="tipFooter"></div></div>');


	                                $('#featureToolTip').css('top', e.pageY + 10);
	                                $('#featureToolTip').css('left', e.pageX + 20);

	                                $('#featureToolTip').fadeIn('500');
	                                $('#featureToolTip').fadeTo('10', 0.8);

	                            }).mousemove(function (e) {

	                                $('#featureToolTip').css('top', e.pageY + 10);
	                                $('#featureToolTip').css('left', e.pageX + 20);

	                            }).mouseout(function () {

	                                $(this).attr('title', $('.tipBody').html());

	                                $(this).children('div#tooltip').remove();

	                            });
	                        }
	                    }
	                }
	            });
	        });


	    };

	    var addRequiredCSS = function () {
	        $('head').append('<style type="text/css">' +
                            '.kanban-item .tasks-bugs .featureInfo {' +
                                'background: url("' + imageURL + '") no-repeat;' +
                                'width: auto; height: 16px; display: inline-block; padding: 0 3px 0 16px;' +
                                'font-weight: bold; text-decoration: underline;' +
                            '}'
                                 +
                                    '#tooltip {' +
                                    'position:absolute;' +
                                    'z-index:99999;' +
                                    'color:#fff;' +
                                    'font-size:10px;' +
                                    'width:180px; ' +
                                    '}' +

                                    '#tooltip .tipHeader {' +
                                     '   height:8px;' +
                                    '}' +
	        /* IE hack */
                                    '*html #tooltip .tipHeader {' +
                                    'margin-bottom:-6px;' +
                                    '}' +

                                    '#tooltip .tipBody {' +
                                     'background-color:#909090;' +
                                     'padding:5px;' +
                                     '-moz-box-shadow: 0 0 10px #000;' +
	                                 '-webkit-box-shadow: 0 0 10px #000;' +
	                                 'border-radius:10px;' +
                                    '}' +

                                    '#tooltip .tipFooter {' +
                                     '   height:8px;' +
                                    '}' +
                                  +
                        '</style>');
	    };


	    $(document).ready(function () {


	        addRequiredCSS();

	        setTimeout(function () {
	            addFeatureToCards();
	        }, 1000);
	        $.each(Tp.controls.kanbanboard.KanbanboardManager.getInstance().kanbanBoards, function () {

	            $(this)[0].controller.uxKanbanBoardPanel.on('reload', function () {
	                setTimeout(function () {
	                    addFeatureToCards();
	                }, 1000);
	            });

	            $(this)[0].controller.uxKanbanBoardPanel.on('loadItemsSuccess', function () {
	                setTimeout(function () {
	                    addFeatureToCards();
	                }, 1000);
	            });

	            $(this)[0].controller.on('statechanged', function (b, c) {
	                addFeatureToCards();
	            });
	        });
	    });
	});
