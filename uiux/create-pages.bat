@echo off
REM 페이지 자동 생성 스크립트 (Windows)

setlocal enabledelayedexpansion

set PAGES_DIR=src\main\pages

REM 페이지 목록 정의
set "pages[0]=icons-overview.html|아이콘 개요"
set "pages[1]=icons-usage.html|사용법"
set "pages[2]=icons-list.html|아이콘 목록"
set "pages[3]=buttons.html|버튼"
set "pages[4]=forms.html|폼 요소"
set "pages[5]=table.html|테이블"
set "pages[6]=kendo-overview.html|Kendo 개요"
set "pages[7]=kendo-grid.html|Grid"
set "pages[8]=kendo-dropdown.html|DropDownList"
set "pages[9]=kendo-datepicker.html|DatePicker"
set "pages[10]=kendo-window.html|Window"
set "pages[11]=kendo-treeview.html|TreeView"

REM 페이지 생성 루프
for /L %%i in (0,1,11) do (
    set "page_info=!pages[%%i]!"
    for /F "tokens=1,2 delims=|" %%a in ("!page_info!") do (
        set "filename=%%a"
        set "title=%%b"
        
        (
            echo ^<nav class="breadcrumb"^>^<span^>홈^</span^>^<span class="breadcrumb-sep"^>›^</span^>^<span class="breadcrumb-cur"^>!title!^</span^>^</nav^>
            echo ^<div class="page-hero"^>^<h1 class="hero-title"^>!title!^</h1^>^<p class="hero-desc"^>이 페이지는 !title!에 대한 내용을 다룹니다.^</p^>^</div^>
            echo ^<div id="doc-content"^>^<h2 class="sec" id="s-intro"^>^<span class="sec-num"^>01^</span^>개요^</h2^>^<p class="prose"^>!title!에 대한 설명입니다.^</p^>^</div^>
            echo ^<aside id="toc-panel"^>^<div class="toc-title"^>이 페이지^</div^>^<a class="toc-link active" onclick="scrollTo('s-intro')"^>개요^</a^>^</aside^>
        ) > "!PAGES_DIR!\!filename!"
        
        echo Created: !filename!
    )
)

echo.
echo ✓ 모든 페이지가 생성되었습니다!
pause
