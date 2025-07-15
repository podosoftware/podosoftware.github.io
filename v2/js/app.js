$(document).ready(function () {
    function loadComponent(page) {
        $('#app').load(`/v2/public/html/${page}.html`, function (response, status, xhr) {
            if (status === "error") {
                $('#app').html("<p>페이지를 찾을 수 없습니다.</p>");
            }
        });
    }

    function loadCSS(href) {
        // 이미 로딩된 CSS는 중복 로딩 방지
        if (!$(`link[href="${href}"]`).length) {
            $('<link>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: href
            }).appendTo('head');
        }
    }

    function loadScript(src) {
        // 이미 로딩된 스크립트는 중복 방지
        if (!$(`script[src="${src}"]`).length) {
            $.getScript(src).fail(function () {
                console.warn('스크립트 로드 실패:', src);
            });
        }
    }

    function router() {
        const hash = location.hash.replace('#', '') || 'home';
        $('#menu a').removeClass('active');
        $(`#menu a[href="#${hash}"]`).addClass('active');

        console.log("router", hash);
        loadComponent(hash);
    }

    // 해시 변경 시 라우팅 실행
    $(window).on('hashchange', router);

    // 최초 로딩 시 실행
    router();
});