const kendoEditorTemplate = document.createElement('template');
kendoEditorTemplate.innerHTML = `
<textarea name="" class="editor-textarea pd-w-full"></textarea>
`;

class podoKendoEditor extends HTMLElement {
    // 클래스의 정적 변수로 counter를 선언하여 순차적 ID 부여
    static counter = 1;

    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
        this.appendChild(kendoEditorTemplate.content.cloneNode(true));
        // 순차적 ID 설정
        this.uniqueId = `editor-${podoKendoEditor.counter}`;
        podoKendoEditor.counter++; // ID가 사용될 때마다 counter 증가
        this.textarea = this.querySelector(".editor-textarea");
        this.textarea.setAttribute("id", this.uniqueId); // 고유한 ID 설정
    }

    connectedCallback() {
        if (!document.getElementById("imgupload-template")) {
            const scriptTemplate = document.createElement("script");
            scriptTemplate.type = "text/x-kendo-template";
            scriptTemplate.id = "imgupload-template";
            scriptTemplate.innerHTML = `
        <input name="img-upload" id="img-upload" type="file"/>
    `;
            document.body.appendChild(scriptTemplate);
        }

        if (!document.querySelector(".bbs_img_upload_popup")) {
            const popupDiv = document.createElement("div");
            popupDiv.className = "bbs_img_upload_popup";
            popupDiv.style.padding = "0";
            popupDiv.style.display = "none";

            popupDiv.innerHTML = `
        <input type="hidden" name="objectId" id="img_objectId" />
        <input type="hidden" name="editorId" id="editorId" />
        <div class="bbs_img_upload_data">
            <div class="file_upload_list file_upload_list_first cmptMapping-box">
                <div class="cmptMapping-top-box pt0">
                    <strong><i class="icon icon-badge"></i>URL</strong>
                </div>
                <div class="thumbnail">
                    <img src="../images/admin/none_photo2.gif" alt="no thumnul" />
                </div>
                <ul>
                    <li><label for="url">URL</label><input type="text" id="url" data-bind="value:imageUrl"/></li>
                    <li><label for="urlWidth">Width</label><span></span><input type="text" id="urlWidth" data-bind="value:imageWidth" /></li>
                    <li><label for="urlHeight">Height</label><input type="text" id="urlHeight" data-bind="value:imageHeight"/></li>
                    <li>
                        <label for="imgTxt">대체텍스트</label>
                        <textarea name="imgTxt" id="imgTxt" class="k-textbox pd-w-full" data-bind="value:imageText" style="height: 50px;"></textarea>
                    </li>
                </ul>
                <div class="bottom_btn">
                    <button type="button" id="urlUpload" class="popup-btn" data-bind="click:apply">업로드</button>
                </div>
            </div>
            <div class="file_upload_list cmptMapping-box">
                <div class="cmptMapping-top-box">
                    <strong><i class="icon icon-badge"></i>파일업로드</strong>
                </div>
                <div class="thumbnail">
                    <img src="../images/admin/none_photo2.gif" alt="no thumnul" data-bind="value:imageFile"/>
                    <div id="imgUpload" class="hide"></div>
                </div>
                <ul>
                    <li><label for="fileWidth">Width</label><input type="text" data-bind="value:imageFileWidth" id="fileWidth"/></li>
                    <li><label for="fileHeight">Height</label><input type="text" data-bind="value:imageFileHeight" id="fileHeight"/></li>
                    <li>
                        <label for="fileImgTxt">대체텍스트</label>
                        <textarea name="fileImgTxt" id="fileImgTxt" class="k-textbox pd-w-full" data-bind="value:imageFileText" style="height: 50px;"></textarea>
                    </li>
                </ul>
                <div class="bottom_btn">
                    <button type="button" class="popup-btn" data-bind="click:apply2">업로드</button>
                </div>
            </div>
        </div>
    `;

            document.body.appendChild(popupDiv);
        }

        // Kendo Editor 초기화
        const defaultTools = kendo.ui.Editor.defaultTools;

        defaultTools["insertLineBreak"].options.shift = false;
        delete defaultTools["insertParagraph"].options;

        const pcEditor = $(this.querySelector(`#${this.uniqueId}`)).kendoEditor({
            tools: [
                "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight",
                "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink",
                "unlink",
                // 2025 버전부터 이걸
                { 	name: "customInsertImage",
                    // { 	name: "insertImage",
                    tooltip: "이미지삽입",
                    ui: {
                        type: "button",
                        text: "Toggle",
                        togglable: false,
                        icon: "image"
                    },
                    exec: this.insertImg
                },
                // 2025 버전 아래부터 이걸
                // { 	name: "insertImage",
                //     tooltip: "이미지삽입",
                //     exec: (e) => {
                //         this.insertImg(e);     // 클래스 메서드 호출
                //         return false;
                //     }
                // },
                "subscript", "superscript", "createTable", "addRowAbove", "addRowBelow",
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
                content: true,
                toolbar: true
            }
        });

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
                    saveUrl:  '/comm/save_my_attachments.do',
                    autoUpload: true
                },
                upload: function (e) {
                    e.data = {objectType: objectType, objectId: $("#img_objectId").val()};
                },
                error : function (e){
                },
                success : function(e){
                    if(e.response){
                        // var _src =
                            $(".thumbnail").eq(1).find('img').attr({
                                src: "/comm/image_view.do?objectType="+objectType+"&objectId="+$('#img_objectId').val()+"&thumbnail=true"
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

    // 에디터의 내용을 가져오는 메서드
    getContent() {
        return $(this.querySelector(`#${this.uniqueId}`)).data("kendoEditor").value();
    }

    // 에디터의 내용을 설정하는 메서드
    setContent(content) {
        $(this.querySelector(`#${this.uniqueId}`)).data("kendoEditor").value(content);
    }

    insertImg(e) {
        $('.thumbnail').eq(0).find('img').attr('src','../images/runway/none_photo2.gif');
        $('.thumbnail').eq(1).find('img').attr('src','../images/runway/none_photo2.gif');
        $('#url').val("");
        $('#urlWidth').val("");
        $('#urlHeight').val("");
        $('#fileWidth').val("");
        $('#fileHeight').val("");
        $('#imgTxt').val("");
        $('#fileImgTxt').val("");
        // var parent = e.target.parentElement.parentElement;
        // var editorId = parent.getAttribute("aria-controls");

        // var 2025 부터는 이렇게
        var parent = e.target.parents(".k-editor");
        var editorId = parent.find("textarea").attr("id");

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
                if(_src == "../images/runway/none_photo2.gif") {
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
                if(_src == "../images/runway/none_photo2.gif") {
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
}

customElements.define("podo-editor", podoKendoEditor);



