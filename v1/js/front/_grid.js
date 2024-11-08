/**
 * 공통
 *  grid.main(...);
 */
var grid = (function () {
    'use strict';

    return {
        /* 메인 그리드 - 화면에 그리드가 하나 보일때 */
        /* url : 통신
         * parameter: 파라메터
         * fields: 필드 타입
         * pageSize: 페이지 사이즈
         * isServer: 서버 필터 여부
         * columns: 칼럼
        *  */
        main: function (url, parameter, fields, pageSize, isServer, columns) {
            $("#grid").empty();
            $("#grid").kendoGrid({
                dataSource: {
                    transport: {
                        read: { url: url, type:"POST", dataType: 'json' },
                        parameterMap: function (options, operation){
                            var sortField = "";
                            var sortDir = "";
                            if (options.sort && options.sort.length>0) {
                                sortField = options.sort[0].field;
                                sortDir = options.sort[0].dir;
                            }
                            return {
                                startIndex: options.skip,
                                pageSize: options.pageSize,
                                sortField: sortField,
                                sortDir: sortDir,
                                filter: JSON.stringify(options.filter),
                                parameter
                            };
                        }
                    },
                    schema: {
                        total: "totalCount",
                        data: "items",
                        model: {
                            id : 'hf_id',
                            fields: fields
                        },
                        parse: function(response) {
                            var obj = response.items;
                            var rtnArr = [];
                            if(obj != null) {
                                for (var i = 0; i < obj.length; i++) {
                                    var row = {};
                                    $.each(obj[i], function(key,val){
                                        row[key] = unescapeHtml(val);
                                    });

                                    rtnArr.push(row);
                                }
                            }
                            return {items:rtnArr,totalCount:response.totalCount};
                        }
                    },
                    pageSize: pageSize, serverPaging: isServer, serverFiltering: isServer, serverSorting: isServer
                },
                columns: columns,
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
    }
})();