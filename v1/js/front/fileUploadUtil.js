/**
 * 파일 업로드/결과
 *  fn.kendoOnlyPopup('#아이디');
 */
var winElement;
var fn = (function () {
    'use strict';

    return {
        /* 첨부파일 그리드 */
        fileGridDef: function (gridNm, objType, objectId) {
            $("#"+gridNm).kendoGrid({
                dataSource: {
                    transport: {
                        read: { url:"/comm/list_my_attachments.do", type: 'POST', dataType:"json" },
                        destroy: { url:"/comm/delete_my_attachment.do", type:'POST', dataType:"json" },
                        parameterMap: function (options, operation){
                            if (operation != "read" && options) {
                                return { objectType: objType, objectId:objectId, attachmentId :options.attachmentId };
                            }else{
                                return { objectType: objType, objectId:objectId, startIndex: options.skip, pageSize: options.pageSize };
                            }
                        }
                    },
                    schema: {
                        model: Attachment,
                        data : "items"
                    },
                },
                pageable: false,
                selectable: false,
                columns: [
                    {
                        field: "name",
                        title: "파일명",
                        width: "120px",
                        headerAttributes:{"class":"table-header-cell", style:"text-align:center"},
                        attributes:{"class":"table-cell", style:"text-align:left"}
                    },
                    {
                        field: "size",
                        title: "크기(byte)",
                        format: "{0:##,###}",
                        headerAttributes:{"class":"table-header-cell", style:"text-align:center"},
                        width: "100px"
                    },
                    {
                        width: "160px" ,
                        template: function(dataItem){
                            return "<div class=\"grid-btn-box\"><button onclick=\"location.href='/comm/download_my_attachment.do?attachmentId="+dataItem.attachmentId+"'\" class=\"btn_inner k-button k-grid-edit\" style=\"text-decoration:none\"><span>다운로드</span></button>"+
                                "<button class=\"btn_inner k-button k-grid-delete\" onclick=\"deleteFile("+dataItem.attachmentId+", '"+gridNm+"')\"><span>삭제</span></button></div>";
                        }
                    }
                ],
                noRecords : {
                    template: "<div class='not-data-cont'><span>파일이 존재하지 않습니다.</span></div>"
                }
            });
        },

        /* 첨부파일 리스트 */
        fileListDef: function (gridNm, objType, objectId, listTemp) {
            $("#"+gridNm).kendoGrid({
                dataSource: {
                    transport: {
                        read: { url: "/comm/list_my_attachments.do?output=json", type: 'POST', dataType:"json" },
                        destroy: { url: "/comm/delete_my_attachment.do?output=json", type:'POST', dataType:"json" },
                        parameterMap: function (options, operation){
                            if (operation != "read" && options) {
                                return { objectType: objType, objectId:objectId, attachmentId :options.attachmentId };
                            }else{
                                return { objectType: objType, objectId:objectId, startIndex: options.skip, pageSize: options.pageSize };
                            }
                        }
                    },
                    schema: {
                        model: Attachment,
                        data : "items"
                    },
                },
                pageable: false,
                selectable: false,
                scrollable: false,
                columns: [
                    { field: "name" },
                    { field: "size" },
                ],
                rowTemplate: kendo.template($("#"+listTemp).html()),
                // noRecords: {
                //     template: "<div class='file-empty'><p>첨부파일이 없습니다.</p></div>"
                // }

            });
        },

        /** 첨부파일 업로드 컴포넌트 정의
        *   option  = 파일제한
         *   lang   = 최소 업로드갯수
         */
        fileUploaderDef: function (fileUploadDivTagId, uploadWindowId, objType, fileUploadTemplateId, uploadFileId, fileGridId, objectId, option, lang) {
            if( $('#'+fileUploadDivTagId).text().length == 0  ) {
                var template = kendo.template($("#"+fileUploadTemplateId).html());
                $('#'+fileUploadDivTagId).html(template({}));
            }
            $("#"+uploadFileId).kendoUpload({
                showFileList : false,
                width : 500,
                multiple : false,
                localization:{ select : '파일 선택' , statusUploaded: "완료.", statusFailed : "업로드 실패." },
                async: {
                    saveUrl:  "/comm/save_my_attachments.do",
                    autoUpload: true
                },
                upload: function (e) {
                    e.data = {objectType: objType, objectId:objectId};
                },
                error : function (e){},
                success : function(e){
                    handleCallbackUploadResult( fileGridId );
                },
                select: function(e){
                    var loginLogoFileGirdSize = $("#"+fileGridId).data("kendoGrid").dataSource.data().length;

                    if(loginLogoFileGirdSize>0 && lang == 1){
                        e.preventDefault();
                        alert("이미 등록된 파일을 삭제 후 다시 시도해주세요.");
                    }else{
                        $.each(e.files, function(index, value) {
                            if(value.size>10485760){
                                e.preventDefault();
                                alert("파일 사이즈는 10M로 제한되어 있습니다.");
                            }else{
                                if(option == "img") {
                                    if(value.extension != ".JPG" && value.extension != ".jpg"
                                        && value.extension != ".GIF" && value.extension != ".gif"
                                        && value.extension != ".BMP" && value.extension != ".bmp"
                                        && value.extension != ".PNG" && value.extension != ".png") {
                                        e.preventDefault();
                                        alert("이미지 파일만 선택해주세요.");
                                    }
                                } else if(option == "video") {
                                    if(value.extension != ".HWP" && value.extension != ".hwp"
                                        && value.extension != ".DOC" && value.extension != ".doc"
                                        && value.extension != ".PPT" && value.extension != ".ppt"
                                        && value.extension != ".PPTX" && value.extension != ".pptx"
                                        && value.extension != ".XLS" && value.extension != ".xls"
                                        && value.extension != ".PDF" && value.extension != ".pdf"
                                        && value.extension != ".DOCX" && value.extension != ".docx"
                                        && value.extension != ".PPTX" && value.extension != ".ppt"
                                        && value.extension != ".XLSX" && value.extension != ".xlsx"
                                        && value.extension != ".TXT" && value.extension != ".txt"
                                        && value.extension != ".ZIP" && value.extension != ".zip"
                                        && value.extension != ".JPG" && value.extension != ".jpg"
                                        && value.extension != ".JPEG" && value.extension != ".jpeg"
                                        && value.extension != ".GIF" && value.extension != ".gif"
                                        && value.extension != ".BMP" && value.extension != ".bmp"
                                        && value.extension != ".PNG" && value.extension != ".png") {

                                        e.preventDefault();
                                        alert("업로드가 허용된 형식의 파일만 선택해주세요.\n가능한 파일확장자:hwp, doc, ppt, xls, pdf, docx, pptx, xlsx, txt, zip, jpg, jpeg, gif, bmp, png");
                                    }
                                } else {
                                    if(value.extension != ".HWP" && value.extension != ".hwp"
                                        && value.extension != ".HWPX" && value.extension != ".hwpx"
                                        && value.extension != ".TXT" && value.extension != ".txt"
                                        && value.extension != ".PDF" && value.extension != ".pdf"
                                        && value.extension != ".PPTX" && value.extension != ".pptx"
                                        && value.extension != ".XLSX" && value.extension != ".xlsx"
                                        && value.extension != ".DOCX" && value.extension != ".docx"
                                        && value.extension != ".JPG" && value.extension != ".jpg"
                                        && value.extension != ".JPEG" && value.extension != ".jpeg"
                                        && value.extension != ".PNG" && value.extension != ".png"
                                        && value.extension != ".ZIP" && value.extension != ".zip"
                                        && value.extension != ".AVI" && value.extension != ".avi"
                                        && value.extension != ".MPEG4" && value.extension != ".mpeg4"
                                        && value.extension != ".MP4" && value.extension != ".mp4"
                                        && value.extension != ".MOV" && value.extension != ".mov"
                                        && value.extension != ".WMV" && value.extension != ".wmv"
                                        && value.extension != ".FLV" && value.extension != ".flv"
                                        && value.extension != ".ASF" && value.extension != ".asf") {
                                        e.preventDefault();
                                        alert("파일은 hwp, hwpx, txt, pdf, pptx, xlsx, docx, jpg, jpeg, png, zip, AVI, MPEG4(MP4), MOV, WMV, FLV, ASF만 업로드 가능합니다.\n파일 확장자를 확인하십시오.");
                                    }
                                }
                            }
                        });
                    }
                }
            });
            $("#"+fileUploadDivTagId).removeClass('hide');
        }
    }
})();

//첨부파일 버전 체크
function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function handleCallbackUploadResult(gridNm){
    $("#"+gridNm).data('kendoGrid').dataSource.read();
}

//첨부파일 다운
function downloadFile (attachmentId){
    location.href = "/download-my-attachment.do?attachmentId="+attachmentId;
}

//첨부파일 삭제.
function deleteFile (attachmentId, gridNm){
    if(confirm("삭제하시겠습니까?")){
        $.ajax({
            type : 'POST',
            url : "/comm/delete_my_attachment.do?output=json",
            data : { attachmentId : attachmentId },
            success : function(response){
                handleCallbackUploadResult(gridNm);

                $(".k-dropzone .k-dropzone-hint .k-upload-status").empty();
            },
            dataType : "json"
        });
    }
}