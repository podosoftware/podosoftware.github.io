#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SPA 페이지 자동 생성 스크립트
이 스크립트를 실행하면 모든 필요한 페이지 파일이 자동으로 생성됩니다.
"""

import os
from pathlib import Path

# 페이지 정의: (파일명, 제목)
PAGES = [
    ("icons-overview.html", "아이콘 개요"),
    ("icons-usage.html", "사용법"),
    ("icons-list.html", "아이콘 목록"),
    ("buttons.html", "버튼"),
    ("forms.html", "폼 요소"),
    ("table.html", "테이블"),
    ("kendo-overview.html", "Kendo 개요"),
    ("kendo-grid.html", "Grid"),
    ("kendo-dropdown.html", "DropDownList"),
    ("kendo-datepicker.html", "DatePicker"),
    ("kendo-window.html", "Window"),
    ("kendo-treeview.html", "TreeView"),
]

# 페이지 템플릿
def get_page_template(title):
    return f'''<nav class="breadcrumb"><span>홈</span><span class="breadcrumb-sep">›</span><span class="breadcrumb-cur">{title}</span></nav><div class="page-hero"><h1 class="hero-title">{title}</h1><p class="hero-desc">이 페이지는 {title}에 대한 내용을 다룹니다.</p></div><div id="doc-content"><h2 class="sec" id="s-intro"><span class="sec-num">01</span>개요</h2><p class="prose">{title}에 대한 설명입니다.</p></div><aside id="toc-panel"><div class="toc-title">이 페이지</div><a class="toc-link active" onclick="scrollTo('s-intro')">개요</a></aside>'''

def main():
    # pages 디렉토리 경로
    pages_dir = Path(__file__).parent / "src" / "main" / "pages"
    
    # 디렉토리 생성
    pages_dir.mkdir(parents=True, exist_ok=True)
    
    print("📄 페이지 생성 중...\n")
    
    # 각 페이지 생성
    for filename, title in PAGES:
        filepath = pages_dir / filename
        
        # 이미 존재하는 파일은 건너뛰기
        if filepath.exists():
            print(f"⏭️  이미 존재함: {filename}")
            continue
        
        # 페이지 생성
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(get_page_template(title))
            print(f"✅ 생성됨: {filename}")
        except Exception as e:
            print(f"❌ 실패: {filename} - {e}")
    
    print(f"\n✨ 완료! {pages_dir} 폴더에 페이지가 생성되었습니다.")

if __name__ == "__main__":
    main()
