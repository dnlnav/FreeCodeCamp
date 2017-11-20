$(function() {
  var time = 500;
  var ready = false;
  var started = false;
  var sqObj = new sequence();
  var toA, toH;
  var txtClr = "#0f0f0f";
  var btnSound = function(src) {
    this.src = src;
    this.html5 = true;
    this.rate = 0.75;
    this.onfade = function() {
      this.stop();
    };
  };
  var btnSounds = [
    new Howl(
      new btnSound("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3")
    ),
    new Howl(
      new btnSound("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")
    ),
    new Howl(
      new btnSound("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3")
    ),
    new Howl(
      new btnSound("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    )
  ];

  var effectSounds = [
    new Howl({
      src: "http://freesound.org/data/previews/341/341732_5155959-lq.mp3",
      html5: true
    }),
    new Howl({
      src: "https://freesound.org/data/previews/171/171671_2437358-lq.mp3",
      html5: true
    })
  ];
  

  setTimeout(function(){
   playSeq(false);
  },1000);
  setTimeout(function(){
    $('.brd__strt__txt, .chg-mode').fadeIn();
  },5000);

  $(".brd__strt").click(function() {
    sqObj.clrSeq();
    if (started) {
      sqObj.clrSeq();
      started = false;
      ready = false;
      $(".chg-mode").fadeIn();
      clearTimeout(toA);
      clearTimeout(toH);
      animTxtChg("Start", txtClr);
    } else {
      started = true;
      sqObj.clrSeq();
      $(".chg-mode").fadeOut();
      animTxtChg("0", txtClr);
      setTimeout(function() {
        playSeq(true);
      }, time);
    }
  });

  $(".brd__strt").hover(
    function() {
      if (started) {
        toH = setTimeout(animTxtChg, 300, "Stop", txtClr);
      }
    },
    function() {
      clearTimeout(toH);
      if ($(".brd__strt__txt").text() === "Stop")
        animTxtChg(sqObj.getScore(), txtClr);
    }
  );

  $(".brd__btn").click(function() {
    if (ready) {
      let num = $(this).attr("value");
      let cmprd = sqObj.cmprSeq(num);
      if (cmprd === "won") {
        winner();
      } else if (cmprd === "done") {
        updScore();
        setTimeout(function() {
          playSeq(true);
        }, 2 * time);
      } else if (cmprd === "wrong") {
        effectSounds[0].play();
        animTxtChg("X", "red");
        setTimeout(() => animTxtChg(sqObj.getScore(), txtClr), 800);
        ready = false;
        setTimeout(function() {
          playSeq(false);
        }, 4 * time);
      }
    }
  });

  $(".brd__btn").mousedown(function() {
    if (ready) {
      $(this).addClass("active");
      playSound($(this).attr("value"));
    }
  });

  $(window).mouseup(function() {
    if (ready) {
      $(".brd__btn.active").removeClass("active");
      stopSound();
    }
  });

  $(".chg-mode").click(function() {
    $("body, .chg-mode, .brd__strt, .brd__btn").toggleClass("strict");
    if (txtClr === "#0f0f0f") {
      txtClr = "#f0f0f0";
      $(".brd__strt__txt").css("color", "#f0f0f0");
      $(".chg-mode").text("Normal Mode");
      sqObj.setMode(true);
    } else {
      txtClr = "#0f0f0f";
      $(".brd__strt__txt").css("color", "#0f0f0f");
      $(".chg-mode").text("Strict Mode");
      sqObj.setMode(false);
    }
  });

  function playSeq(right) {
    ready = false;
    var seq = right ? sqObj.addtoSeq() : sqObj.getSeq();
    for (let i = 0; i < seq.length; i++) {
      toA = setTimeout(function() {
        $(".brd__btn--" + seq[i]).addClass("active");
        playSound(seq[i]);
        setTimeout(function() {
          $(".brd__btn--" + seq[i]).removeClass("active");
          stopSound();
          if (i == seq.length - 1) ready = true;
        }, time);
      }, 2 * time * i);
    }
  }

  function playSound(num) {
    $(".brd__btn--" + num).addClass("playing");
    btnSounds[num - 1]
      .seek(0.1)
      .volume(1)
      .play();
  }

  function stopSound() {
    let num = $(".playing").attr("value") || 1;
    btnSounds[num - 1].fade(1, 0, 200);
    $(".brd__btn.playing").removeClass("playing");
  }

  function updScore() {
    $btn = $(".brd__strt__txt");
    let idx = sqObj.getScore();
    $(".brd__strt").addClass("active");
    $btn.text(idx);
    setTimeout(function() {
      $(".brd__strt").removeClass("active");
    }, 100);
  }

  function animTxtChg(txt, clr) {
    $(".brd__strt__txt").fadeTo(200, 0, function() {
      $(this)
        .text(txt)
        .css("color", clr)
        .fadeTo(200, 1);
    });
  }

  function winner() {
    animTxtChg("You Win!", "black");
    effectSounds[1].play();
  }
});

function sequence() {
  var seq = [1,2,3,4];
  var index = 0;
  var score = 0;
  var goal = 5;
  var isStrict = false;

  this.setMode = function(strict) {
    isStrict = strict;
  };

  this.addtoSeq = function() {
    var num = Math.floor(Math.random() * 4 + 1);
    seq.push(num);
    return seq;
  };

  this.getSeq = function() {
    return seq;
  };

  this.clrSeq = function() {
    seq = [];
    index = 0;
    score = 0;
  };

  this.cmprSeq = function(num) {
    let state = "";
    if (num == seq[index]) {
      if (index == seq.length - 1) {
        score++;
        if (score === goal) {
          state = "won";
        } else {
          state = "done";
          index = 0;
        }
      } else {
        state = "right";
        index++;
      }
    } else {
      if (isStrict) {
        state = "wrong";
        this.clrSeq();
        this.addtoSeq();
      } else {
        state = "wrong";
        index = 0;
      }
    }
    return state;
  };
  this.getScore = function() {
    return score;
  };
}
