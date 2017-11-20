$(document).ready(function() {
    changeColor();
    getAPI();
    $("button").click(function() {
        changeColor();
        getAPI();
    });
});

function getAPI() {
    $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?", function(data) {
        document.getElementById("quote").innerHTML = '"' + data.quoteText + '"';
        document.getElementById("author").innerHTML = data.quoteAuthor;
        qText = '';
        if (data.quoteText.length + data.quoteAuthor.length > 122)
            qText = data.quoteText.substring(0, 119 - data.quoteAuthor.length) + '...';
        else
            qText = data.quoteText;
        var quote = 'https://twitter.com/intent/tweet?text="' + qText + '" -' + data.quoteAuthor + ' via bit.ly/1WOPl7a'
        $(".twitter-share-button").attr("href", quote);
    });
}

function changeColor() {
    var color = '#';
    var colors = ['FAD089', 'FF9C5B', 'F5634A', 'ED303C', '3B8183'];
    color += colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = color;
    document.getElementById("quote").style.color = color;
    document.getElementsByClassName("btn-default")[0].style.background = color;
    document.getElementsByClassName("btn-default")[1].style.background = color;
}