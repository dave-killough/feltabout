$(function() {
    // ajax is
    //signed_in = true; 
    //$('#signin').css('display','block'); 
    hashchange_counter = 0;
    $(window).on('hashchange', function(){
        render(decodeURI(window.location.hash));
    });
    $(window).trigger('hashchange');
    $('#login-button').click(function(){
        window.location.hash = "login"
    });
    $('#signup-button').click(function(){
        window.location.hash = "signup"
    });  
        function render(url) {
        var base = url.split('/')[0];
        // make sure user is loggged in - security
        if (base == '') renderFrontPage(url);
        else if (base == '#login') renderLoginPage(url);
        else if (base == '#signup') renderSignupPage(url);
        //else if (base == '#expressions') renderExpressionsPage(url);
        //else if (base == '#expression') renderExpressionPage(url);
        //else if (base == '#connections') renderConnectionsPage(url);
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