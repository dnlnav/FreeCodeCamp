var app = angular.module("myApp", []);

app.controller("customersCtrl", function($scope) {
    $(function() {
        var mobile = $(window).width() < 576;
        var pos = ($(window).outerHeight() - $("#wiki-row").outerHeight()) / 2;
        if (!mobile) $("#wiki-row").css("margin-top", pos);
        else $("#random-btn").insertAfter($('.search'));
        $('#wiki-row').fadeIn(700);
        $("#search-btn").click(function() {
            if ($(".search input").val() == "") {
                mobile
                    ?
                    $(".search-bar").show() :
                    $(".search-bar").toggle("slide", { direction: "right" });
                $("#search-btn").toggleClass("btn-mod", 1000);
            } else {
                getResult($(".search input").val());
            }
        });
        $(".search input").keydown(function(e) {
            if (e.keyCode === 13) {
                getResult($(this).val());
            }
        });
    });

    function getResult(request) {
        var limit = 7;
        $.ajax({
            method: "GET",
            url: "https://en.wikipedia.org/w/api.php",
            dataType: "json",
            data: {
                action: "opensearch",
                origin: "*",
                format: "json",
                search: request,
                limit: limit
            },
            success: function(response) {
                var newRes = [];
                for (i = 0; i < limit; i++) {
                    var obj = {};
                    obj.name = response[1][i];
                    obj.desc = response[2][i];
                    obj.link = response[3][i];
                    newRes[i] = obj;
                }
                $scope.$apply($scope.articles = newRes);
                animateBar();
            }
        });
    }

    function animateBar() {
        $("#wiki-row").animate({
                marginTop: "30px"
            },
            500
        );
        $("#results")
            .delay(500)
            .slideDown(500);
    }
});