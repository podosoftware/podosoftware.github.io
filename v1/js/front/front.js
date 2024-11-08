$(function () {
    // Menu Gnb
    frontGnb();

    // 아코디언
    $(".accordion-wrap").accordion();
});




function frontGnb() {
    //Header
    $('.header-menu-wrap').on('mouseover', function () {
        $('.header').stop().animate({ 'height': '412px' });
        $('.header').addClass('active');
        // $(this).children('a').addClass('active');
    });

    $('.header-menu-wrap').on('mouseout', function () {
        $('.header').stop().animate({ 'height': '140px' });
        $('.header').removeClass('active');
        // $(this).children('a').removeClass('active');
    });

    // 부서장 메뉴
    $(".master-menu").hide();
    $(".header-top .master").on('mouseover', function () {
        $('.master-menu').stop().slideDown();
    });

    $('.header-top .master').on('mouseout', function () {
        $('.master-menu').stop().slideUp();
    });

    //부서장메뉴_renewal width 가변
    var totalWidth2 = 200;
    var partWidth2 = $('.master .master-menu .part');

    partWidth2.each(function () {
        totalWidth2 = totalWidth2 + partWidth2.width() + 20;
    });

    //ie인지 아닌지
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("msie") != -1 || agent.indexOf("trident") != -1) {
        $('.master .master-menu').innerWidth(totalWidth2-240);
    } else {
        $('.master .master-menu').width(totalWidth2-220);
    }

    // 모바일 메뉴
    $(".mobile-menu-wrap .tab").on("click", function () {
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this).next().slideUp();
        } else {
            $(".mobile-menu-wrap .tab").removeClass("active");
            $(".mobile-menu-wrap ol").slideUp();

            $(this).addClass("active");
            $(this).next().slideDown();
        }
    });

    // guid menu
    // $("body").on("click", ".left-header-menu-wrap .tab", function () {
    //     if($(this).hasClass("active")) {
    //         $(this).removeClass("active");
    //         $(this).next().slideUp();
    //     } else {
    //         $(".mobile-menu-wrap .tab").removeClass("active");
    //         $(".mobile-menu-wrap ol").slideUp();
    //
    //         $(this).addClass("active");
    //         $(this).next().slideDown();
    //     }
    // });
    //
    // $(".left-header-menu-wrap .tab").on("click", function () {
    //     if($(this).hasClass("active")) {
    //         $(this).removeClass("active");
    //         $(this).next().slideUp();
    //     } else {
    //         $(".mobile-menu-wrap .tab").removeClass("active");
    //         $(".mobile-menu-wrap ol").slideUp();
    //
    //         $(this).addClass("active");
    //         $(this).next().slideDown();
    //     }
    // });
}

// mobile close
function mobileGnbClose() {
    $(".mobile-menu-wrap").stop().animate({"right": "-100%"});
}

// mobile open
function mobileGnbOpen() {
    $(".mobile-menu-wrap").stop().animate({"right": "0"});
}

$.fn.accordion = function () {
    var obj = $(this);

    obj.find(".accordion-head").on("click", function () {
        $(this).next().slideToggle(500);
        $(this).toggleClass("active");
    });
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

//create chart custom 둥근 모서리
function createColumn(rect, color) {
    var origin = rect.origin;
    var center = rect.center();

    var x = rect.origin.x;
    var y = rect.origin.y;
    var bottomRight = rect.bottomRight();
    var radiusX = rect.width() / 2;
    var radiusY = radiusX / 1;
    var group = new kendo.drawing.Group();

    var path = new kendo.drawing.Path({
        fill: {
            color: color
        },
        stroke: {
            color: color
        }
    }).moveTo(origin.x, origin.y)
        .lineTo(origin.x, bottomRight.y)
        .arc(180, 0, radiusX, radiusY, true)
        .lineTo(bottomRight.x, origin.y)
        .arc(0, 180, radiusX, radiusY, true)
        .close();

    var topArcGeometry = new kendo.geometry.Arc([center.x, origin.y], {
        // startAngle: 0,
        // endAngle: 360,
        // radiusX: radiusX,
        // radiusY: radiusY
    });

    group.append(path);
    return group;
}

function createColumnBar(rect, color) {
    var origin = rect.origin;
    var center = rect.center();

    var x = rect.origin.x;
    var y = rect.origin.y;
    // var bottomRight = rect.bottomRight();
    // var radiusX = rect.width() / 2;
    // var radiusY = radiusX / 1;
    var group = new kendo.drawing.Group();
    var bottomRight = rect.bottomRight();
    var bottomLeft = rect.bottomLeft();
    var radiusY = rect.height() / 2;
    var radiusX = radiusY / 1;
    var radiusX2 = rect.width() / 2;
    var radiusY2 = radiusX2 / 1;
    var arcPoint = bottomRight;
    arcPoint.y = arcPoint.y - rect.size.height / 2;
    // var arcOrigin = bottomLeft;
    // arcOrigin.y = arcPoint.y;
    var offset = radiusX + radiusX/2;

    var path = new kendo.drawing.Path({
        fill: {
            color: color
        },
        stroke: {
            color: color
        }
    }).moveTo(bottomLeft.x, bottomLeft.y)
        .lineTo(bottomRight.x, bottomLeft.y)
        .arc(90, 270, radiusX, radiusY, true)
        .lineTo(bottomLeft.x, bottomLeft.y - rect.size.height)
        .arc(0, 0, radiusX2, radiusY2, false)
        .close();

    var topArcGeometry = new kendo.geometry.Arc([center.x, origin.y], {
        // startAngle: 0,
        // endAngle: 360,
        // radiusX: radiusX,
        // radiusY: radiusY
    });

    group.append(path);
    return group;
}

//create chart 3dbar custom
function createBullet(rect, color) {
    var draw = kendo.drawing;
    var geom = kendo.geometry;

    var origin = rect.origin;
    var center = rect.center();

    var x = rect.origin.x;
    var y = rect.origin.y;
    var bottomRight = rect.bottomRight();
    var radiusX = rect.width() / 2;
    var radiusY = radiusX / 1;
    var group = new kendo.drawing.Group();

    var path = new kendo.drawing.Path({
        fill: {
            color: color
        },
        stroke: {
            color: color
        }
    }).moveTo(origin.x, origin.y)
        .lineTo(origin.x, bottomRight.y)
        .arc(180, 0, radiusX, radiusY, true)
        .lineTo(bottomRight.x, origin.y)
        .arc(0, 180, radiusX, radiusY, true)
        .close();

    var topArcGeometry = new kendo.geometry.Arc([center.x, origin.y], {
        // startAngle: 0,
        // endAngle: 360,
        // radiusX: radiusX,
        // radiusY: radiusY
    });

    group.append(path);
    return group;
}

// 모바일 top info btn
function mobileInfoToggle(obj) {
    $(obj).next().toggle();
}

// 모바일 유무
function Mobile(){

    var mobCk = "";

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}