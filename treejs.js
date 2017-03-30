/*!
 * jtree JavaScript Library v1.0
 *
 * Includes jquery.js
 * https://jquery.com/
 * 
 * Author : Mayank Pandey
 * 
 * Date: 2017-March-05 Time: 02:30
 *
 */

(function ( $ ) {

    var attributes      = null;
    var targetElement   = null;

    $.fn.treejs = function( options ) {

    	// get the reference of target element
    	targetElement = this;

    	attributes = $.extend({
            url 		: null,
			sourceType 	: 'html', 	// html, json. html is default
			initialState: 'close', 	// open, close. Default is close
            dataSource  : null,     // dataSource contains json data in it. It is used when sourceType is json
        }, options );
		
		// ajax call to get the tree nodes from a php script in case of sourceType = html
        if( attributes.sourceType == 'html' )
        {
            if( attributes.url == null )
            {
                alert('Error: missing ajax url');
                return false;
            }

    		$.ajax({
    			url : attributes.url,
    			method: 'get',
    			async: false,
    			data:
    			{
    				sourceType: attributes.sourceType
    			},
    			success: function(response)
    			{
    				$(targetElement).html(response);
    			}
    		});
        }
        // Otherwise iterate the dataSource and prepare the nodes
        else
        {
            if( attributes.dataSource == null )
            {
                alert('Error: Missing dataSource JSON object');
                return false;
            }

            var data = attributes.dataSource;
            var html = '';

            for(var i in data)
            {
                if( data.hasOwnProperty(i) )
                {
                    html += '<ul class="jtree_parent_node"> <li> <span class="jtree_expand jtree_node_open"> </span> <label><input type="checkbox" id="'+ data[i]['parentNodeId'] +'" parent-id="" class="jtree_parent_checkbox"> '+ data[i]['parentNodeTxt'] +'</label>';
                    html += '<ul class="jtree_child_node">';

                    for(var j in data[i]['childNodes'])
                    {
                        if( data[i]['childNodes'].hasOwnProperty(j) )
                        {
                            html += '<li><label><input type="checkbox" id="'+ data[i]['childNodes'][j]['id'] +'" parent-id="'+ data[i]['parentNodeId'] +'" class="jtree_child_checkbox"> '+ data[i]['childNodes'][j]['name'] +' </label></li>';
                        }
                    }

                    html += '</ul>';
                    html += '</li></ul>';
                }
            }

            $(targetElement).html( html );
        }

		// Initial state
		if( attributes.initialState == 'close' )
		{
			$('.jtree_child_node').hide();
			$('.jtree_expand').removeClass('jtree_node_open').addClass('jtree_node_close');
		}
		else
		{
			$('.jtree_child_node').show();
			$('.jtree_expand').removeClass('jtree_node_close').addClass('jtree_node_open');
		}

		// Show / Hide parent nodes
		$(document).on('click', '.jtree_expand', function(){
			if( $(this).hasClass('jtree_node_open') )
			{
				$(this).removeClass('jtree_node_open').addClass('jtree_node_close');
				$(this).next().next('ul').hide();
			}
			else
			{
				$(this).removeClass('jtree_node_close').addClass('jtree_node_open');
				$(this).next().next('ul').show();
			}
		});

		// Check / Uncheck all child for parent state change
		$(document).on('change', '.jtree_parent_checkbox', function(){
			
			if( $(this).is(':checked') )
			{
				var childUL = $(this).parent().next('ul');
				$(childUL).each(function(){
					$(this).find('li > label').find('input[type="checkbox"]').prop('checked', true);
				});
			}
			else
			{
				var childUL = $(this).parent().next('ul');
				$(childUL).each(function(){
					$(this).find('li > label').find('input[type="checkbox"]').prop('checked', false);
				});	
			}

		});

    };

    // To get the Parent, Child : Checked, Unchecked nodes 
    $.fn.extend({
        getCheckedParentNodes: function() {
            return $(this).find('.jtree_parent_checkbox:checked');
        },
        getUncheckedParentNodes: function() {
            return $(this).find('.jtree_parent_checkbox:not(:checked)'); 
        },
        getCheckedChildNodes: function() {
            return $(this).find('.jtree_child_checkbox:checked');
        },
        getUncheckedChildNodes: function() {
            return $(this).find('.jtree_child_checkbox:not(:checked)');  
        }
    });

    // To refresh the tree
    $.fn.extend({
        refresh: function() {
            if( attributes.sourceType == 'html' )
            {
                if( attributes.url == null )
                {
                    alert('Error: missing ajax url');
                    return false;
                }

                $.ajax({
                    url : attributes.url,
                    method: 'get',
                    async: false,
                    data:
                    {
                        sourceType: attributes.sourceType
                    },
                    success: function(response)
                    {
                        $(targetElement).html(response);
                    }
                });
            }
            else
            {
                if( attributes.dataSource == null )
                {
                    alert('Error: Missing dataSource JSON object');
                    return false;
                }

                var data = attributes.dataSource;
                var html = '';

                for(var i in data)
                {
                    if( data.hasOwnProperty(i) )
                    {
                        html += '<ul class="jtree_parent_node"> <li> <span class="jtree_expand jtree_node_open"> </span> <label><input type="checkbox" id="'+ data[i]['parentNodeId'] +'" parent-id="" class="jtree_parent_checkbox">'+ data[i]['parentNodeTxt'] +'</label>';
                        html += '<ul class="jtree_child_node">';

                        for(var j in data[i]['childNodes'])
                        {
                            if( data[i]['childNodes'].hasOwnProperty(j) )
                            {
                                html += '<li><label><input type="checkbox" id="'+ data[i]['childNodes'][j]['id'] +'" parent-id="'+ data[i]['parentNodeId'] +'" class="jtree_child_checkbox"> '+ data[i]['childNodes'][j]['name'] +' </label></li>';
                            }
                        }

                        html += '</ul>';
                        html += '</li></ul>';
                    }
                }

                $(targetElement).html( html );
            }
        }
    });

}( jQuery ));