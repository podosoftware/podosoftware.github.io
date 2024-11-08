const mainGridTemplate = document.createElement('template');
mainGridTemplate.innerHTML = `
    <div id="grid"></div>
`;

class mainGrid extends HTMLElement {

    connectedCallback() {
        this.innerHTML =`
            <div id="grid"></div>
        `;

        $(this.querySelector("#grid")).kendoGrid({
            dataSource: {
                data: [
                    { name: "Jane Doe", age: 30 },
                    { name: "John Smith", age: 35 },
                ],
                schema: {
                    model: {
                        fields: {
                            name: { type: "string" },
                            age: { type: "number" }
                        }
                    }
                },
                pageSize: 10
            },
            height: 400,
            columns: [
                { field: "name", title: "Name", width: "120px" },
                { field: "age", title: "Age", width: "120px" }
            ],
            filterable: {
                extra : false,
                messages : {filter : "필터", clear : "초기화"},
                operators : {
                    string : { contains : "포함", startswith : "시작문자", eq : "동일단어" },
                    number : { eq : "같음", gte : "이상", lte : "이하"}
                }
            },
            sortable: true, pageable: true,
            pageable: { pageSizes:false, responsive: false,  messages: { display: ' {1} / {2}' }  },
            selectable : true
        });
    }

    static get observedAttributes() { // attribute 바뀌는지 감시
        // 감시할 속성 목록을 배열로 반환합니다.
        return ["data-source"];
    }

    attributeChangedCallback(name, oldValue, newValue) { // 바뀌면 실행
        if (name === "data-source" && newValue) {
            // 속성 값이 변경되었을 때 Kendo Grid의 데이터를 업데이트할 수 있습니다.
            $(this.querySelector("#grid")).data("kendoGrid").dataSource.data(JSON.parse(newValue));
        }
    }
}

customElements.define("main-grid", mainGrid);