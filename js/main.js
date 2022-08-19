$(function () {
    function onReady(callback) {
        var intervalId = window.setInterval(function () {
            if (!document.getElementsByTagName("body")[0] !== undefined) {
                window.clearInterval(intervalId);
                callback.call(this);
            }
        }, 1000);
    }

    function setVisible(selector, visible) {
        document.querySelector(selector).style.display = visible ? "block" : "none";
    }

    onReady(function () {
        setVisible(".wrapper", true);
        setVisible(".loader", false);
    });

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

        if (days >= 0) {
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
            var daysArr = days.toString(10).replace(/\D/g, "0").split("").map(Number);
            $("#days").empty();
            daysArr.map((item, index) => {
                $("#days").append(`<div id="days-` + index + `">` + item + `</div>`);
            });
            var hoursArr = hours.toString(10).replace(/\D/g, "0").split("").map(Number);
            $("#hours").empty();
            hoursArr.map((item, index) => {
                $("#hours").append(`<div id="hours-` + index + `">` + item + `</div>`);
            });
            var minutesArr = minutes.toString(10).replace(/\D/g, "0").split("").map(Number);
            $("#minutes").empty();
            minutesArr.map((item, index) => {
                $("#minutes").append(`<div id="minutes-` + index + `">` + item + `</div>`);
            });
            var secondsArr = seconds.toString(10).replace(/\D/g, "0").split("").map(Number);
            $("#seconds").empty();
            secondsArr.map((item, index) => {
                $("#seconds").append(`<div id="seconds-` + index + `">` + item + `</div>`);
            });
            // $("#seconds").html(secondChild);
            console.log(days, hours, minutes, seconds);
            // console.log(daysArr, hoursArr, minutesArr, secondsArr);
        }
        // $("#days").html(days);
        // $("#hours").html(hours);
        // $("#minutes").html(minutes);
        // $("#seconds").html(seconds);
    }

    setInterval(function () {
        makeTimer();
    }, 1000);
});

function GetImageURL() {
    var fileType = "img";
    var dir = "./img";
    var fileextension = ".jpg";
    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: dir,
        success: function (data) {
            //List all .png file names in the page
            $(data)
                .find("a:contains(" + fileextension + ")")
                .each(function () {
                    var filename = this.href
                        .replace(window.location.host, "")
                        .replace("http://", "")
                        .replace("/img/", "");
                    if (filename.localeCompare(fileType) === 1) {
                        $(".gallery__list").append(
                            `
                        <div class="col-xs-6 col-m-4 gallery__item">
                            <img src="./img/` +
                                filename +
                                `" alt="` +
                                filename +
                                `">
                        </div>
                    `
                        );
                    }
                });
        },
    });
}
