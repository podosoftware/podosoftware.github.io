/**
 * Kendo UI v2022.2.621 (http://www.telerik.com/kendo-ui)
 * Copyright 2022 Progress Software Corporation and/or one of its subsidiaries or affiliates. All rights reserved.
 *
 * Kendo UI commercial licenses may be obtained at
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
 * If you do not own a commercial license, this file shall be governed by the trial license terms.
 */

(function(f){
    if (typeof define === 'function' && define.amd) {
        define(["kendo.core"], f);
    } else {
        f();
    }
}(function(){
(function($, undefined) {
/* FlatColorPicker messages */

if (kendo.ui.FlatColorPicker) {
kendo.ui.FlatColorPicker.prototype.options.messages =
$.extend(true, kendo.ui.FlatColorPicker.prototype.options.messages,{
  "apply": "적용",
  "cancel": "취소"
});
}

/* ColorPicker messages */

if (kendo.ui.ColorPicker) {
kendo.ui.ColorPicker.prototype.options.messages =
$.extend(true, kendo.ui.ColorPicker.prototype.options.messages,{
  "apply": "적용",
  "cancel": "취소"
});
}

/* ColumnMenu messages */

if (kendo.ui.ColumnMenu) {
kendo.ui.ColumnMenu.prototype.options.messages =
$.extend(true, kendo.ui.ColumnMenu.prototype.options.messages,{
  "sortAscending": "오름차순으로 정렬",
  "sortDescending": "내림차순으로 정렬",
  "filter": "필터",
  "columns": "열",
  "done": "완료",
  "settings": "열 설정",
  "lock": "록",
  "unlock": "잠금 해제"
});
}

/* Editor messages */

if (kendo.ui.Editor) {
kendo.ui.Editor.prototype.options.messages =
$.extend(true, kendo.ui.Editor.prototype.options.messages,{
  "bold": "굵게",
  "italic": "기울임꼴",
  "underline": "밑줄",
  "strikethrough": "취소선",
  "superscript": "위 첨자",
  "subscript": "아래 첨자",
  "justifyCenter": "텍스트 가운데 맞춤",
  "justifyLeft": "텍스트 왼쪽 맞춤",
  "justifyRight": "텍스트 오른쪽 맞춤",
  "justifyFull": "양쪽 맞춤",
  "insertUnorderedList": "순서가 지정되지 않은 목록 삽입",
  "insertOrderedList": "순서된 목록 삽입",
  "indent": "들여쓰기",
  "outdent": "들여쓰기 해제",
  "createLink": "하이퍼링크 삽입",
  "unlink": "하이퍼링크 삭제",
  "insertImage": "이미지 삽입",
  "insertFile": "파일 삽입",
  "insertHtml": "HTML 삽입",
  "viewHtml": "HTML 표시",
  "fontName": "글꼴 패밀리 선택",
  "fontNameInherit": "(상속된 글꼴)",
  "fontSize": "글꼴 크기 선택",
  "fontSizeInherit": "(상속된 크기)",
  "formatBlock": "형식",
  "formatting": "형식",
  "foreColor": "컬러",
  "backColor": "배경색",
  "style": "스타일",
  "emptyFolder": "빈 폴더",
  "uploadFile": "업로드",
  "orderBy": "다음 요소 정렬:",
  "orderBySize": "크기",
  "orderByName": "이름",
  "invalidFileType": "선택한 파일 {0}이(가) 잘못되었습니다. 지원되는 파일 형식은 {1}입니다.",
  "deleteFile": "{0}을 정말로 삭제하시겠습니까?",
  "overwriteFile": "{0}이라는 파일이 이미 현재 디렉터리에 있습니다. 덮어쓰시겠습니까?",
  "directoryNotFound": "이 이름의 디렉터리를 찾을 수 없습니다.",
  "imageWebAddress": "웹 주소",
  "imageAltText": "대체 텍스트",
  "imageWidth": "너비(px)",
  "imageHeight": "높이 (px)",
  "fileWebAddress": "웹 주소",
  "fileTitle": "제목",
  "linkWebAddress": "웹 주소",
  "linkText": "텍스트",
  "linkToolTip": "툴팁",
  "linkOpenInNewWindow": "새 창에서 링크 열기",
  "dialogUpdate": "업데이트",
  "dialogInsert": "삽입",
  "dialogButtonSeparator": "또는",
  "dialogCancel": "취소",
  "createTable": "테이블 만들기",
  "addColumnLeft": "왼쪽에 열 추가",
  "addColumnRight": "오른쪽에 열 추가",
  "addRowAbove": "위에 행 추가",
  "addRowBelow": "아래에 행 추가",
  "deleteRow": "행 삭제",
  "deleteColumn": "열 삭제"
});
}

/* FileBrowser messages */

if (kendo.ui.FileBrowser) {
kendo.ui.FileBrowser.prototype.options.messages =
$.extend(true, kendo.ui.FileBrowser.prototype.options.messages,{
  "uploadFile": "업로드",
  "orderBy": "다음 요소별 정렬",
  "orderByName": "이름",
  "orderBySize": "크기",
  "directoryNotFound": "이 이름의 디렉터리를 찾을 수 없습니다.",
  "emptyFolder": "빈 폴더",
  "deleteFile": "{0}을 정말로 삭제하시겠습니까?",
  "invalidFileType": "선택한 파일 {0}이(가) 잘못되었습니다. 지원되는 파일 형식은 {1}입니다.",
  "overwriteFile": "{0}이라는 파일이 이미 현재 디렉터리에 있습니다. 덮어쓰시겠습니까?",
  "dropFilesHere": "여기에 파일을 삭제하고 업로드",
  "search": "검색"
});
}

/* FilterCell messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.messages =
$.extend(true, kendo.ui.FilterCell.prototype.options.messages,{
  "isTrue": "참이다",
  "isFalse": "가짜",
  "filter": "필터",
  "clear": "클리어",
  "operator": "연산자"
});
}

/* FilterCell operators */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.operators =
$.extend(true, kendo.ui.FilterCell.prototype.options.operators,{
  "string": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다릅니다",
    "startswith": "이 다음으로 시작",
    "contains": "이 포함됨",
    "doesnotcontain": "이 다음을 포함하지 않음",
    "endswith": "이 다음으로 끝납니다"
  },
  "number": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다릅니다",
    "gte": "이 다음 값 이상",
    "gt": "이 다음 값보다 큰",
    "lte": "이 다음 값 이하",
    "lt": "이 다음 값보다 작음"
  },
  "date": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다릅니다",
    "gte": "다음 값과 같거나 그 이후",
    "gt": "다음 값 이후",
    "lte": "다음 값과 같거나 그 이전",
    "lt": "다음 값 이전"
  },
  "enums": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다름"
  }
});
}

/* FilterMenu messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.messages =
$.extend(true, kendo.ui.FilterMenu.prototype.options.messages,{
  "info": "다음 값이 있는 항목 표시:",
  "title": "다음 값이 있는 항목 표시",
  "isTrue": "참이다",
  "isFalse": "가짜",
  "filter": "필터",
  "clear": "클리어",
  "and": "And",
  "or": "Or",
  "selectValue": "-값 선택-",
  "operator": "연산자",
  "value": "값",
  "cancel": "취소"
});
}

/* FilterMenu operator messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.operators =
$.extend(true, kendo.ui.FilterMenu.prototype.options.operators,{
  "string": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다릅니다",
    "startswith": "이 다음으로 시작",
    "contains": "이 포함됨",
    "doesnotcontain": "이 다음을 포함하지 않음",
    "endswith": "이 다음으로 끝납니다"
  },
  "number": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다릅니다",
    "gte": "이 다음 값 이상",
    "gt": "이 다음 값보다 큰",
    "lte": "이 다음 값 이하",
    "lt": "이 다음 값보다 작음"
  },
  "date": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다릅니다",
    "gte": "다음 값과 같거나 그 이후",
    "gt": "다음 값 이후",
    "lte": "다음 값과 같거나 그 이전",
    "lt": "다음 값 이전"
  },
  "enums": {
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다름"
  }
});
}

/* FilterMultiCheck messages */

if (kendo.ui.FilterMultiCheck) {
kendo.ui.FilterMultiCheck.prototype.options.messages =
$.extend(true, kendo.ui.FilterMultiCheck.prototype.options.messages,{
  "search": "검색"
});
}

/* 간트 메시지 */

if (kendo.ui.Gantt) {
kendo.ui.Gantt.prototype.options.messages =
$.extend(true, kendo.ui.Gantt.prototype.options.messages,{
  "actions": {
    "addChild": "자식 추가",
    "append": "작업 추가",
    "insertAfter": "아래에 추가",
    "insertBefore": "위에 추가",
    "pdf": "PDF로 내보내기"
  },
  "cancel": "취소",
  "deleteDependencyWindowTitle": "종속성 삭제",
  "deleteTaskWindowTitle": "작업 삭제",
  "destroy": "삭제",
  "editor": {
    "assingButton": "할당",
    "editorTitle": "작업",
    "end": "종점",
    "percentComplete": "완료",
    "resources": "자원",
    "resourcesEditorTitle": "자원",
    "resourcesHeader": "자원",
    "start": "시작점",
    "title": "제목",
    "unitsHeader": "단위"
  },
  "save": "저장",
  "views": {
    "day": "일",
    "end": "종점",
    "month": "월",
    "start": "시작점",
    "week": "주",
    "year": "년"
  }
});
}

/* 그리드 메시지 */

if (kendo.ui.Grid) {
kendo.ui.Grid.prototype.options.messages =
$.extend(true, kendo.ui.Grid.prototype.options.messages,{
  "commands": {
    "cancel": "변경 취소",
    "canceledit": "취소",
    "create": "새 레코드 추가",
    "destroy": "삭제",
    "edit": "편집",
    "excel": "Export to Excel",
    "pdf": "Export to PDF",
    "save": "변경 사항 저장",
    "select": "선택",
    "update": "업데이트"
  },
  "editable": {
    "cancelDelete": "취소",
    "confirmation": "이 레코드를 정말로 삭제하시겠습니까?",
    "confirmDelete": "삭제"
  }
});
}

/* Groupable messages */

if (kendo.ui.Groupable) {
kendo.ui.Groupable.prototype.options.messages =
$.extend(true, kendo.ui.Groupable.prototype.options.messages,{
  "empty": "열 머리글을 여기로 끌어서 놓고 열로 그룹화"
});
}

/* NumericTextBox messages */

if (kendo.ui.NumericTextBox) {
kendo.ui.NumericTextBox.prototype.options =
$.extend(true, kendo.ui.NumericTextBox.prototype.options,{
  "upArrowText": "값 늘리기",
  "downArrowText": "값 줄이기"
});
}

/* Pager messages */

if (kendo.ui.Pager) {
kendo.ui.Pager.prototype.options.messages =
$.extend(true, kendo.ui.Pager.prototype.options.messages,{
  "allPages": "All",
  "display": "{0} - {1} ({2} 항목 중)",
  "empty": "표시할 항목이 없습니다",
  "page": "페이지",
  "of": "/ {0}",
  "itemsPerPage": "항목(페이지당)",
  "first": "첫 페이지로 이동",
  "previous": "이전 페이지로 이동",
  "next": "다음 페이지로 이동",
  "last": "마지막 페이지로 이동",
  "refresh": "업데이트",
  "morePages": "기타 페이지"
});
}

/* TreeListPager messages */

if (kendo.ui.TreeListPager) {
kendo.ui.TreeListPager.prototype.options.messages =
$.extend(true, kendo.ui.TreeListPager.prototype.options.messages,{
  "allPages": "All",
  "display": "{0} - {1} ({2} 항목 중)",
  "empty": "표시할 항목이 없습니다",
  "page": "페이지",
  "of": "/ {0}",
  "itemsPerPage": "항목(페이지당)",
  "first": "첫 페이지로 이동",
  "previous": "이전 페이지로 이동",
  "next": "다음 페이지로 이동",
  "last": "마지막 페이지로 이동",
  "refresh": "업데이트",
  "morePages": "기타 페이지"
});
}

/* PivotGrid messages */

if (kendo.ui.PivotGrid) {
kendo.ui.PivotGrid.prototype.options.messages =
$.extend(true, kendo.ui.PivotGrid.prototype.options.messages,{
  "measureFields": "여기에 데이터 필드 삭제",
  "columnFields": "여기에 열 필드 삭제",
  "rowFields": "여기에 행 필드 삭제"
});
}

/* PivotFieldMenu messages */

if (kendo.ui.PivotFieldMenu) {
kendo.ui.PivotFieldMenu.prototype.options.messages =
$.extend(true, kendo.ui.PivotFieldMenu.prototype.options.messages,{
  "info": "다음 값이 있는 항목 표시:",
  "filterFields": "필드 필터",
  "filter": "필터",
  "include": "필드 포함...",
  "title": "포함하는 필드",
  "clear": "클리어",
  "ok": "OK",
  "cancel": "취소",
  "operators": {
    "contains": "이 포함됨",
    "doesnotcontain": "이 다음을 포함하지 않음",
    "startswith": "이 다음으로 시작",
    "endswith": "이 다음으로 끝나는",
    "eq": "이 다음 값과 동일",
    "neq": "이 다음 값과 다름"
  }
});
}

/* RecurrenceEditor messages */

if (kendo.ui.RecurrenceEditor) {
kendo.ui.RecurrenceEditor.prototype.options.messages =
$.extend(true, kendo.ui.RecurrenceEditor.prototype.options.messages,{
  "frequencies": {
    "never": "없음",
    "hourly": "매시간",
    "daily": "매일",
    "weekly": "매주",
    "monthly": "매월",
    "yearly": "매년"
  },
  "hourly": {
    "repeatEvery": "다음 간격으로 반복: ",
    "interval": "시간"
  },
  "daily": {
    "repeatEvery": "다음 간격으로 반복: ",
    "interval": " 일"
  },
  "weekly": {
    "interval": "주간",
    "repeatEvery": "다음 간격으로 반복: ",
    "repeatOn": "다음에 반복: "
  },
  "monthly": {
    "repeatEvery": "다음 간격으로 반복: ",
    "repeatOn": "다음에 반복:",
    "interval": "달",
    "day": "일"
  },
  "yearly": {
    "repeatEvery": "다음 간격으로 반복: ",
    "repeatOn": "다음에 반복:",
    "interval": " 년",
    "of": " 의 "
  },
  "end": {
    "label": "종료:",
    "mobileLabel": "종료",
    "never": "없음",
    "after": "후 ",
    "occurrence": "회",
    "on": "온"
  },
  "offsetPositions": {
    "first": "처음",
    "second": "두 번째",
    "third": "세 번째",
    "fourth": "네 번째",
    "last": "마지막"
  },
  "weekdays": {
    "day": "일",
    "weekday": "평일",
    "weekend": "주말"
  }
});
}

/* 스케줄러 메시지 */

if (kendo.ui.Scheduler) {
kendo.ui.Scheduler.prototype.options.messages =
$.extend(true, kendo.ui.Scheduler.prototype.options.messages,{
  "allDay": "모든 날",
  "date": "날짜",
  "event": "이벤트",
  "time": "시간",
  "showFullDay": "24시간 표시",
  "showWorkDay": "영업 시간 보기",
  "today": "오늘",
  "save": "저장",
  "cancel": "취소",
  "destroy": "삭제",
  "deleteWindowTitle": "이벤트 삭제",
  "ariaSlotLabel": "{0:t} ~ {1:t} 사이의 범위에서 선택",
  "ariaEventLabel": "{0} ({1:D} 일 {2:t} 시)",
  "confirmation": "이 이벤트를 정말로 삭제하시겠습니까?",
  "views": {
    "day": "일",
    "week": "주",
    "workWeek": "근무일",
    "agenda": "예정",
    "month": "월"
  },
  "recurrenceMessages": {
    "deleteWindowTitle": "정기 항목 삭제",
    "deleteWindowOccurrence": "현재 시간 삭제",
    "deleteWindowSeries": "계열 삭제",
    "editWindowTitle": "정기 항목 편집",
    "editWindowOccurrence": "현재 시간 편집",
    "editWindowSeries": "계열 편집",
    "deleteRecurring": "이 이벤트의 한 번만 삭제하시겠습니까? 아니면 전체 계열을 삭제하시겠습니까?",
    "editRecurring": "이 이벤트의 시간만 편집하시겠습니까? 아니면 전체 계열을 편집하시겠습니까?"
  },
  "editor": {
    "title": "제목",
    "start": "시작점",
    "end": "종점",
    "allDayEvent": "종일 이벤트",
    "description": "설명",
    "repeat": "반복",
    "timezone": " ",
    "startTimezone": "시작 시간대",
    "endTimezone": "종료 시간대",
    "separateTimezones": "시작 및 종료에 다른 시간대 사용",
    "timezoneEditorTitle": "시간대",
    "timezoneEditorButton": "시간대",
    "timezoneTitle": "시간대",
    "noTimezone": "시간대 없음",
    "editorTitle": "이벤트"
  }
});
}

/* 슬라이더 메시지 */

if (kendo.ui.Slider) {
kendo.ui.Slider.prototype.options =
$.extend(true, kendo.ui.Slider.prototype.options,{
  "increaseButtonTitle": "늘리기",
  "decreaseButtonTitle": "감소"
});
}

/* TreeView messages */

if (kendo.ui.TreeView) {
kendo.ui.TreeView.prototype.options.messages =
$.extend(true, kendo.ui.TreeView.prototype.options.messages,{
  "loading": "로드 중...",
  "requestFailed": "요청을 실행할 수 없습니다.",
  "retry": "재시도"
});
}

/* Upload messages */

if (kendo.ui.Upload) {
kendo.ui.Upload.prototype.options.localization =
$.extend(true, kendo.ui.Upload.prototype.options.localization,{
  "select": "파일 선택...",
  "cancel": "취소",
  "retry": "재시도",
  "remove": "삭제",
  "uploadSelectedFiles": "파일 업로드",
  "dropFilesHere": "여기에 파일을 삭제하고 업로드",
  "statusUploading": "업로드 중",
  "statusUploaded": "업로드됨",
  "statusWarning": "경고",
  "statusFailed": "실패",
  "headerStatusUploading": "업로드 중...",
  "headerStatusUploaded": "완료"
});
}

/* Validator messages */

if (kendo.ui.Validator) {
kendo.ui.Validator.prototype.options.messages =
$.extend(true, kendo.ui.Validator.prototype.options.messages,{
  "required": "{0} 필요",
  "pattern": "{0}이(가) 잘못되었습니다.",
  "min": "{0}이 {1}보다 크거나 같아야 합니다",
  "max": "{0}은 {1}보다 작거나 같은 값이어야 합니다",
  "step": "{0}이(가) 잘못되었습니다.",
  "email": "{0}이(가) 잘못된 이메일입니다",
  "url": "{0}이(가) 잘못된 URL입니다",
  "date": "{0}이(가) 잘못된 날짜입니다"
});
}

/* Dialog */

if (kendo.ui.Dialog) {
kendo.ui.Dialog.prototype.options.messages =
$.extend(true, kendo.ui.Dialog.prototype.options.localization, {
  "close": "닫기"
});
}

/* Alert */

if (kendo.ui.Alert) {
kendo.ui.Alert.prototype.options.messages =
$.extend(true, kendo.ui.Alert.prototype.options.localization, {
  "okText": "오케이"
});
}

/* Confirm */

if (kendo.ui.Confirm) {
kendo.ui.Confirm.prototype.options.messages =
$.extend(true, kendo.ui.Confirm.prototype.options.localization, {
  "okText": "오케이",
  "cancel": "취소"
});
}

/* Prompt */
if (kendo.ui.Prompt) {
kendo.ui.Prompt.prototype.options.messages =
$.extend(true, kendo.ui.Prompt.prototype.options.localization, {
  "okText": "오케이",
  "cancel": "취소"
});
}

}) (window.kendo.jQuery);
}));