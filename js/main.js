const browserLanguage = navigator.language || navigator.userLanguage;
const language = browserLanguage.split("-")[0];

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
        document.querySelector(selector).style.display = visible ? "flex" : "none";
    }

    onReady(function () {
        setVisible(".wrapper", true);
        setVisible(".loader", false);
    });

    $(".view-img").hide();

    setLanguage(localStorage.getItem("langId") || language);

    $("button#btnChangeLang").click(function (e) {
        localStorage.setItem("langId", e.currentTarget.attributes.langid.value);
        setLanguage(localStorage.getItem("langId"));
    });

    function makeTimer() {
        var endTime = new Date("10 August 2024 00:00:00 GMT+07:00");
        endTime = Date.parse(endTime) / 1000;

        var now = new Date();
        now = Date.parse(now) / 1000;

        var timeLeft = 0;

        if (endTime > now) {
            timeLeft = endTime - now;
        } else {
            timeLeft = now - endTime;
        }

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
        }
    }

    setInterval(function () {
        makeTimer();
    }, 1000);

    GetImageURL();

    $("#download-invite").on("click", function () {
        html2canvas(document.getElementById("invite")).then(function (canvas) {
            var imgData = canvas.toDataURL("image/png");
            var link = document.createElement("a");
            link.href = imgData;
            link.download = `invite.png`;
            link.click();
        });
    });
});

var translate = function (jsdata) {
    $("[langKey]").each(function (index) {
        var strTr = jsdata[$(this).attr("langKey")];
        $(this).html(strTr);
        $(this).attr("placeholder", strTr);
    });
};

function setLanguage(langCode = null) {
    var jsonUrl = "./lang/" + (langCode ?? language) + ".json";
    $.ajax({
        url: jsonUrl,
        dataType: "json",
        async: false,
        success: translate,
    });
}

var dataImage = [];
var lstImage = [];

function GetImageURL() {
    for (let i = 0; i < 24; i++) {
        dataImage.push(`./img/gallery/img (${i + 1}).jpg`);
    }
    RenderImageGallery(dataImage);
}

function RenderImageGallery(data, pageIndex = 1) {
    const length = data.length;
    const itemInPage = 12;
    const totalPage = parseInt(Math.ceil(length / itemInPage));
    data = data.slice((pageIndex - 1) * itemInPage, itemInPage * pageIndex);
    $(".pagination").empty();
    if (pageIndex > 1) {
        $(".pagination").append(
            `<li class="pagination__item">
            <button class="pagination__index" page-target="${parseInt(pageIndex) - 1}"><i class="fa-solid fa-chevron-left"></i></button>
            </li>`
        );
    }
    for (let i = 0; i < totalPage; i++) {
        $(".pagination").append(
            `<li class="pagination__item ${i + 1 == pageIndex ? "active" : ""}">
                <button class="pagination__index" page-target="${i + 1}">${i + 1}</button>
            </li>`
        );
    }
    if (pageIndex < totalPage) {
        $(".pagination").append(
            `<li class="pagination__item">
            <button class="pagination__index" page-target="${parseInt(pageIndex) + 1}"><i class="fa-solid fa-chevron-right"></i></button>
            </li>`
        );
    }

    $(".pagination__index").on("click", function () {
        $(this)
            .parents(".pagination")
            .find("pagination__item")
            .each(function () {
                $(this).parent().removeClass("active");
            });
        const pageIndex = $(this).attr("page-target");
        RenderImageGallery(dataImage, pageIndex);
        $(this).parent().addClass("active");
        window.location.href = "#gallery";
    });

    $(".gallery__list").empty();
    lstImage = [];
    data.forEach((element) => {
        lstImage.push(element);
        $(".gallery__list").append(
            `<div class="col-xs-4 col-m-3 gallery__item">
                <img src="${element}" alt="${element.split("/")[element.split("/").length - 1].split(".")[0]}">
            </div>`
        );
        $("div.gallery__item").click(function (e) {
            $(".view-img").show();
            $(".view-img__img").attr("src", $(e.currentTarget).find("img")[0].currentSrc);
        });

        $(".view-img__wrap").click(function (e) {
            $(this).parent().hide();
        });
    });
}

$(document).on("click", "#prev", function () {
    var img = $(".view-img__img");
    var imgIndex = (lstImage.indexOf(img.attr("src")) - 1 + lstImage.length) % lstImage.length;
    img.attr("src", lstImage[imgIndex]);
});

$(document).on("click", "#next", function () {
    var img = $(".view-img__img");
    var imgIndex = (lstImage.indexOf(img.attr("src")) + 1) % lstImage.length;
    img.attr("src", lstImage[imgIndex]);
});

var btn = $("#button");

$(window).scroll(function () {
    if ($(window).scrollTop() > 60) {
        btn.addClass("show");
        btn.show();
    } else {
        btn.hide();
        btn.removeClass("show");
    }
});

btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
});

$("#download").on("click", function () {
    console.log(123);
    convertToImage();
});

function convertToImage() {}
