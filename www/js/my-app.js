
// A stringify helper
// Need to replace any double quotes in the data with the HTML char
//  as it is being placed in the HTML attribute data-context
function stringifyHelper(context) {
  var str = JSON.stringify(context);
  return str.replace(/"/g, '&quot;');
}

// Finally, register the helpers with Template7
Template7.registerHelper('stringify', stringifyHelper);

// Initialize app
var myApp = new Framework7({
  material: false,
  template7Pages: true,
  precompileTemplates: true,
  swipePanel: 'left',
  swipePanelActiveArea: '30',
  swipeBackPage: true,
  animateNavBackIcon: true,
  pushState: !!Framework7.prototype.device.os
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var API_HOST = "https://build.phonegap.com";

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

$$(document).on('submit', '#login', login);

myApp.onPageInit('details', function(page) {
    $$(document).on('click', '#run', runApp);
    $$(document).on('click', '#install', installApp);
});

function runApp() {

}

function installApp() {
    
}

function login(e) {
    e.preventDefault();

    var authWindow = cordova.InAppBrowser.open(API_HOST + "/authorize?client_id=b3e5cfc36aa66587b24f", "_blank", "clearcache=yes");

    authWindow.addEventListener('loadstart', function(e) {
        var url = e.url;
        if (url.match(/^(https?:\/\/)phonegap\.com\/?\?(code|error)=[a-zA-Z0-9]*$/)) {
            console.log('url match')
            var qs = getQueryString(url);
            if (qs['code']) {
                authWindow.close();
                PhonegapBuildOauth.authorizeByCode(qs['code'], function(a) {
                    access_token = a.access_token;
                    window.localStorage.setItem('access_token', access_token);
                    getApps(a.access_token);
                }, function(a) {
                    console.log("Auth failure: " + a.message);
                    alert('login failed');
                });
            } else if (qs['error']) {
                authWindow.close();
                console.log("Auth failure: " + a.message);
                alert('authorization failed');
            }
        } else {
            console.log('url no match');
        }
    });

}

function getApps(access_token) {
    $$.ajax({
      dataType: "json",
      url: API_HOST + "/api/v1/apps?access_token=" + access_token,
      success: function(data) {
        saveApps(data.apps);
        renderApps(data.apps, access_token);
      }
    });
}

function saveApps(appArray) {
    window.localStorage.setItem('appArray', JSON.stringify(appArray));
}

function renderApps(appArray, token) {
    
    console.log(appArray);

    appArray.forEach(function(app, index, arr) {
        arr[index].icon_url = API_HOST + "/api/v1/apps/" + app.id + "/icon?access_token=" + token;
    })
    
    mainView.router.load({
        template: myApp.templates.results,
        context: {
          apps: appArray
        },
      });

}

function getQueryString(url) {
        var a = url.slice((url.indexOf('?') + 1)).split('&')
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}


