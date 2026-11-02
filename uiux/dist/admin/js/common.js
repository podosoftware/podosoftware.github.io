/**
 * SNB
 *  **/
function updateButtons() {
    let items = $('.item');
    items.find('._btnMenuUp, ._btnMenuDown').removeClass('disabled');
    items.first().find('._btnMenuUp').addClass('disabled');
    items.last().find('._btnMenuDown').addClass('disabled');
}

// Move up
$('._btnMenuUp').on('click', function () {
    if ($(this).hasClass("disabled")) return;
    let parent = $(this).closest('.item');
    parent.prev().before(parent);
    updateButtons();
});

// Move down
$('._btnMenuDown').on('click', function () {
    if ($(this).hasClass("disabled")) return;
    let parent = $(this).closest('.item');
    parent.next().after(parent);
    updateButtons();
});

// Remove
$('._btnMenuRemove').on('click', function () {
    $(this).closest('.item').remove();
    updateButtons();
});

updateButtons();

/**
 * *************************************************************
 *  **/


/**
 * scroll Top
 * */
function scrollGoTop() {
    $('html, body').animate({ scrollTop: '0' }, 300);
}

$(window).on('scroll', function() {
    if ($(window).scrollTop() === 0) {
        $('._btnTop').fadeOut(200);
    } else {
        $('._btnTop').fadeIn(200);
    }
});
/**
 * ******************************************************************
 * */

/**
 * count input
 * */
function countChar(val , target) {
    let len = val.value.length;
    $(`${target}`).text(len);
}
/**
 * ******************************************************************
 * */

/**
 * �꾩껜 硫붾돱 紐⑤컮�� �� 寃쎌슦 -> �ロ옒
 * */
function closeModalOnResize() {
    const modal = document.getElementById('menuAll');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);

    if (window.innerWidth <= 820) {
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }
}

window.addEventListener('load', closeModalOnResize);
window.addEventListener('resize', closeModalOnResize);
/**
 * ******************************************************************
 * */


/**
 * jsgrid-handler
 * */
$('.btn-table-toggle').on('click', function () {
    const $container = $(this).closest('.card-title').next('.jsgrid-container');

    $container.slideToggle();
    $(this).toggleClass('hide');
});
/**
 * ******************************************************************
 * */

/**
 * �댁꽕蹂닿린 踰꾪듉
 * */
$('._btnCommentary').on('click', function() {
    const $commentary = $(this).closest('.commentary');
    const $icon = $(this).find('i');

    $commentary.toggleClass('show');

    if ($commentary.hasClass('show')) {
        $(this).html('�댁꽕�リ린 <i class="fa-solid fa-angle-up"></i>');
    } else {
        $(this).html('�댁꽕蹂닿린 <i class="fa-solid fa-angle-down"></i>');
    }
});
/**
 * ******************************************************************
 * */

/**
 * top tab
 * */
(function ($) {
    $(window).on("load", function () {
        $('._tabScroll').mCustomScrollbar({
            axis: 'x',
            setWidth: 'calc(100% - 100px)',
            setHeight: '100%',
        });
    });

    $('._tabScroll .item a').on('click', function () {
        $(this).parent().addClass('on').siblings().removeClass('on')
    })
})(jQuery);
/**
 * ******************************************************************
 * */

/**
 * tooltip
 * */
$(document).ready(function () {
    const $tooltip = $('._tooltip');

    $('._btnTooltip').hover(
        function () {
            const $button = $(this);
            const offset = $button.offset();
            const buttonWidth = $button.outerWidth();

            $tooltip.css({
                top: offset.top - 5,
                left: offset.left + buttonWidth + 10,
                display: 'block'
            });
        },
        function () {
            setTimeout(function () {
                if (!$tooltip.is(':hover')) {
                    $tooltip.hide();
                }
            }, 100);
        }
    );

    $tooltip.hover(
        function () {
            $tooltip.show();
        },
        function () {
            $tooltip.hide();
        }
    );
});
/**
 * ******************************************************************
 * */

/**
 * pills tab
 * */
$('._tabPills a').on('click', function () {
    $(this).parent().addClass('on').siblings().removeClass('on')
})
/**
 * ******************************************************************
 * */

