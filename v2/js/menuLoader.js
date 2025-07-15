/*
* 헤더 메뉴 로드
* */
$(document).ready(function () {
    $.getJSON('../../js/json/menu.json', function (data) {
        const $menu = $('#menu');
        buildMenu(data, $menu);
        bindAccordionToggle();
    });

    function buildMenu(menuItems, $container) {
        menuItems.forEach(item => {
            const $li = $('<li>');
            const $wrapDiv = $('<div class="depthOne-title active">');

            const $a = $('<a href="javascript:void(0);" class="tab">').text(item.title);
            const $allCtl = $(`
              <button type="button" class="btn-allToggle">
                <svg class="svg-icon">
                  <use href="#expand-up-down-line"></use>
                </svg>
                <span class="blind">전체 열고 닫기</span>
              </button>
            `);
            $wrapDiv.append($a).append($allCtl);
            $li.append($wrapDiv);

            if (item.children && item.children.length > 0) {
                const $subOl = $('<ol class="depthOne open">');
                item.children.forEach(child => {
                    appendMenuItem(child, $subOl);
                });

                // 자식들 중 depthTwo이 있는 경우에만 folder-opcl 클래스 부여
                const hasNestedFolder = $subOl.find('.depthTwo').length > 0;
                if (hasNestedFolder) {
                    $li.addClass('folder-opcl');
                }
                $li.append($subOl);
            }

            $container.append($li);

            // 👇 버튼 이벤트: depthTwo 열고 닫기
            $allCtl.on('click', function () {
                const $depthTwos = $li.find('.depthTwo');

                if ($depthTwos.length > 0) {
                    const isOpen = $depthTwos.parent().find(".depthTwo").hasClass('open');

                    // 열고/닫기 toggle
                    $depthTwos.toggleClass('open', !isOpen);

                    // 버튼 상태 toggle
                    $(this).toggleClass('active', !isOpen);

                    // 아이콘 변경
                    const $iconUse = $(this).find('use');
                    if (!isOpen) {
                        $iconUse.attr('href', '#contract-up-down-line');
                    } else {
                        $iconUse.attr('href', '#expand-up-down-line');
                    }
                } else {
                    // depthTwo가 없는 경우: 아이콘만 토글
                    const $iconUse = $(this).find('use');
                    const isContracted = $iconUse.attr('href') === '#contract-up-down-line';

                    if (isContracted) {
                        $iconUse.attr('href', '#expand-up-down-line');
                        $(this).removeClass('active');
                    } else {
                        $iconUse.attr('href', '#contract-up-down-line');
                        $(this).addClass('active');
                    }
                }


            });
        });
    }

    function appendMenuItem(item, $parentOl) {
        const $li = $('<li>');
        const hasChildren = item.children && item.children.length > 0;

        const iconType = hasChildren ? 'folder-line' : 'article-line';
        const $icon = $(
            `<svg class="svg-icon"><use href="#${iconType}"></use></svg>`
        );

        let $a;
        if (hasChildren) {
            $a = $('<a href="javascript:void(0);" class="tab">').append($icon).append(item.title);
            const $subOl = $('<ol class="depthTwo">');
            item.children.forEach(child => {
                appendMenuItem(child, $subOl);
            });

            // 자식 중에 folder-opcl 되는 게 있는 경우만 이 li에 folder-opcl 붙이기
            const hasNestedFolder = $subOl.find('li.folder-opcl').length > 0;
            if (hasNestedFolder) {
            }
                $li.addClass('folder-opcl');

            $li.append($a).append($subOl);
        } else {
            const link = item.link || 'javascript:void(0);';
            $a = $('<a>').attr('href', link).append($icon).append(item.title);
            if (item.hash) {
                $a.attr('data-hash', item.hash);
            }
            $li.append($a);
        }

        $parentOl.append($li);
    }

    function bindAccordionToggle() {
        $('#menu').on('click', '.folder-opcl > a', function (e) {
            e.preventDefault();
            const $parentLi = $(this).closest('li.folder-opcl');
            $parentLi.toggleClass('open');
        });

        $('#menu > li > a').on('click', function (e) {
            e.preventDefault();
            const $parentLi = $(this) .next();
            $parentLi.toggleClass('open');
        });
    }

    $(document).on('click', '.depthOne-title > a', function (e) {
        e.preventDefault(); // a 태그 이동 방지 (필요 시)

        const $li = $(this).closest('li'); // 현재 메뉴 li 기준
        const $depthOne = $li.find('.depthOne');
        const $title = $(this).parent();

        $depthOne.toggleClass('open');
        $title.toggleClass('active');
    });
});

