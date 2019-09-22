$(function() {
    var user = "";  // session user
    $(window).on('hashchange', function(){
        render(decodeURI(window.location.hash));
    });
    $(window).trigger('hashchange');
    $('#front-login-button').click(function(){
        window.location.hash = "login";
    });
    $('#front-signup-button').click(function(){
        window.location.hash = "signup";
    });  
    $('#signup-submit-button').click(function(e){
        $error = $("#signup-error-message");
        $error.text("");
        $error.css("background-color","white");
        data = $('#signup-form').serialize();
        signup_user = $('#signup-user').val();
        $.ajax({
            url: "/signup",
            method: 'POST',
            data: data,
            success: function(d) {
                if (d.status !== 0) {
                    // operation failed 
                    $error.text(d.message);
                    $error.css("background-color","coral");
                }
                else {
                    user = signup_user;
                    window.location.hash = "connections";
                }
            },
            error: function(e) {
                $error.text(e.message);
                $error.css("background-color","coral");
            }
        });
        e.preventDefault(); // Don't forget to stop the form from being submitted the "normal" way.
    }); 
    $('#login-submit-button').click(function(e){
        $error = $("#login-error-message");
        $error.text("");
        $error.css("background-color","white");
        data = $('#login-form').serialize();
        user = $('#login-user').val();
        $.ajax({
            url: "/login",
            method: 'POST',
            data: data,
            success: function(d) {
                if (d.status !== 0) {
                    // operation failed 
                    $error.text(d.message);
                    $error.css("background-color","coral");
                }
                else {
                    window.location.hash = "connections";
                }
            },
            error: function(e) {
                $error.text(e.message);
                $error.css("background-color","coral");
            }
        });
        e.preventDefault(); // Don't forget to stop the form from being submitted the "normal" way.
    }); 
    function render(url) {
        var base = url.split('/')[0];
        // make sure user is loggged in - security
        if (base == '') renderFrontPage(url);
        else if (base == '#login') renderLoginPage(url);
        else if (base == '#signup') renderSignupPage(url);
        else if (base == '#connections') renderConnectionsPage(url);
        //else if (base == '#expressions') renderExpressionsPage(url);
        //else if (base == '#expression') renderExpressionPage(url);
        //else if (base == '#connection') renderConnectionPage(url);
        else renderErrorPage(url);
    }
    function renderFrontPage(url) {
        $('.page').css('display','none')
        var page = $('#front');
        var that = $(this);
        page.css('display','block')
    }  
    function renderLoginPage(url) {
        $('.page').css('display','none')
        var page = $('#login');
        var that = $(this);
        page.css('display','block')
        $("#user").focus();
        // if user already has a value then 
        // go to password
    }
    function renderSignupPage(url) {
        $('.page').css('display','none')
        var page = $('#signup');
        var that = $(this);
        page.css('display','block')
    }  
    function renderConnectionsPage(url) {
        $('.page').css('display','none');
        var page = $('#connections');
        var that = $(this);
        page.css('display','block');
        $.ajax({
            url: "/connections",
            method: 'GET',
            success: function(d) {
                if (d.status !== 0) { // operation failed 
                    $error.text(d.message);
                    $error.css("background-color","coral");
                }
                else {
                    $("#connections-table tr").remove();
                    $("#connections-table tbody").remove();
                    $('#connections-table').append(`
<tr id="connections-header" class="connections-row">
    <th class="connections-return">
    </th>
    <td class="connections-header-name">
    </td>
    <td class="connections-header-menu">
        <i class="fas fa-bars"></i>
    </td>
</tr>                    
                    `);  
                    rows = d.result.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i]; 
                        $('#connections-table').append(`
<tr class="connections-row">
    <td class="connections-picture">
        <img class="connections-image" 
             src="/images/puppy.jpg">
    </td>
    <td class="connections-name">
      ` + row["connection_name"] + `
    </td>
    <td class="connections-menu">
        <i class="fas fa-bars"></i>
    </td>
</tr>
                        `);
                    }
                }
            },
            error: function(e) {
                $error.text(e.message);
                $error.css("background-color","coral");
            }
        });        
    }      
    function r2(url) {
        //$('.main-content .page').removeClass('visible');  // Hide whatever page is currently shown.
        var map = {
        '': function() { // The "Homepage".
            // Clear the filters object, uncheck all checkboxes, show all the products
            //filters = {};
            //checkboxes.prop('checked',false);
            renderLoginPage();
        },
        '#product': function() { // Single Products page.
            // Get the index of which product we want to show and call the appropriate function.
            var index = url.split('#product/')[1].trim();
            renderSingleProductPage(index, products);
        },
        '#filter': function() {  // Page with filtered products
            // Grab the string after the '#filter/' keyword. Call the filtering function.
            url = url.split('#filter/')[1].trim();
            // Try and parse the filters object from the query string.
            try {
            filters = JSON.parse(url);
            }
            // If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
            catch(err) {
            window.location.hash = '#';
            return;
            }
            //renderFilterResults(filters, products);
        }
        };
        // Execute the needed function depending on the url keyword (stored in temp).
        if(map[temp]){
        map[temp]();
        }
        // If the keyword isn't listed in the above - render the error page.
        else {
        alert('error'); // renderErrorPage();
        }
    }
    });