
/**
 * 공통
 *  fn.kendoOnlyPopup('#아이디');
 */
var winElement;
var fn = (function () {
    'use strict';

    return {
        /* 로딩바 정의 */
        loadingDefine: function () {
            //로딩바윈도우
            if (!$("#loading-window").data("kendoWindow")) {
                winElement = $("#loading-window").kendoWindow({
                    width: "215px",
                    height: "73px",
                    minHeight: "60px",
                    resizable: false,
                    title: false,
                    modal: true,
                    visible: false
                });

                winElement.animation = { open: { effects: "fadeIn" }, close: { effects: "fadeIn", reverse: true } };
                winElement.css("overflow", "hidden !important");
            }
        },

        /* 로딩바 생성 */
        loadingOpen: function () {
            $("#loading-window").data("kendoWindow").center();
            $("#loading-window").data("kendoWindow").open();
            winElement.append(fn.loadingElement());
        },

        /* 로딩바 제거 */
        loadingClose: function () {
            winElement.find(".k-loading-mask").remove();
            $("#loading-window").data("kendoWindow").close();
        },

        /* 로딩바 */
        loadingElement: function () {
            return $("<img class=\"k-loading-mask\" src=\"/images/runway/loading.gif\">");
        },

        /* 팝업 생성 */
        kendoPopup: function (obj, title, w, h, option) {
            var isOption = option;

            if(!isOption) {
                isOption = {
                    width : w,
                    height: h,
                    resizable : false,
                    title : title,
                    modal : true,
                    visible : false
                }
            }

            console.log("id ::", obj, "제목 ::", title, "가로 ::", w, "높이 ::", h, "옵션 ::", isOption);
            if (!$("#"+obj).data("kendoWindow")) {

                $("#"+obj).kendoWindow(isOption);
            }
        },

        /* 팝업 열기 */
        kendoPopupOpen: function (obj) {
            $("#"+obj).data("kendoWindow").center();
            $("#"+obj).data("kendoWindow").open();
        },

        /* 팝업 닫기 */
        kendoPopupClose: function (obj) {
            $("#"+obj).data("kendoWindow").close();
        },

        /* 과제 팝업 오픈 */
        hwPopup: function (openNum, hwNum) {
            fn.kendoPopupOpen('kendoHwPopup');

            fn.hwContDraw(openNum, hwNum);

        },

        /* 과제 그리기 */
        hwContDraw: function (openNum, hwNum) {
            $("#stare_task_content").empty();

            var html = "";
            var obj = {
                HW_NUM: 1,
                SUBJECT_NAME: "과정명",
                HW_CONTENT: ""
            };

            html += "<div class='hw-box'>";
            html += "   <input type='hidden' id='hwNum' value='"+obj.HW_NUM+"' />";
            html += "   <div class='hw-top'>";
            html += "       <h3>"+obj.SUBJECT_NAME+" 과제</h3>";
            html += "       <div class='hw-date'>";
//                         if(comStdPrdRstrYn == "Y"){
//                         	html += "           <p>제출 기간 <strong>"+obj.HW_PRD+"</strong></p>";
//                         }else{
//                         	html += "           <p>제출 진도율 <strong>"+obj.PGS_RT+"%</strong></p>";
//                         }
//                         if(taskInfo.HW_NOTI_FILE_CNT > 0) {
//                             html += "       <button type='button' class='btn' onclick='notiDownload("+taskInfo.FILE_LIST[0].ATTACHMENT_ID+");'><span>유의사항 다운로드</span></button>";
//                         }
            html += "       </div>";
            html += "   </div>";
            html += "   <div class='hw-cont'>";
            if(obj.HW_CONTENT != "" || obj.HW_CONTENT != null) {
                html += "       <p>" + dataToHtml(obj.HW_CONTENT) + "</p>";
            } else {
                html += "       <p></p>";
            }
            html += "   </div>";
//                         if(taskInfo.NOTI != "" && taskInfo.NOTI != null && taskInfo.NOTI != "null") {
//                             html += "   <div class='hw-cont'>";
//                             html += "       <p>"+dataToHtml(taskInfo.NOTI)+"</p>";
//                             html += "   </div>";
//                         }

            var hwAnswer = "";
            html += "   <textarea name='hwAnswer' id='hwAnswer' class='k-textbox width100' style='height: 130px;' placeholder='내용을 입력해주세요.'>"+hwAnswer+"</textarea>";
//                         html += "   <p class='col-red import-txt'><i class='icon import-red'></i>업로드 가능한 확장자: "+taskInfo.FILE_EXTS+"</p>";
            html += "   <div class='file-box custom-file-box'>";
            html += "       <div id='hw-file-upload'><input type='file' id='hwFileUpload' name='hwFileUpload' /></div>";
            html += "       <div id='hw_file_list' class='file-template file-list-wrap'></div>";
            html += "       <p class='file-import-text'>" +
                "<i class='icon-'></i>" +
                "업로드 가능한 확장자 (pdf,xls,xlsx,hwp,txt,doc,docx,ppt,pptx,png,jpg,jpeg,gif,mp3,mp4,avi,wav,zip)" +
                "</p>";
            html += "   </div>";

            html += "</div>";

            $("#stare_task_content").html(html);

//             $.ajax({
//                 type : 'POST',
//                 url : '<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/service/em/get_std_hw_info.do',
//                 data :   {
//                     OPEN_NUM: openNum,
//                     HW_NUM: hwNum
//                 },
//                 dataType : "json",
//                 contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//                 async : false,
//                 success : function( response ){
//                     fn.loadingClose();
//
//                     var obj = response.HW_INFO;
//                     var taskInfoTest = obj.TASK_INFO;
//                     var html = "";
//                     var objectType = 15;
//
//                     if(obj != null) {
//
//                         $("#stare_task_num").val(hwNum);
//                         $("#stare_task_Rstnum").val(obj.HW_RST_NUM);
//
//                         html += "<div class='hw-box'>";
//                         html += "   <input type='hidden' id='hwNum' value='"+obj.HW_NUM+"' />";
//                         html += "   <div class='hw-top'>";
//                         html += "       <h3>"+obj.SUBJECT_NAME+" 과제</h3>";
//                         html += "       <div class='hw-date'>";
// //                         if(comStdPrdRstrYn == "Y"){
// //                         	html += "           <p>제출 기간 <strong>"+obj.HW_PRD+"</strong></p>";
// //                         }else{
// //                         	html += "           <p>제출 진도율 <strong>"+obj.PGS_RT+"%</strong></p>";
// //                         }
// //                         if(taskInfo.HW_NOTI_FILE_CNT > 0) {
// //                             html += "       <button type='button' class='btn' onclick='notiDownload("+taskInfo.FILE_LIST[0].ATTACHMENT_ID+");'><span>유의사항 다운로드</span></button>";
// //                         }
//                         html += "       </div>";
//                         html += "   </div>";
//                         html += "   <div class='hw-cont'>";
//                         if(obj.HW_CONTENT != "" || obj.HW_CONTENT != null) {
//                             html += "       <p>" + dataToHtml(obj.HW_CONTENT) + "</p>";
//                         } else {
//                             html += "       <p></p>";
//                         }
//                         html += "   </div>";
// //                         if(taskInfo.NOTI != "" && taskInfo.NOTI != null && taskInfo.NOTI != "null") {
// //                             html += "   <div class='hw-cont'>";
// //                             html += "       <p>"+dataToHtml(taskInfo.NOTI)+"</p>";
// //                             html += "   </div>";
// //                         }
//
//                         var hwAnswer = "";
//                         html += "   <textarea name='hwAnswer' id='hwAnswer' class='k-textbox width100' style='height: 130px;' placeholder='내용을 입력해주세요.'>"+hwAnswer+"</textarea>";
// //                         html += "   <p class='col-red import-txt'><i class='icon import-red'></i>업로드 가능한 확장자: "+taskInfo.FILE_EXTS+"</p>";
//                         html += "   <div class='file-box custom-file-box'>";
//                         html += "       <div id='hw-file-upload'><input type='file' id='hwFileUpload' name='hwFileUpload' /></div>";
//                         html += "       <div id='hw_file_list' class='file-template file-list-wrap'></div>";
//                         html += "       <p class='file-import-text'>" +
//                             "<i class='icon-'></i>" +
//                             "업로드 가능한 확장자 (pdf,xls,xlsx,hwp,txt,doc,docx,ppt,pptx,png,jpg,jpeg,gif,mp3,mp4,avi,wav,zip)" +
//                             "</p>";
//                         html += "   </div>";
//
//                         html += "</div>";
//
//                         $("#stare_task_content").html(html);
//
//                         var template = null;
//
//                         //파일업로드
//                         fn.hwFileUploadDraw(objectType);
//
//                         //파일 리스트
//                         fn.hwFileGridDraw(objectType);
//                     }
//
//                 },
//                 error : podo.ui.handleAjaxError
//             });
        },

        /* 과제 제출하기 */
        submitTask: function (openNum) {
            if($("#hwAnswer").val() == "" || $("#hwAnswer").val() == null) {
                alert("과제 내용을 입력해 주세요.");
                $("#hwAnswer").focus();
                return false;
            }

            if($("#hw_file_list").data("kendoGrid").dataSource.data().length == 0) {
                alert("과제를 제출해 주세요.");
                return false;
            }

            if(confirm("제출 이후 재응시가 불가합니다.\n제출하시겠습니까?")) {
                fn.loadingOpen();

                $.ajax({
                    type : 'POST',
                    url : '<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/service/em/save_class_hw_rst.do',
                    data :   {
                        OPEN_NUM : openNum,
                        HW_NUM: $("#hwNum").val(),
                        HW_RST_NUM: $("#stare_task_Rstnum").val(),
                        HW_ANSWER: $("#hwAnswer").val()

                    },
                    dataType : "json",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    async : false,
                    success : function( response ){
                        fn.loadingClose();

                        var obj = response;
                        var cnt = obj.count;
                        if(cnt > 0) {
                            alert("저장되었습니다.");

                            // $("#stare_task_content").mCustomScrollbar('destroy');
                            fn.kendoPopupClose("kendoHwPopup");

                            if($("#siteType").val() !== null) {
                                // 평가항목 다시 불러오기
                                evalItemDraw();

                            } else {
                                // 학습 상위 데이터 다시 불러오기
                                intraLecInfoTopDraw();
                                // 평가항목 다시 불러오기
                                evalItemDraw();
                            }


                        } else {
                            alert('저장에 실패하셨습니다');
                            return false;
                        }
                    },
                    error : podo.ui.handleAjaxError
                });
            }
        },

        /* editor */
        editorDraw: function (obj) {
            var defaultTools = kendo.ui.Editor.defaultTools;

            defaultTools["insertLineBreak"].options.shift = false;
            delete defaultTools["insertParagraph"].options;

            var pcEditor = $("#"+obj).kendoEditor({
                // stylesheets: [
                //     "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/css/solution/solution_ui.css"
                // ],
                tools: [
                    "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight",
                    "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink",
                    "unlink",
                    { 	name: "insertImage",
                        tooltip: "이미지삽입",
                        exec: function(e) {
                            insertImg(e);
                            return false;
                        }
                    }, "subscript", "superscript", "createTable", "addRowAbove", "addRowBelow",
                    "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "formatting",
                    "cleanFormatting", "fontName", "fontSize", "foreColor", "backColor", "tableWizard",
                    "mergeCellsHorizontally", "mergeCellsVertically", "splitCellHorizontally", "splitCellVertically",
                    "tableAlignLeft", "tableAlignCenter", "tableAlignRight", "viewHtml"
                ],
                fontName: [].concat(	//폰트추가(구글웹폰트만가능)
                    kendo.ui.Editor.fn.options.fontName,
                    [
                        {text: "나눔고딕", value: "'Nanum Gothic',sans-serif" },
                        {text: "나눔명조", value: "'Nanum Myeongjo',sans-serif" },
                        {text: "나눔펜", value: "'Nanum Pen Script',cursive" },
                        {text: "나눔브러쉬", value: "'Nanum Brush Script',cursive" },
                        {text: "배달의민족 도현", value: "'Do Hyeon',sans-serif" },
                        {text: "배달의민족 주아", value: "'Jua',sans-serif" },
                        {text: "배달의민족 연성", value: "'Yeon Sung',cursive" },
                        {text: "하이멜로디", value: "'Hi Melody', cursive" },
                        {text: "감자꽃마을", value: "'Gamja Flower', cursive" }
                    ]
                ),
                resizable: {
                    content: true
                }
            });

            $(pcEditor.data("kendoEditor").body)
                .prevAll("head")
                .append("<link href='https://fonts.googleapis.com/css2?family=Nanum+Gothic' rel='stylesheet'>")		//나눔고딕
                .append("<link href='https://fonts.googleapis.com/css2?family=Nanum+Myeongjo' rel='stylesheet'>")		//나눔명조
                .append("<link href='https://fonts.googleapis.com/css2?family=Nanum+Pen+Script' rel='stylesheet'>")	//나눔펜
                .append("<link href='https://fonts.googleapis.com/css2?family=Nanum+Brush+Script' rel='stylesheet'>")	//나눔브러쉬
                .append("<link href='https://fonts.googleapis.com/css2?family=Do+Hyeon' rel='stylesheet'>")			//배달의민족 도현
                .append("<link href='https://fonts.googleapis.com/css2?family=Jua' rel='stylesheet'>")				//배달의민족 주아
                .append("<link href='https://fonts.googleapis.com/css2?family=Yeon+Sung' rel='stylesheet'>")			//배달의민족 연성
                .append("<link href='https://fonts.googleapis.com/css2?family=Hi+Melody' rel='stylesheet'>")			//하이멜로디
                .append("<link href='https://fonts.googleapis.com/css2?family=Gamja+Flower' rel='stylesheet'>");		//감자꽃마을

            $(pcEditor.data("kendoEditor").body)
                .css("font-size", "12pt");

            $('#url').blur(function(){
                if($('#url').val() != "" && $('#url').val().length > 10){
                    $('.thumbnail').eq(0).find('img').attr('src',$('#url').val());
                }
            });

            var objectType = 106;
            var template = null;

            if( $('#imgUpload').text().length == 0  ) {
                template = kendo.template($("#imgupload-template").html());
                $('#imgUpload').html(template({}));
            }
            if( !$('#img-upload').data('kendoUpload') ){
                $("#img-upload").kendoUpload({
                    showFileList : false,
                    width : 500,
                    multiple : false,
                    localization:{ select : "파일 선택" , statusUploaded: "완료", statusFailed : "업로드 실패" },
                    async: {
                        saveUrl:  '<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/save_my_attachments.do',
                        autoUpload: true
                    },
                    upload: function (e) {
                        e.data = {objectType: objectType, objectId: $("#img_objectId").val()};
                    },
                    error : function (e){
                    },
                    success : function(e){
                        if(e.response){
                            var _src =
                                $(".thumbnail").eq(1).find('img').attr({
                                    src: "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/image_view.do?objectType="+objectType+"&objectId="+$('#img_objectId').val()+"&thumbnail=true"
                                });
                        }
                    },
                    complete : function(e){
                    },
                    select: function(e){
                        var d = new Date();
                        var today = d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds();
                        $('#img_objectId').val(companyId+today);

                        $.each(e.files, function(index, value) {
                            if(value.size > 10485760){
                                e.preventDefault();
                                alert("파일 사이즈는 10M로 제한되어있습니다.");
                            }else{
                                $.each(e.files, function(index, value) {
                                    if(value.extension != ".JPG" && value.extension != ".jpg"
                                        && value.extension != ".SVG" && value.extension != ".svg"
                                        && value.extension != ".PNG" && value.extension != ".png"){

                                        e.preventDefault();
                                        alert("업로드가 허용된 이미지형식의 파일만 선택해주세요.\n가능한 파일확장자:jpg, gif, png");
                                    }
                                });
                            }
                        });
                    }
                });
                $("#imgUpload").removeClass('hide');
            }
        }
    }
})();

// kendo editor insert Img
function insertImg(e) {
    $('.thumbnail').eq(0).find('img').attr('src','/images/runway/none_photo2.gif');
    $('.thumbnail').eq(1).find('img').attr('src','/images/runway/none_photo2.gif');
    $('#url').val("");
    $('#urlWidth').val("");
    $('#urlHeight').val("");
    $('#fileWidth').val("");
    $('#fileHeight').val("");
    $('#imgTxt').val("");
    $('#fileImgTxt').val("");
    var parent = e.target.parentElement.parentElement;
    var editorId = parent.getAttribute("aria-controls");

    var rendorTo = $(".bbs_img_upload_popup");
    rendorTo.kendoWindow({
        width:"570px",
        height:"auto",
        resizable : true,
        title : "이미지 선택",
        modal: true,
        visible: false
    });

    var observable = kendo.observable({
        imageUrl: "",
        imageHeight: "",
        imageWidth: "",
        imageFile: "",
        imageFileHeight: "",
        imageFileWidth: "",
        imageFileText: "",
        imageText: "",
        apply:function(e){
            var $this = this;
            var template = kendo.template('<img src="#=src#" width="#=width#" height="#=height#" style="max-width:100%;" alt="#=text#" />');
            var editor = $("#"+editorId).data("kendoEditor");
            var imgTag = $('.thumbnail').eq(0).find('img')[0];
            var _src = $(imgTag).attr("src");
            if(_src == "/images/runway/none_photo2.gif") {
                alert("업로드할 이미지를 선택해주세요.");
                return false;
            } else {
                editor.exec("inserthtml", { value: template({src: $this.imageUrl,width: $this.imageWidth,height: $this.imageHeight, text: $this.imageText}) });
                rendorTo.data("kendoWindow").close();
            }
        },
        apply2:function(e){
            var $this = this;
            var template = kendo.template('<img src="#=src#" width="#=width#" height="#=height#" style="max-width:100%;" alt="#=text#" />');
            var editor = $("#"+editorId).data("kendoEditor");
            var imgTag = $('.thumbnail').eq(1).find('img')[0];
            var _src = $(imgTag).attr("src");
            if(_src == "/images/runway/none_photo2.gif") {
                alert("업로드할 이미지를 선택해주세요.");
                return false;
            } else {
                editor.exec("inserthtml", { value: template({src: _src,width: $this.imageFileWidth,height: $this.imageFileHeight, text: $this.imageFileText}) });
                rendorTo.data("kendoWindow").close();
            }
        }
    });

    kendo.bind( rendorTo, observable );
    $("#img-upload").data("kendoUpload").clearAllFiles();
    rendorTo.data("kendoWindow").center();
    rendorTo.data("kendoWindow").open();


    if(window.outerWidth<768){
        $('.k-window').css('width','100%');
    }
}