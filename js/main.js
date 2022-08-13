$(function () {
    $(".view-img").hide();
    var translate = function (jsdata) {
        $("[langKey]").each(function (index) {
            var strTr = jsdata[$(this).attr("langKey")];
            $(this).html(strTr);
            $(this).attr("placeholder", strTr);
        });
    };

    setLanguage(localStorage.getItem("langId") || "vi");
    function setLanguage(langCode) {
        var jsonUrl = "./lang/" + langCode + ".json";
        $.ajax({
            url: jsonUrl,
            dataType: "json",
            async: false,
            success: translate,
        });
    }

    $("button#btnChangeLang").click(function (e) {
        localStorage.setItem("langId", e.currentTarget.attributes.langid.value);
        setLanguage(localStorage.getItem("langId"));
    });

    $("div.gallery__item").click(function (e) {
        $(".view-img").show();
        $(".view-img__img").attr("src", $(e.currentTarget).find("img")[0].currentSrc);
    });

    $(".view-img").click(function (e) {
        $(e.currentTarget).hide();
    });

    function makeTimer() {
        var endTime = new Date("23 january 2023 00:00:00 GMT+07:00");
        endTime = Date.parse(endTime) / 1000;

        var now = new Date();
        now = Date.parse(now) / 1000;

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - days * 86400) / 3600);
        var minutes = Math.floor((timeLeft - days * 86400 - hours * 3600) / 60);
        var seconds = Math.floor(timeLeft - days * 86400 - hours * 3600 - minutes * 60);

        if (days < "10") {
            days = "0" + days;
        }
        if (hours < "10") {
            hours = "0" + hours;
        }
        if (minutes < "10") {
            minutes = "0" + minutes;
        }
        if (seconds < "10") {
            seconds = "0" + seconds;
        }

        $("#days").html(days);
        $("#hours").html(hours);
        $("#minutes").html(minutes);
        $("#seconds").html(seconds);
    }

    setInterval(function () {
        makeTimer();
    }, 1000);
});
