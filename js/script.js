
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;

    $greeting.text("So, you want to live at " + address + "?")

    var streetviewURL = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address + "";
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    var nyTimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest&api-key=89aa8212bc144528ad092b4d730b7ebc";
    $.getJSON(nyTimesURL, function(data) {
      $nytHeaderElem.text("New York Times Articles About " + cityStr);
      articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' + '<a href="'+ article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
      };

    }).error(function(e) {
      $nytHeaderElem.text("New York Times Elements Could Not Be Loaded");
    });

    var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";
    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.text("Failed To Get Wikipedia Resources");
    }, 8000);

    $.ajax({
      url: wikiURL,
      dataType: "jsonp",
      success: function(response) {
        var articleList = response[1];
        for (var i = 1; i < articleList.length; i++) {
          articleStr = articleList[i];
          var url = "http://en.wikipedia.org/wiki/" + articleStr;
          $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>')
        };
        clearTimeout(wikiRequestTimeout);
      }
    });

    return false;
};

$('#form-container').submit(loadData);
