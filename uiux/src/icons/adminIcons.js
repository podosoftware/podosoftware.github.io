/**
 * 관리자 공통 SVG 아이콘 — 단일 소스(Single Source of Truth)
 *
 * 이 파일 하나에서 아래 결과물이 모두 만들어집니다.
 *
 *  [업무 사이트용 — HTML / jQuery]
 *  - public/admin/css/icons.css                          (<i class="ad-icon ad-icon--search">)
 *  - public/admin/js/admin-icon.js                       (PodoIcon.html(), $(el).adIcon())
 *  - public/admin/icons/sprite.svg                       (<use href> 방식)
 *  - public/admin/icons/svg/{name}.svg                   (개별 파일)
 *
 *  [가이드 사이트 내부용 — React]
 *  - <AdminIcon name="search" />  가이드 화면(메뉴, 버튼 등)을 그릴 때만 사용
 *
 *  → 아이콘 추가/수정 후 `npm run icons` 실행
 *
 * 그리기 규칙 (새 아이콘도 동일하게 맞춰 주세요)
 *  - viewBox 0 0 24 24, 여백 2~3px
 *  - 선형(stroke) 아이콘: stroke-width 1.6, 둥근 끝/모서리 → body 에 도형만 작성
 *  - 면(fill) 아이콘: fill: true 지정
 *  - 색상은 쓰지 않습니다. 모두 currentColor(글자색)를 따라갑니다.
 *
 * legacy: 이 아이콘으로 대체할 수 있는 기존 PNG (images/runway/admin 기준 파일명)
 *         → 가이드 "관리자 아이콘" 페이지의 교체표로 사용됩니다.
 */

export const ICON_VIEWBOX = '0 0 24 24';
export const ICON_STROKE_WIDTH = 1.6;

export const ICON_CATEGORIES = [
    { id: 'action', label: '액션' },
    { id: 'direction', label: '방향' },
    { id: 'status', label: '상태·안내' },
    { id: 'user', label: '사용자·계정' },
    { id: 'content', label: '콘텐츠·파일' },
    { id: 'data', label: '데이터·일정' },
];

export const ADMIN_ICONS = [
    /* ───────── 액션 ───────── */
    {
        name: 'search',
        label: '검색',
        category: 'action',
        legacy: ['icon_search.png', 'renewal/icon/icon_search.png', 'renewal/icon/icon_addr_sch.png'],
        body: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    },
    {
        name: 'close',
        label: '닫기',
        category: 'action',
        legacy: ['pop_close.png', 'btn_close_detail.png', 'icon_file_del.png', 'icon_map.png (X)'],
        body: '<path d="M6 6l12 12M18 6L6 18"/>',
    },
    {
        name: 'plus',
        label: '추가',
        category: 'action',
        legacy: ['icon_add.png', 'icon_plus.png', 'admin_plus.png'],
        body: '<path d="M12 5v14M5 12h14"/>',
    },
    {
        name: 'minus',
        label: '빼기',
        category: 'action',
        legacy: [],
        body: '<path d="M5 12h14"/>',
    },
    {
        name: 'edit',
        label: '수정',
        category: 'action',
        legacy: ['icon_btn_mod.png', 'icon_edit.png', 'admin_btn_mod.png'],
        body: '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M14 8l3 3"/>',
    },
    {
        name: 'trash',
        label: '삭제',
        category: 'action',
        legacy: ['icon_btn_del.png', 'icon_delete.png', 'icon_del.png', 'admin_btn_del.png', 'renewal/icon/icon_delete.png'],
        body: '<path d="M4 7h16M10 3.5h4M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
    },
    {
        name: 'copy',
        label: '복사',
        category: 'action',
        legacy: ['icon_copy_url.png', 'btn_copy_url.png'],
        body: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    },
    {
        name: 'link',
        label: '링크',
        category: 'action',
        legacy: [],
        body: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    },
    {
        name: 'send',
        label: '보내기',
        category: 'action',
        legacy: ['icon_send.png'],
        body: '<path d="M20.5 3.5L10 14M20.5 3.5L14 20.5l-4-6.5-6.5-4z"/>',
    },
    {
        name: 'refresh',
        label: '새로고침·반복',
        category: 'action',
        legacy: ['icon_repeat_bar.png'],
        body: '<path d="M19.5 10.5A7.5 7.5 0 0 0 6 7.2L4.5 9M4.5 4.5V9H9M4.5 13.5A7.5 7.5 0 0 0 18 16.8l1.5-1.8M19.5 19.5V15H15"/>',
    },
    {
        name: 'download',
        label: '다운로드',
        category: 'action',
        legacy: ['icon_download.png', 'icon_download_black.png', 'icon_excel_download.png', 'Paper_Download_off.png'],
        body: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    },
    {
        name: 'upload',
        label: '업로드',
        category: 'action',
        legacy: ['icon_excel_upload.png', 'admin_excel_upload.png'],
        body: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    },
    {
        name: 'filter',
        label: '필터',
        category: 'action',
        legacy: ['icon_filter.png', 'icon_filter_on.png', 'icon_table_filter.png', 'icon_map.png (깔때기)'],
        body: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    },
    {
        name: 'more',
        label: '더보기',
        category: 'action',
        legacy: ['icon_more.png', 'btn_edss_more.png'],
        fill: true,
        body: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
    },
    {
        name: 'menu',
        label: '메뉴',
        category: 'action',
        legacy: [],
        body: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    },

    /* ───────── 방향 ───────── */
    {
        name: 'arrow-up',
        label: '위로 이동',
        category: 'direction',
        legacy: ['icon_add_up.png'],
        body: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    },
    {
        name: 'arrow-down',
        label: '아래로 이동',
        category: 'direction',
        legacy: ['icon_add_down.png'],
        body: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    },
    {
        name: 'chevron-up',
        label: '접기',
        category: 'direction',
        legacy: ['icon_up.png', 'icon_map2.png (^)'],
        body: '<path d="M6 15l6-6 6 6"/>',
    },
    {
        name: 'chevron-down',
        label: '펼치기·선택',
        category: 'direction',
        legacy: ['icon_down.png', 'icon_select.png', 'icon_map2.png (v)', 'icon_arrow_profile.png'],
        body: '<path d="M6 9l6 6 6-6"/>',
    },
    {
        name: 'chevron-left',
        label: '이전',
        category: 'direction',
        legacy: ['icon_gnb_close.png', 'renewal/icon/btn_prev_month.png', 'admin_prev_step.png', 'btn_prev_slide.png'],
        body: '<path d="M15 6l-6 6 6 6"/>',
    },
    {
        name: 'chevron-right',
        label: '다음',
        category: 'direction',
        legacy: ['icon_gnb_open.png', 'renewal/icon/btn_next_month.png', 'admin_next_step.png', 'btn_next_slide.png'],
        body: '<path d="M9 6l6 6-6 6"/>',
    },
    {
        name: 'chevrons-left',
        label: '처음',
        category: 'direction',
        legacy: ['icon_map.png (페이저 처음)'],
        body: '<path d="M17 6l-6 6 6 6M11 6l-6 6 6 6"/>',
    },
    {
        name: 'chevrons-right',
        label: '마지막',
        category: 'direction',
        legacy: ['icon_map.png (페이저 마지막)'],
        body: '<path d="M7 6l6 6-6 6M13 6l6 6-6 6"/>',
    },
    {
        name: 'caret-up',
        label: '증가·툴팁 꼬리',
        category: 'direction',
        legacy: ['icon_input_number_up.png', 'kendo_tip_tig.png', 'icon_map.png (▲)'],
        fill: true,
        body: '<path d="M12 8l6 8H6z"/>',
    },
    {
        name: 'caret-down',
        label: '감소·드롭다운',
        category: 'direction',
        legacy: ['icon_input_number_down.png', 'icon_map.png (▼)'],
        fill: true,
        body: '<path d="M12 16L6 8h12z"/>',
    },
    {
        name: 'caret-left',
        label: '왼쪽 삼각',
        category: 'direction',
        legacy: ['menu_arrow.png'],
        fill: true,
        body: '<path d="M8 12l8-6v12z"/>',
    },
    {
        name: 'caret-right',
        label: '오른쪽 삼각',
        category: 'direction',
        legacy: ['icon_map2.png (▶)'],
        fill: true,
        body: '<path d="M16 12l-8 6V6z"/>',
    },
    {
        name: 'next-circle',
        label: '다음 단계',
        category: 'direction',
        legacy: ['icon_next_step.png', 'icon_next_step_edss.png'],
        body: '<circle cx="12" cy="12" r="9"/><path d="M10.5 8l4 4-4 4"/>',
    },

    /* ───────── 상태·안내 ───────── */
    {
        name: 'info',
        label: '정보',
        category: 'status',
        legacy: ['icon_info_blue.png', 'icon_info_gray.png'],
        body: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.01"/>',
    },
    {
        name: 'info-filled',
        label: '정보(채움)',
        category: 'status',
        legacy: ['icon_filled_info.png'],
        fill: true,
        body: '<path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 9h2v6.5h-2zm1-4.6a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"/>',
    },
    {
        name: 'help',
        label: '도움말·팁',
        category: 'status',
        legacy: ['icon_subtract.png', 'icon_tip_info.png', 'icon_explain.png'],
        body: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.6v.5M12 16.8v.01"/>',
    },
    {
        name: 'alert',
        label: '경고',
        category: 'status',
        legacy: ['sub/icon_alert.png'],
        body: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.3v.01"/>',
    },
    {
        name: 'check',
        label: '체크',
        category: 'status',
        legacy: ['icon_map.png (체크)', 'sub/bg_checked.png', 'bg_checked_22.png'],
        body: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    },
    {
        name: 'check-circle',
        label: '완료',
        category: 'status',
        legacy: ['icon_map.png (원형 체크)', 'icon_comit.png'],
        body: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    },

    /* ───────── 사용자·계정 ───────── */
    {
        name: 'home',
        label: '홈',
        category: 'user',
        legacy: ['icon_home.png', 'renewal/admin/admin_home.png'],
        body: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
    },
    {
        name: 'user',
        label: '사용자',
        category: 'user',
        legacy: ['icon_user.png', 'icon_person.png'],
        body: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    },
    {
        name: 'user-square',
        label: '마이페이지',
        category: 'user',
        legacy: ['icon_user_mypage.png', 'admin_my.png', 'Profile_off.png'],
        body: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M7 18c1-2.2 2.8-3.4 5-3.4s4 1.2 5 3.4"/>',
    },
    {
        name: 'users',
        label: '사용자 그룹',
        category: 'user',
        legacy: ['icon_users.png'],
        body: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5M15.5 4.7a3.5 3.5 0 0 1 0 6.6M17.5 14.8c2 .8 3.4 2.6 4 5.2"/>',
    },
    {
        name: 'building',
        label: '소속·팀',
        category: 'user',
        legacy: ['icon_team.png'],
        body: '<path d="M4.5 20V5l7.5-2v17M12 8l7.5 2v10M3 20h18M7.5 8h1.5M7.5 12h1.5M7.5 16h1.5M15 13.5h1.5M15 16.5h1.5"/>',
    },
    {
        name: 'lock',
        label: '비밀번호 변경',
        category: 'user',
        legacy: ['icon_user_changepw.png', 'admin_change_pw.png'],
        body: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/>',
    },
    {
        name: 'logout',
        label: '로그아웃',
        category: 'user',
        legacy: ['icon_logout.png', 'icon_user_logout.png', 'admin_logout_admin.png'],
        body: '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>',
    },
    {
        name: 'mail',
        label: '이메일',
        category: 'user',
        legacy: ['icon_email.png', 'icon_mail.png'],
        body: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    },
    {
        name: 'phone',
        label: '전화',
        category: 'user',
        legacy: ['icon_phone.png'],
        body: '<path d="M5 4h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L20 16v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    },
    {
        name: 'message',
        label: '메시지',
        category: 'user',
        legacy: ['icon_message.png', 'icon_nochat.png'],
        body: '<path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z"/>',
    },

    /* ───────── 콘텐츠·파일 ───────── */
    {
        name: 'document',
        label: '문서·PDF',
        category: 'content',
        legacy: ['icon_lcms_pdf.png'],
        body: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    },
    {
        name: 'paperclip',
        label: '첨부파일',
        category: 'content',
        legacy: ['icon_file.png', 'renewal/icon/icon_file.png'],
        body: '<path d="M20 11.5l-8.2 8.2a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>',
    },
    {
        name: 'folder',
        label: '폴더',
        category: 'content',
        legacy: ['sub/icon_folder.png'],
        body: '<path d="M3.5 6.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    },
    {
        name: 'folder-open',
        label: '열린 폴더',
        category: 'content',
        legacy: ['sub/icon_folder_open.png'],
        body: '<path d="M3.5 17.5v-11a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V10"/><path d="M3.5 18.5l2.4-6.8a1.5 1.5 0 0 1 1.4-1h13.2l-2.6 7.9a1.5 1.5 0 0 1-1.4 1H5a1.5 1.5 0 0 1-1.5-1.1z"/>',
    },
    {
        name: 'grid',
        label: '코드·목록형',
        category: 'content',
        legacy: ['icon_excel_code.png', 'admin_excel_code.png'],
        body: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    },
    {
        name: 'video',
        label: '동영상',
        category: 'content',
        legacy: ['icon_lcms_video.png'],
        body: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3"/>',
    },
    {
        name: 'play-circle',
        label: '재생',
        category: 'content',
        legacy: ['icon_play.png', 'icon_lcms_youtube.png', 'icon_youtube.png'],
        body: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z"/>',
    },
    {
        name: 'image-off',
        label: '이미지 없음',
        category: 'content',
        legacy: ['img_empty.png', 'no_image.png', 'none_photo2.gif'],
        body: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 16l5-5 4 4M14 13l2-2 4.5 4.5M3 3l18 18"/>',
    },

    /* ───────── 데이터·일정 ───────── */
    {
        name: 'calendar',
        label: '날짜',
        category: 'data',
        legacy: ['icon_map.png (달력)'],
        body: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    },
    {
        name: 'clock',
        label: '시간',
        category: 'data',
        legacy: ['icon_clock.png', 'icon_map.png (시계)'],
        body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    },
    {
        name: 'chart-bar',
        label: '막대 차트',
        category: 'data',
        legacy: ['pay_chart.png'],
        body: '<path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
    },
    {
        name: 'chart-line',
        label: '선 차트',
        category: 'data',
        legacy: [],
        body: '<path d="M4 20h16M5 15l4.5-4.5 3.5 3 6-6.5"/>',
    },
    {
        name: 'settings',
        label: '설정',
        category: 'data',
        legacy: ['icon_operator_menu05.png'],
        body: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    },
];

/**
 * <svg> 루트에 넣을 공통 속성 (stroke/fill 방식에 따라 다름)
 * React / 빌드 스크립트가 같은 값을 쓰도록 여기서 한 번만 정의합니다.
 */
export function getIconSvgAttributes(icon) {
    if (icon.fill) {
        return {
            fill: 'currentColor',
            stroke: 'none',
        };
    }

    return {
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': String(ICON_STROKE_WIDTH),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
    };
}

export function findAdminIcon(name) {
    return ADMIN_ICONS.find((icon) => icon.name === name) || null;
}
