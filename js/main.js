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

    function makeTimer() {
        var endTime = new Date("10 August 2024 00:00:00 GMT+07:00");
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
        }
    }

    setInterval(function () {
        makeTimer();
    }, 1000);

    GetImageURL();

    $("#download-invite").on("click", function () {
        const toImgArea = document.getElementById("img-fill");

        // transform to canvas
        html2canvas(toImgArea, {
            type: "view",
        }).then(function (canvas) {
            var a = document.createElement("a");
            // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = "somefilename.jpg";
            a.click();
        });
    });
});

var dataImage;
var lstImage = [];

function GetImageURL() {
    var dir = "./img/gallery";
    var fileExtension = ".jpg";
    $.ajax({
        url: dir,
        success: function (data) {
            dataImage = $(data).find("a:contains(" + fileExtension + ")");
            RenderImageGallery(dataImage);
        },
    });
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
    data.each(function () {
        lstImage.push(this.href);
        $(".gallery__list").append(
            `<div class="col-xs-6 col-m-4 gallery__item">
                <img src="${this.href}" alt="${this.href.split("/")[this.href.split("/").length - 1].split(".")[0]}">
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
