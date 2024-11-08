const uploadTemplate = document.createElement('template');
uploadTemplate.innerHTML = `
    
    <div class="hide my-file-upload"></div>
    <div class="file-template"></div>
`;

var fileGridData = [
    { name: "파일명.png", size: 123456, attachmentId: 123}
];

class podoUpload extends HTMLElement {
    // 클래스의 정적 변수로 counter를 선언하여 순차적 ID 부여
    static counter = 1;
    static counter2 = 1;    // 파일업로드 템플릿 id

    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
        this.appendChild(uploadTemplate.content.cloneNode(true));
        // 순차적 ID 설정
        this.uniqueId = `list_file_upload${podoUpload.counter}`;
        this.uniqueId2 = `list_file_grid${podoUpload.counter}`;
        podoUpload.counter++; // ID가 사용될 때마다 counter 증가
        this.upload = this.querySelector(".my-file-upload");
        this.list = this.querySelector(".file-template");
        this.upload.setAttribute("id", this.uniqueId); // 고유한 ID 설정
        this.list.setAttribute("id", this.uniqueId2); // 고유한 ID 설정
    }

    connectedCallback() {
        // 파일업로드 템플릿
        if (!document.getElementById(`list_fileupload_template${podoUpload.counter2}`)) {
            const scriptTemplate = document.createElement("script");
            scriptTemplate.type = "text/x-kendo-template";
            scriptTemplate.id = `list_fileupload_template${podoUpload.counter2}`;
            scriptTemplate.innerHTML = `
        <input name="list_upload_file" id="list_upload_file${podoUpload.counter2}" type="file"/>
    `;
            podoUpload.counter2++;
            document.body.appendChild(scriptTemplate);
        }

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

        if( $(`#${this.uniqueId}`).text().length == 0  ) {
            const templateId = `#list_fileupload_template${podoUpload.counter2}`;
            const templateElement = $(templateId);
            const template = kendo.template(templateElement.html());
            $(`#${this.uniqueId}`).html(template({}));
        }

        const objectType = $(`#objectType${podoUpload.counter2}`).val();

        $(`#list_upload_file${podoUpload.counter2}`).kendoUpload({
            showFileList : false,
            width : 500,
            multiple : false,
            localization:{ select : '파일 선택' , statusUploaded: "완료.", statusFailed : "업로드 실패." },
            async: {
                saveUrl:  "<%= com.podosw.web.util.ServletUtils.getContextPath(request) %>/comm/save_my_attachment.do",
                autoUpload: true
            },
            upload: function (e) {
                e.data = {objectType: objectType, objectId:$(`#objectId${podoUpload.counter2}`).val()};
            },
            error : function (e){},
            success : function(e){
                $(`#list_file_grid${podoUpload.counter}`).data('kendoGrid').dataSource.read();

                if(objectType == "52"){		//썸네일
                    $("#thumbnailId").val(e.response.attachmentId);
                }
            },
            select: function(e){
                var loginLogoFileGirdSize = $(`#list_file_grid${podoUpload.counter}`).data("kendoGrid").dataSource.data().length;

                if(loginLogoFileGirdSize>0){
                    e.preventDefault();
                    alert("이미 등록된 파일을 삭제 후 다시 시도해주세요.");
                }else{
                    $.each(e.files, function(index, value) {
                        if(value.size>10485760){
                            e.preventDefault();
                            alert("파일 사이즈는 10M로 제한되어 있습니다.");
                        }else{
                            if(value.extension != ".JPG" && value.extension != ".jpg"
                                && value.extension != ".GIF" && value.extension != ".gif"
                                && value.extension != ".PNG" && value.extension != ".png") {
                                e.preventDefault();
                                alert("이미지 파일만 선택해주세요.");
                            }
                        }
                    });
                }
            }
        });
        $(`#list_file_upload${podoUpload.counter}`).removeClass('hide');

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

customElements.define("podo-upload", podoUpload);

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