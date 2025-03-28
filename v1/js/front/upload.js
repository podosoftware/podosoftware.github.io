const uploadTemplate = document.createElement('template');
uploadTemplate.innerHTML = `
    
    <div class="hide my-file-upload"></div>
    <div class="file-template"></div>
`;

var fileGridData = [
    { name: "파일명.png", size: 123456, attachmentId: 123}
];

// 리스트 형식 업로드
class podoUpload extends HTMLElement {
    // 클래스의 정적 변수로 counter를 선언하여 순차적 ID 부여
    static uploadCounter = 1;
    static uploadCounter2 = 1;    // 파일업로드 템플릿 id

    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
        this.appendChild(uploadTemplate.content.cloneNode(true));
        // 속성에서 ID 값을 가져오고, 없으면 순차적 ID 사용
        this.uniqueId = this.getAttribute('upload-id') || `list_file_upload${podoUpload.uploadCounter}`;
        this.uniqueId2 = this.getAttribute('list-id') || `list_file_grid${podoUpload.uploadCounter}`;

        // 속성에 지정되지 않은 경우에만 카운터 증가
        if (!this.getAttribute('upload-id')) {
            podoUpload.uploadCounter++;
        }

        this.upload = this.querySelector(".my-file-upload");
        this.list = this.querySelector(".file-template");
        this.upload.setAttribute("id", this.uniqueId);
        this.list.setAttribute("id", this.uniqueId2);
    }

    // 감시할 속성 목록을 반환
    static get observedAttributes() {
        return ['type'];
    }

    // 속성이 변경될 때마다 호출되는 메서드
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type') {
            console.log('Type attribute changed:', newValue);
            // 속성 값에 따른 처리를 여기서 수행할 수 있음
        }
    }

    connectedCallback() {
        const type = this.getAttribute('type'); // 초기 값 가져오기
        console.log('Initial type:', type);
        // 초기 값에 따른 처리를 여기서 수행할 수 있음

        // 파일리스트 템플릿
        if (!document.getElementById("fileList")) {
            const scriptTemplate = document.createElement("script");
            scriptTemplate.type = "text/x-kendo-template";
            scriptTemplate.id = "fileList";
            scriptTemplate.innerHTML = `
            <tr>
                <td colspan="2">
                    <div class="file-list">
                        <a href="/comm/download_my_attachment.do?attachmentId=#:attachmentId#" class="file-tit"><span class="file-icon"></span>#:name#</a>
                        <span class="file-size">#= commaStr(data.size) #byte</span>
                        <button type="button" class="del-file" onclick="deleteFile(#:attachmentId#, '${this.uniqueId2}')"></button>
                    </div>
                </td>
            </tr>
    `;
            document.body.appendChild(scriptTemplate);
        }

        console.log("uniqueId2", `${this.uniqueId2}`);

        const objectType = $(`#objectType_${this.uniqueId2}`).val();

        if ($(`#${this.uniqueId}`).text().length == 0) {
            $(`#${this.uniqueId}`).html(`
                <input name="list_upload_file" id="list_upload_file_${this.uniqueId2}" type="file"/>
            `);
        }

        $(`#list_upload_file_${this.uniqueId2}`).kendoUpload({
            showFileList: false,
            width: 500,
            multiple: false,
            localization: {select: '파일 선택', statusUploaded: "완료.", statusFailed: "업로드 실패."},
            async: {
                saveUrl: "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/save_my_attachment.do",
                autoUpload: true
            },
            upload: function (e) {
                e.data = {objectType: objectType, objectId: $(`#objectId_${this.uniqueId2}`).val()};
            },
            error: function (e) {
            },
            success: function (e) {
                $(`#${this.uniqueId2}`).data('kendoGrid').dataSource.read();

                if (objectType == "52") {		//썸네일
                    $("#thumbnailId").val(e.response.attachmentId);
                }
            },
            select: function (e) {
                var gridSize = $(`#${this.uniqueId2}`).data("kendoGrid").dataSource.data().length;

                if (gridSize > 0) {
                    e.preventDefault();
                    alert("이미 등록된 파일을 삭제 후 다시 시도해주세요.");
                } else {
                    $.each(e.files, function (index, value) {
                        if (value.size > 10485760) {
                            e.preventDefault();
                            alert("파일 사이즈는 10M로 제한되어 있습니다.");
                        } else {
                            if(type == "img") {
                                if (![".JPG", ".jpg", ".GIF", ".gif", ".PNG", ".png"].includes(value.extension)) {
                                    e.preventDefault();
                                    alert("이미지 파일만 선택해주세요.");
                                }
                            } else if(type == "file") {
                                const allowedExtensions = [
                                    ".HWP", ".hwp", ".DOC", ".doc", ".PPT", ".ppt", ".XLS", ".xls",
                                    ".PDF", ".pdf", ".DOCX", ".docx", ".PPTX", ".pptx", ".XLSX", ".xlsx",
                                    ".TXT", ".txt", ".ZIP", ".zip", ".JPG", ".jpg", ".JPEG", ".jpeg",
                                    ".GIF", ".gif", ".BMP", ".bmp", ".PNG", ".png"
                                ];
                                if (!allowedExtensions.includes(value.extension)) {
                                    e.preventDefault();
                                    alert("업로드가 허용된 형식의 파일만 선택해주세요.\n가능한 파일확장자: hwp, doc, ppt, xls, pdf, docx, pptx, xlsx, txt, zip, jpg, jpeg, gif, bmp, png");
                                }
                            } else if(type == "video") {
                                if (![".avi", ".mpg", ".mpeg", ".mpe", ".wmv", ".mov", ".mp4", ".mkv", ".jpeg"].includes(value.extension.toLowerCase())) {
                                    e.preventDefault();
                                    alert("동영상 파일만 업로드 할 수 있습니다.");
                                }
                            }

                        }
                    });
                }
            }
        });
        $(`#${this.uniqueId}`).removeClass('hide');


        $(this.querySelector(`#${this.uniqueId2}`)).kendoGrid({
            dataSource: fileGridData,
            pageable: false,
            selectable: false,
            scrollable: false,
            editable: false,
            columns: [
                { field: "name" },
                { field: "size" }
            ],
            rowTemplate: kendo.template($("#fileList").html()),
            noRecords: {
                template: "<div class='not-data-cont'><span>파일이 존재하지 않습니다.</span></div>"
            }
        });
    }


}

// 그리드 형식 업로드
const uploadGridTemplate = document.createElement('template');
uploadGridTemplate.innerHTML = `
    
    <div class="hide grid-file-upload"></div>
    <div class="file-grid gird-file-list"></div>
`;

class podoGridUpload extends HTMLElement {
    // 클래스의 정적 변수로 counter를 선언하여 순차적 ID 부여
    static gridCounter = 1;
    static gridCounter2 = 1;    // 파일업로드 템플릿 id

    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
        this.appendChild(uploadGridTemplate.content.cloneNode(true));
        // 속성에서 ID 값을 가져오고, 없으면 순차적 ID 사용
        this.uniqueId = this.getAttribute('upload-id') || `grid_file_upload${podoGridUpload.uploadCounter}`;
        this.uniqueId2 = this.getAttribute('list-id') || `grid_file${podoGridUpload.uploadCounter}`;

        // 속성에 지정되지 않은 경우에만 카운터 증가
        if (!this.getAttribute('upload-id')) {
            podoGridUpload.uploadCounter++;
        }

        this.upload = this.querySelector(".grid-file-upload");
        this.grid = this.querySelector(".gird-file-list");
        this.upload.setAttribute("id", this.uniqueId);
        this.grid.setAttribute("id", this.uniqueId2);

    }

    // 감시할 속성 목록을 반환
    static get observedAttributes() {
        return ['type'];
    }

    // 속성이 변경될 때마다 호출되는 메서드
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type') {
            console.log('Type attribute changed:', newValue);
            // 속성 값에 따른 처리를 여기서 수행할 수 있음
        }
    }

    connectedCallback() {
        const type = this.getAttribute('type'); // 초기 값 가져오기
        console.log('Initial type:', type);
        // 초기 값에 따른 처리를 여기서 수행할 수 있음

        const objectType = $(`#objectType_${this.uniqueId2}`).val();

        if ($(`#${this.uniqueId}`).text().length == 0) {
            $(`#${this.uniqueId}`).html(`
                <input name="grid_upload_file" id="grid_upload_file_${this.uniqueId2}" type="file"/>
            `);
        }

        $(`#grid_upload_file_${this.uniqueId2}`).kendoUpload({
            showFileList: false,
            width: 500,
            multiple: false,
            localization: {select: '파일 선택', statusUploaded: "완료.", statusFailed: "업로드 실패."},
            async: {
                saveUrl: "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/save_my_attachment.do",
                autoUpload: true
            },
            upload: function (e) {
                e.data = {objectType: objectType, objectId: $(`#objectId_${this.uniqueId2}`).val()};
            },
            error: function (e) {
            },
            success: function (e) {
                $(`#${this.uniqueId2}`).data('kendoGrid').dataSource.read();

                if (objectType == "52") {		//썸네일
                    $("#thumbnailId").val(e.response.attachmentId);
                }
            },
            select: function (e) {
                var gridSize = $(`#${this.uniqueId2}`).data("kendoGrid").dataSource.data().length;

                if (gridSize > 0) {
                    e.preventDefault();
                    alert("이미 등록된 파일을 삭제 후 다시 시도해주세요.");
                } else {
                    $.each(e.files, function (index, value) {
                        if (value.size > 10485760) {
                            e.preventDefault();
                            alert("파일 사이즈는 10M로 제한되어 있습니다.");
                        } else {
                            if(type == "img") {
                                if (![".JPG", ".jpg", ".GIF", ".gif", ".PNG", ".png"].includes(value.extension)) {
                                    e.preventDefault();
                                    alert("이미지 파일만 선택해주세요.");
                                }
                            } else if(type == "file") {
                                const allowedExtensions = [
                                    ".HWP", ".hwp", ".DOC", ".doc", ".PPT", ".ppt", ".XLS", ".xls",
                                    ".PDF", ".pdf", ".DOCX", ".docx", ".PPTX", ".pptx", ".XLSX", ".xlsx",
                                    ".TXT", ".txt", ".ZIP", ".zip", ".JPG", ".jpg", ".JPEG", ".jpeg",
                                    ".GIF", ".gif", ".BMP", ".bmp", ".PNG", ".png"
                                ];
                                if (!allowedExtensions.includes(value.extension)) {
                                    e.preventDefault();
                                    alert("업로드가 허용된 형식의 파일만 선택해주세요.\n가능한 파일확장자: hwp, doc, ppt, xls, pdf, docx, pptx, xlsx, txt, zip, jpg, jpeg, gif, bmp, png");
                                }
                            } else if(type == "video") {
                                if (![".avi", ".mpg", ".mpeg", ".mpe", ".wmv", ".mov", ".mp4", ".mkv", ".jpeg"].includes(value.extension.toLowerCase())) {
                                    e.preventDefault();
                                    alert("동영상 파일만 업로드 할 수 있습니다.");
                                }
                            }
                        }
                    });
                }
            }
        });
        $(`#${this.uniqueId}`).removeClass('hide');


        $(this.querySelector(`#${this.uniqueId2}`)).kendoGrid({
            dataSource: fileGridData,
            // dataSource: {
            //     transport: {
            //         read: { url:"<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/list_my_attachments.do", type: 'POST' },
            //         destroy: { url:"<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/delete_my_attachment.do", type:'POST' },
            //         parameterMap: function (options, operation){
            //             if (operation != "read" && options) {
            //                 return { objectType: objectType, objectId: $(`#objectId_${this.uniqueId2}`).val(), attachmentId: options.attachmentId};
            //             }else{
            //                 return { objectType: objectType, objectId: $(`#objectId_${this.uniqueId2}`).val(), startIndex: options.skip, pageSize: options.pageSize };
            //             }
            //         }
            //     },
            //     schema: {
            //         model: Attachment,
            //         data : "items"
            //     }
            // },
            pageable: false,
            selectable: false,
            columns: [
                {
                    field: "name",
                    title: "파일명",
                    width: "120px",
                    headerAttributes:{"class":"table-header-cell", style:"text-align: center;"},
                    attributes:{"class":"table-cell", style:"text-align: left;"}
                },
                {
                    field: "size",
                    title: "크기(byte)",
                    format: "{0:##,###}",
                    headerAttributes:{"class":"table-header-cell", style:"text-align: center;"},
                    width: "100px"
                },
                {
                    width: "160px",
                    template: function(dataItem){
                        return "<div class='grid-btn-box'>" +
                            "<button type='button' onclick=\"location.href='<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/download_my_attachment.do?attachmentId="+dataItem.attachmentId+"'\" " +
                            "class=\"btn_inner k-button\" style=\"text-decoration:none\"><span>다운로드</span></button>"+
                            "<button type='button' class=\"btn_inner k-button\" onclick=\"deleteFile('"+objectType+"', "+dataItem.attachmentId+", '"+`${this.uniqueId2}`+"')\"><span>삭제</span></button></div>"
                    }
                }
            ],
            editable: false,
            noRecords: {
                template: "<div class='not-data-cont'><span>파일이 존재하지 않습니다.</span></div>"
            }
        });
    }
}

// 썸네일 형식 업로드
const uploadThumbnailTemplate = document.createElement('template');
uploadThumbnailTemplate.innerHTML = `
<!--    <div class="img-zone-wrap">-->
<!--        <div class="thumbnail-zone img-zone">-->
<!--            <div class="img-box" id="thumbnailImg"></div>-->
<!--            <button type="button" class="select-img" onclick="selectImgPop('1');">이미지 선택</button>-->
<!--        </div>-->
<!--        <div class="tip-box">-->
<!--            <span>Tip</span>-->
<!--            <ul>-->
<!--                <li>1. 해당 과정의 썸네일 이미지가 있을 경우 아래에서 [파일선택]을 통해 업로드 합니다.</li>-->
<!--                <li>2. 만일 썸네일 이미지가 없을 경우 이미지선택을 통해 이미지 풀에서 가져다 쓸 수 있습니다.</li>-->
<!--                <li>3. 이미지 제작에 관해선 헬프데스크(070-7432-2657)로 문의 주시기 바랍니다.</li>-->
<!--            </ul>-->
<!--        </div>-->
    </div>
    <div class="hide thumbnail-file-upload"></div>
    <div class="file-grid thumbnail-grid"></div>
    
    <!-- 이미지 선택 팝업 -->
    <div id="select_img_window" style="display: none;">
        <div class="popup-content">
            <div id="selectImgGrid"></div>
        </div>
    </div><!-- #select_img_window -->
<!-- //이미지 선택 팝업 -->

<!-- 이미지 원본보기 팝업 -->
<div id="original_size_window" style="display: none;">
    <img id="originalImg" src="" alt="이미지 원본" />
</div><!-- #original_size -->
<!-- //이미지 원본보기 팝업 -->
`;

class podoThumbnailUpload extends HTMLElement {
    // 클래스의 정적 변수로 counter 선언하여 순차적 ID 부여
    static thumbnailCounter = 1;
    static thumbnailCounter2 = 1;    // 파일업로드 템플릿 id

    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
        this.appendChild(uploadThumbnailTemplate.content.cloneNode(true));
        // 순차적 ID 설정
        this.uniqueId = `thumbnail_file_upload${podoThumbnailUpload.thumbnailCounter}`;
        this.uniqueId2 = `thumbnail_file_grid${podoThumbnailUpload.thumbnailCounter}`;
        podoThumbnailUpload.thumbnailCounter++; // ID가 사용될 때마다 thumbnailCounter 증가
        podoThumbnailUpload.thumbnailCounter2++; // ID가 사용될 때마다 thumbnailCounter 증가
        this.upload = this.querySelector(".thumbnail-file-upload");
        this.grid = this.querySelector(".thumbnail-grid");
        this.upload.setAttribute("id", this.uniqueId); // 고유한 ID 설정
        this.grid.setAttribute("id", this.uniqueId2); // 고유한 ID 설정
    }

    connectedCallback() {
        // 파일업로드 템플릿

        const objectType = $(`#objectType${podoThumbnailUpload.thumbnailCounter2}`).val();

        if ($(`#${this.uniqueId}`).text().length == 0) {
            $(`#${this.uniqueId}`).html(`
                <input name="thumbnail_upload_file" id="thumbnail_upload_file${podoThumbnailUpload.thumbnailCounter2}" type="file"/>
            `);
        }

        $(`#thumbnail_upload_file${podoThumbnailUpload.thumbnailCounter2}`).kendoUpload({
            showFileList: false,
            width: 500,
            multiple: false,
            localization: {select: '파일 선택', statusUploaded: "완료.", statusFailed: "업로드 실패."},
            async: {
                saveUrl: "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/save_my_attachment.do",
                autoUpload: true
            },
            upload: function (e) {
                e.data = {objectType: objectType, objectId: $(`#objectId${podoThumbnailUpload.thumbnailCounter2}`).val()};
            },
            error: function (e) {
            },
            success: function (e) {
                $(`#${this.uniqueId2}`).data('kendoGrid').dataSource.read();

                if(objType == "52"){		//썸네일
                    $("#thumbnailImg").empty();
                    $("#thumbnailImg").append("<img src='/comm/files/"+ e.response.attachmentId +"' />");
                    $("#thumbnailId").val(e.response.attachmentId);
                } else if(objType == "53"){
                    $("#detailImg").empty();
                    $("#detailImg").append("<img src='/comm/files/"+ e.response.attachmentId +"' />");
                    $("#detailId").val(e.response.attachmentId);
                }
            },
            select: function (e) {
                var loginLogoFileGirdSize = $(`#${this.uniqueId2}`).data("kendoGrid").dataSource.data().length;

                if (loginLogoFileGirdSize > 0) {
                    e.preventDefault();
                    alert("이미 등록된 파일을 삭제 후 다시 시도해주세요.");
                } else {
                    $.each(e.files, function (index, value) {
                        if (value.size > 10485760) {
                            e.preventDefault();
                            alert("파일 사이즈는 10M로 제한되어 있습니다.");
                        } else {
                            if(value.extension != ".JPG" && value.extension != ".jpg"
                                && value.extension != ".JPEG" && value.extension != ".jpeg"
                                && value.extension != ".GIF" && value.extension != ".gif"
                                && value.extension != ".BMP" && value.extension != ".bmp"
                                && value.extension != ".PNG" && value.extension != ".png") {
                                e.preventDefault();
                                alert("이미지 파일만 선택해주세요.");
                            }
                        }
                    });
                }
            }
        });
        $(`#${this.uniqueId}`).removeClass('hide');


        $(this.querySelector(`#${this.uniqueId2}`)).kendoGrid({
            dataSource: fileGridData,
            // dataSource: {
            //     transport: {
            //         read: { url:"<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/list_my_attachments.do", type: 'POST' },
            //         destroy: { url:"<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/delete_my_attachment.do", type:'POST' },
            //         parameterMap: function (options, operation){
            //             if (operation != "read" && options) {
            //                 return { objectType: objectType, objectId: $(`#objectId${podoThumbnailUpload.thumbnailCounter2}`).val(), attachmentId: options.attachmentId};
            //             }else{
            //                 return { objectType: objectType, objectId: $(`#objectId${podoThumbnailUpload.thumbnailCounter2}`).val(), startIndex: options.skip, pageSize: options.pageSize };
            //             }
            //         }
            //     },
            //     schema: {
            //         model: Attachment,
            //         data : "items"
            //     }
            // },
            pageable: false,
            selectable: false,
            columns: [
                {
                    field: "name",
                    title: "파일명",
                    width: "120px",
                    headerAttributes:{"class":"table-header-cell", style:"text-align: center;"},
                    attributes:{"class":"table-cell", style:"text-align: left;"}
                },
                {
                    field: "size",
                    title: "크기(byte)",
                    format: "{0:##,###}",
                    headerAttributes:{"class":"table-header-cell", style:"text-align: center;"},
                    width: "100px"
                },
                {
                    width: "160px",
                    template: function(dataItem){
                        return "<div class='grid-btn-box'>" +
                            "<button type='button' onclick=\"location.href='<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/download_my_attachment.do?attachmentId="+dataItem.attachmentId+"'\" " +
                            "class=\"btn_inner k-button\" style=\"text-decoration:none\"><span>다운로드</span></button>"+
                            "<button type='button' class=\"btn_inner k-button\" onclick=\"deleteFileImg('"+objectType+"', "+dataItem.attachmentId+", '"+`${this.uniqueId2}`+"')\"><span>삭제</span></button></div>"
                    }
                }
            ],
            editable: false,
            noRecords: {
                template: "<div class='not-data-cont'><span>파일이 존재하지 않습니다.</span></div>"
            }
        });
    }
}

customElements.define("podo-upload", podoUpload);
customElements.define("podo-grid-upload", podoGridUpload);
customElements.define("podo-thumbnail-upload", podoThumbnailUpload);

function deleteFile(attachmentId, gname) {
    console.log(`파일 삭제: ${attachmentId}, ${gname}`);
    // if (confirm("첨부파일을 삭제 하시겠습니까?")) { //첨부파일을 삭제 하시겠습니까?
    //     //로딩바 생성.
    //     //loadingOpen();
    //     $.ajax({
    //         type: 'POST',
    //         url: '<%=com.podosw.web.util.ServletUtils.getContextPath(request)%>/comm/delete_my_attachment.do?output=json',
    //         data: {attachmentId: attachmentId},
    //         success: function (response) {
    //             $("#"+gname).data('kendoGrid').dataSource.read();
    //             //loadingClose();
    //
    //         },
    //         error: podo.ui.handleAjaxError,
    //         complete: function (xhr, statusText) {
    //             //로딩바 제거.
    //             //loadingClose();
    //         },
    //         dataType: "json"
    //     });
    // }
}

// 썸네일 첨부파일 삭제.
function deleteFileImg (objType, attachmentId , gname){
    if (confirm("첨부파일을 삭제 하시겠습니까?")) {
        //로딩바 생성.
        //loadingOpen();
        $.ajax({
            type: 'POST',
            url: '<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/delete_my_attachment.do?output=json',
            data: {attachmentId: attachmentId},
            success: function (response) {
                $("#"+gname).data('kendoGrid').dataSource.read();

                if(objType == "52"){
                    $("#thumbnail_file_upload .k-upload-status").text("");

                    $("#thumbnailImg").empty();
                    $("#thumbnailId").val("");
                }else if(objType == "53"){
                    $("#detail_file_upload .k-upload-status").text("");

                    $("#detailImg").empty();
                    $("#detailId").val("");
                }
                emptyImg();
            },
            error : podo.ui.handleAjaxError,
            dataType : "json"
        });
    }
}

//빈이미지 체크
function emptyImg(){
    var emptyImg = "";

    emptyImg += "<div class='empty-img'>";
    emptyImg += "	<img src='/images/renewal/admin/img_empty.png' alt='선택된 이미지가 없습니다.'/>";
    emptyImg += "	<p>선택된 이미지가 없습니다.</p>";
    emptyImg += "</div>";

    if( !$.trim( $('#thumbnailImg').html() ).length ) {
        $("#thumbnailImg").empty();
        $("#thumbnailImg").append(emptyImg);
    }
    if( !$.trim( $('#detailImg').html() ).length ) {
        $("#detailImg").append(emptyImg);
    }
}

function imgBoxCheck(){
    if($("#thumbnail_file_grid").data("kendoGrid").dataSource.data().length > 0){
        var thumAttachId = $("#thumbnail_file_grid").data("kendoGrid").dataItem("tbody tr:eq(0)").attachmentId;
        $("#thumbnailImg").empty();
        $("#thumbnailImg").append("<img id='selectImg' src='/comm/files/"+ thumAttachId +"' />");
    }else if($("#thumbnailId").val() !== ""){
        $("#thumbnailImg").empty();
        $("#thumbnailImg").append("<img id='selectImg' src='/comm/files/"+ $("#thumbnailId").val() +"' />");
    }else{
        $("#thumbnailImg").empty();
    }

    if($("#detail_file_grid").data("kendoGrid").dataSource.data().length > 0){
        var detAttachId = $("#detail_file_grid").data("kendoGrid").dataItem("tbody tr:eq(0)").attachmentId;
        $("#detailImg").empty();
        $("#detailImg").append("<img id='selectImg' src='/comm/files/"+ detAttachId +"' />");
    }else if($("#detailId").val() !== ""){
        $("#detailImg").empty();
        $("#detailImg").append("<img id='selectImg' src='/comm/files/"+ $("#detailId").val() +"' />");
    }else{
        $("#detailImg").empty();
    }
}

//썸네일,상세 이미지선텍
function selectImgPop(type, count){
    if(type == "1"){
        //첨부된 썸네일 이미지 체크
        if($("#thumbnail_file_grid"+count).data('kendoGrid').dataSource.data().length > 0){
            alert("첨부된 이미지를 삭제해주세요.");
            return false;
        }

        var imgAlt = "썸네일 이미지";
        $("#thumbnailImg").empty();
    }else if(type == "2"){
        //첨부된 상세 이미지 체크
        if($("#thumbnail_file_grid"+count).data('kendoGrid').dataSource.data().length > 0){
            alert("첨부된 이미지를 삭제해주세요.");
            return false;
        }

        var imgAlt = "상세 이미지";
        $("#detailImg").empty();
    }

    $("#select_img_window").kendoWindow({
        width: "900px",
        height: "510px",
        reisze: false,
        title: "이미지 선택",
        modal: true,
        visible: false
    }).data('kendoWindow').center().open();

    //이미지 선택 그리드
    $("#selectImgGrid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/operator/sbjct/get_sbjct_img_pool_list.do",
                    type: "POST", dataType: 'json'
                },
                parameterMap: function (options, operation) {
                    return { IMG_TYPE : type }
                }
            },
            schema: {
                total: "totalCount",
                data: "items",
                model: {
                    id: "IMG_TYPE",
                    fields: {
                        ATTACHMENT_ID: {type: "string"},
                        IMG_SEQ: {type: "string"},
                        IMG_TYPE: {type: "number"},
                        IMG_CATEGORY: {type: "string"},
                        OBJECT_TYPE: {type: "string"},
                        OBJECT_ID: {type: "string"}
                    }
                }
            },
            pageSize: 3,
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },
        columns: [
            {
                title: "선택",
                width: 80,
                filterable: false,
                sortable: false,
                headerAttributes: {"class": "table-header-cell", style: "text-align: center;"},
                attributes: {"class": "table-cell", style: "text-align: center;"},
                template: "<button type='button' class='btn_input' onclick='selectImg(#:ATTACHMENT_ID#, #:IMG_TYPE#);'>선택</button>"
            },
            {
                title: "이미지",
                width: 250,
                filterable: false,
                sortable: false,
                headerAttributes: {"class": "table-header-cell", style: "text-align: center;"},
                attributes: {"class": "table-cell", style: "text-align: center;"},
                template: "<a href='javascript: originalSize(#:ATTACHMENT_ID#);'><img src='/comm/files/#:ATTACHMENT_ID#' alt='#:IMG_CATEGORY#' style='height: 100px;'/></a>"
            },
            {
                field: "IMG_CATEGORY",
                title: "교육분류",
                width: 400,
                headerAttributes: {"class": "table-header-cell", style: "text-align: center;"},
                attributes: {"class": "table-cell", style: "text-align: left;"},
            }
        ],
        filterable: true,
        filterable: {
            extra : false,
            messages : {filter : "필터", clear : "초기화"},
            operators : {
                string : { contains : "포함", startswith : "시작문자", eq : "동일단어" },
                number : { eq : "같음", gte : "이상", lte : "이하"}
            }
        },
        pageable: true,
        pageable : {
            refresh : false,
            responsive: false,
            buttonCount: 5,
            pageSizes :[10,20,30],
        },
        height: 480,
        noRecords : {
            template: "<div class='not-data-cont'><span>과정이미지 목록이 존재하지 않습니다.</span></div>"
        }
    });
}

//이미지 선택
function selectImg(attachmentId, imgType){

    var imgHtml = "";

    imgHtml += "<img id='selectImg' src='/comm/files/"+ attachmentId +"' />"

    if(imgType == "1"){
        $("#thumbnailImg").append(imgHtml);
        $("#thumbnailId").val(attachmentId);
    }else if(imgType == "2"){
        $("#detailImg").append(imgHtml);
        $("#detailId").val(attachmentId)
    }

    $("#select_img_window").data("kendoWindow").close();
}

//이미지 원본사이즈
function originalSize(attachmentId){
    $("#original_size_window").kendoWindow({
        width:"750px",
        height: "600px",
        resizable : false,
        title : "이미지 실사이즈",
        modal: true,
        visible: false
    });

    $("#original_size_window").data("kendoWindow").center();
    $("#original_size_window").data("kendoWindow").open();

    $("#originalImg").attr('src','/comm/files/'+attachmentId);
}