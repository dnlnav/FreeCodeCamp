var Timer = function() {
    var workT = 0;
    var breakT = 0;
    var longBreakT = 0;
    var repeat = 0;
    var timeLeft = 0;
    var stage = "";
    var cycle = 0;
    var paused = true;
    var decTime = function() {
        if (!paused) {
            timeLeft--;
            if (timeLeft < 0) {
                switch (stage) {
                    case "w":
                        if (cycle === 3) {
                            timeLeft = longBreakT;
                            stage = "lb";
                        } else {
                            timeLeft = breakT;
                            stage = "b";
                        }
                        break;
                    case "b":
                        timeLeft = workT;
                        stage = "w";
                        cycle++;
                        break;
                    case "lb":
                        repeat--;
                        if (repeat > 0) {
                            timeLeft = workT;
                            stage = "w";
                            cycle = 0;
                        } else {
                            timeLeft = 0;
                            stage = "f";
                            paused = true;
                        }
                        break;
                    default:
                        stage = "r";
                }
            }
        }
    };

    this.setTime = function(w, b, lb, r) {
        workT = Math.round(w * 60);
        breakT = Math.round(b * 60);
        longBreakT = Math.round(lb * 60);
        repeat = Math.round(r);
        timeLeft = workT;
        stage = "w";
    };

    this.getTime = function() {
        var hourLeft = Math.floor(timeLeft / 3600).toString();
        var minLeft = Math.floor((timeLeft / 60) % 60).toString();
        var secLeft = (timeLeft % 60).toString();
        minLeft = minLeft.length == 1 ? "0" + minLeft : minLeft;
        secLeft = secLeft.length == 1 ? "0" + secLeft : secLeft;
        var st = stage;
        decTime();
        return [hourLeft, minLeft, secLeft, st, timeLeft];
    };

    this.resetTime = function() {
        stage = "r";
        timeLeft = 0;
        paused = true;
    };
    this.pause = function() {
        paused = true;
    };
    this.resume = function() {
        paused = false;
    };
    this.getPaused = function() {
        return paused;
    };
};

////////////////// JQUERY ////////////////////////
$(function() {
    prepareBG();
    var color = {
        w: "#0f0",
        b: "#00f",
        lb: "#f00",
        f: "#fff",
        r: "#808080"
    };
    var timer = new Timer();
    $(".container").fadeIn(500);
    $("#crcl-cnt").fadeTo(1500, 1);
    $("#srt-btn").click(function() {
        if (!timer.getPaused()) {
            timer.pause();
            $("#srt-btn i").attr("class", " fa fa-play");
        } else {
            $("#srt-btn i").attr("class", " fa fa-pause");
            if (timer.getTime()[4] !== 0) {
                timer.resume();
            } else {
                $("div[id$='-ctrl'], #completed").fadeTo(1000, 0);
                timer.resume();
                runTimer();
            }
        }
    });

    $("#rst-btn").click(function() {
        timer.resetTime();
    });

    $(".pls-ctrl").click(addNum);
    $(".min-ctrl").click(minNum);

    function addNum() {
        let $numEl = $(this)
            .parents(".pagination")
            .find('span[id$="-num"]');
        let num = parseInt($numEl.text());
        num = num >= 999 ? 999 : num + 1;
        $numEl.text(num);
    }

    function minNum() {
        let $numEl = $(this)
            .parents(".pagination")
            .find('span[id$="-num"]');
        let num = parseInt($numEl.text());
        num = num <= 1 ? 1 : num - 1;
        $numEl.text(num);
    }

    function runTimer() {
        var wT = parseInt($("#w-num").text());
        var bT = parseInt($("#b-num").text());
        var lbT = parseInt($("#lb-num").text());
        var r = parseInt($("#r-num").text());
        var prevSt = "";
        timer.setTime(wT, bT, lbT, r);
        var int = setInterval(function() {
            var time = timer.getTime();

            if (time[3] === "f" || time[3] === "r") {
                if (time[3] === "r") {
                    animBG("", 2, false);
                    chgColor(0.5, color["r"]);
                } else {
                    $("#completed").fadeTo(1000, 1);
                }
                clearInterval(int);
                $("div[id$='-ctrl']").fadeTo(1000, 1);
                $("#srt-btn i").attr("class", " fa fa-play");
            }

            if (prevSt !== time[3]) {
                chgColor(3, color[time[3]]);
                animBG(time[3], 10, true);
                $("audio")
                    .prop("volume", 0.25)
                    .trigger("play");
            }

            prevSt = time[3];

            if (time[0] > 0) {
                var hour = $("<span></span>").text(time[0]);
                $("#hour-left")
                    .text(time[0] + ":")
                    .show();
            } else {
                $("#hour-left").hide();
            }
            $("#min-left").text(time[1]);
            $("#sec-left").text(time[2]);
            if (time[4] === 10) {
                animBG("", 10, false);
            }

        }, 1000);
    }

    function chgColor(dur, color) {
        $("#crcl-cnt").velocity({
                borderColor: color,
                backgroundColor: color,
                backgroundColorAlpha: 0.3
            },
            dur * 1000,
            "ease-out"
        );
    }

    function prepareBG(time) {
        for (var i = 0; i < $("path").length; i++) {
            var path = $("path")[i];
            var length = path.getTotalLength();
            path.style.transition = path.style.WebkitTransition = "none";
            path.style.strokeDasharray = length + " " + length;
            path.style.strokeDashoffset = length;
        }
    }

    function animBG(el, dur, start) {
        var slc = el ? "#" + el + "-ico path" : "path";

        console.log(el, dur, start, slc);
        for (var i = 0; i < $(slc).length; i++) {
            var path = $(slc)[i];
            var length = path.getTotalLength();
            if (start) path.style.stroke = color[el];
            path.style.transition = path.style.WebkitTransition = "none";
            path.getBoundingClientRect();

            path.style.transition = path.style.WebkitTransition =
                "stroke-dashoffset " + dur + "s ease-in-out";
            // Go!
            if (start) path.style.strokeDashoffset = "0";
            else path.style.strokeDashoffset = length;
        }
    }
});