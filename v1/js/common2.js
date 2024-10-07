/**
 * COMMON 공통 유틸(밸류데이션 등)
 */

$(function () {
    // input on keyup keydown
    initEnvironment();
});

// input on keyup keydown
function initEnvironment() {
    // 텍스트 입력 공백제외
    $('body').on('keydown', 'input[type=text]', function (event) {
        chkNull(event.target);
    });

    // search input box input focus 시 box에 focus
    $('[class*=input-search-box-] .k-textbox').on('focus', function () {
        $('[class*=input-search-box-]').removeClass("focused");
        $(this).parent("[class*=input-search-box-]").addClass("focused");
    });

    // 텍스트 입력 숫자만 입력 기능
    $('body').on('keydown', 'input[type=text].number, input[type=tel].number', function (event) {
        var word = event.target.value;
        var str = "1234567890";

        for(var i = 0 ; i < word.length ; i++ ){
            if( str.indexOf(word.charAt(i)) < 0 ){
                event.target.value = event.target.value.replace(/[^0-9]/g, "");
                event.target.focus();
                return false ;
            }
        }
        return true;
    });


    // 텍스트 입력 숫자만 입력 기능
    $('body').on('keyup', 'input[type=text].number, input[type=tel].number', function (event) {
        var word = event.target.value;
        var str = "1234567890";

        for(var i = 0 ; i < word.length ; i++ ){
            if( str.indexOf(word.charAt(i)) < 0 ){
                event.target.value = event.target.value.replace(/[^0-9]/g, "");
                event.target.focus();
                return false ;
            }
        }
    });

    // textarea counting
    $("body").on("keyup", "textarea.text-counting", function (e) {
        var content = $(this).val();
        var totalByte = 0;
        var saveVal = "";

        for(var i=0; i < content.length; i++) {
            var eachChar = content.charAt(i);
            var uniChar = escape(eachChar);

            if(uniChar.length > 4) {
                // 한글 2Byte
                totalByte += 2;
            } else {
                // 영문,숫자,특수문자 1Byte
                totalByte += 1;
            }

            if(totalByte <= 1000) {
                saveVal += eachChar;
            }
        }

        if(totalByte > 1000) {
            alert("최대 1000byte 까지만 입력가능합니다.");
            $(this).val(content.substring(0, 1000));
            $(this).next().find(".count").html(1000);
            return false;
        } else {
            $(this).val(saveVal);
            $(this).next().find(".count").html(totalByte);
        }

    });

}

//첫글자 공백 불가 처리
function chkNull(obj){
    var word = obj.value ;
    var str = /[\s]/g ;
    if(word.length>0){
        if( str.test( word.substring(0, 1) ) == true ){
            alert('첫글자는 공백을 입력할 수 없습니다.');
            obj.value = "" ;
            obj.focus();
            return false;
        }
    }
    return true;
}

// textarea counting 상세일때
function strByteCounting(str, id) {
    var totalByte = 0;

    for(var i=0; i < str.length; i++) {
        var eachChar = str.charAt(i);
        var uniChar = escape(eachChar);

        if(uniChar.length > 4) {
            // 한글 2Byte
            totalByte += 2;
        } else {
            // 영문,숫자,특수문자 1Byte
            totalByte += 1;
        }

        $("#"+id).next().find(".count").html(totalByte);
    }
}

/*---------------------------------------------------
    html 엔티티코드에 대한 문자표현식을 unescape 한다
----------------------------------------------------*/
function unescapeHtml(str) {
    if(typeof str != "string") {
        return str;
    }

    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&apos;/g, "'");
    str = str.replace(/&lpar;/g, ")");
    str = str.replace(/&rpar;/g, "(");

    return str;
}

/*---------------------------------------------------
    천담위 콤마
----------------------------------------------------*/
function commaStr(num) {
    var rtnNum = 0;
    if(num != null) {
        if(num > 0) {
            rtnNum = Number(num).toLocaleString('ko');
        }
    }
    return rtnNum;
}

//날짜입력시 validation 체크 후 yyyy-mm-dd형식으로 반환
//년도범위 체크(2014-12-33경우 에러발생), 문자열 체크, 2014-03-31 입력가능
function ex_date(str, obj){
    var dateVal = $("#"+obj).val();
    var yy,mm,dd;
    var isNum = /^[0-9]+$/;
    var errCode = 0;
    var endDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (!dateVal) {
        return false; //입력값이 없는 경우는 Pass
    }
    //Validation Logic for Date..
    yy = dateVal.substr(0,4);
    mm = dateVal.substr(5,2);
    dd = dateVal.substr(8,2);

    if (yy%1000 != 0 && yy%4 == 0) endDay[1] = 29;   // 윤년
    if (dd > endDay[mm-1] || dd < 1) errCode = 1;        // 날짜 체크
    if (mm < 1 || mm > 12) errCode = 1;          // 월 체크
    if (mm%1 != 0 || yy%1 != 0 || dd%1 != 0) errCode = 1;   // 정수 체크

    dateVal = yy+"-"+mm+"-"+dd;
    if (errCode == 1 || dateVal.length != 10){
        alert("정확한 날짜("+str+")를 입력해 주십시오.\n현재입력값:"+$("#"+obj).val()+"(날짜형식:YYYY-MM-DD) ");
        $("#"+obj).val("");
        return false;
    }
    $("#"+obj).val(dateVal);
    return true;
}

//날짜입력시 validation 체크 후 yyyy-mm-dd HH:mi형식으로 반환
//년도범위 체크(2014-12-33 00:00경우 에러발생), 문자열 체크, 2014-03-31 12:00 입력가능
function ex_date_time(str, obj){
    var dateVal = $("#"+obj).val();
    var yy,mm,dd,HH,mi;
    var isNum = /^[0-9]+$/;
    var errCode = 0;
    var endDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (!dateVal) {
        return false; //입력값이 없는 경우는 Pass
    }
    //Validation Logic for Date..
    yy = dateVal.substr(0,4);
    mm = dateVal.substr(5,2);
    dd = dateVal.substr(8,2);
    HH = dateVal.substr(11,2);
    mi = dateVal.substr(14,2);

    if (yy%1000 != 0 && yy%4 == 0) endDay[1] = 29;   // 윤년
    if (dd > endDay[mm-1] || dd < 1) errCode = 1;        // 날짜 체크
    if (mm < 1 || mm > 12) errCode = 1;          // 월 체크
    if (HH < 0 || HH > 23) errCode = 1;          // 시 체크
    if (mi < 0 || mi > 59) errCode = 1;          // 분 체크
    if (mm%1 != 0 || yy%1 != 0 || dd%1 != 0 || HH%1 != 0 || mi%1 != 0) errCode = 1;   // 정수 체크

    dateVal = yy+"-"+mm+"-"+dd+" "+HH+":"+mi;
    if (errCode == 1 || dateVal.length != 16){
        alert("정확한 날짜("+str+")를 입력해 주십시오.\n현재입력값:"+$("#"+obj).val()+"(날짜형식:YYYY-MM-DD HH:MI) ");
        $("#"+obj).val("");
        return false;
    }
    $("#"+obj).val(dateVal);
    return true;
}

//년월 입력시 validation 체크 후 yyyy-mm형식으로 반환
//년도범위 체크(2014-13경우 에러발생), 문자열 체크, 2014-03 입력가능
function ex_month(str, obj){
    var dateVal = $("#"+obj).val();
    var yy,mm;
    var isNum = /^[0-9]+$/;
    var errCode = 0;

    if (!dateVal) {
        return false; //입력값이 없는 경우는 Pass
    }
    //Validation Logic for Date..
    yy = dateVal.substr(0,4);
    mm = dateVal.substr(5,2);

    if (mm < 1 || mm > 12) errCode = 1;          // 월 체크
    if (mm%1 != 0 || yy%1 != 0) errCode = 1;   // 정수 체크

    dateVal = yy+"-"+mm;
    if (errCode == 1 || dateVal.length != 7){
        alert("정확한 날짜("+str+")를 입력해 주십시오.\n현재입력값:"+$("#"+obj).val()+"(날짜형식:YYYY-MM) ");
        $("#"+obj).val("");
        return false;
    }
    $("#"+obj).val(dateVal);
    return true;
}

//날짜입력시 validation 체크 후 yyyy-mm-dd형식으로 반환
//년도범위 체크(2014-12-33경우 에러발생), 문자열 체크, 2014-03-31 입력가능
function is_date(viewName, val){
    var dateVal = val;
    var yy,mm,dd;
    var isNum = /^[0-9]+$/;
    var errCode = 0;
    var endDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (!dateVal) {
        return false; //입력값이 없는 경우는 Pass
    }
    //Validation Logic for Date..
    yy = dateVal.substr(0,4);
    mm = dateVal.substr(5,2);
    dd = dateVal.substr(8,2);

    if (yy%1000 != 0 && yy%4 == 0) endDay[1] = 29;   // 윤년
    if (dd > endDay[mm-1] || dd < 1) errCode = 1;        // 날짜 체크
    if (mm < 1 || mm > 12) errCode = 1;          // 월 체크
    if (mm%1 != 0 || yy%1 != 0 || dd%1 != 0) errCode = 1;   // 정수 체크

    dateVal = yy+"-"+mm+"-"+dd;
    if (errCode == 1 || dateVal.length != 10){
        alert("정확한 날짜("+viewName+")를 입력해 주십시오.\n현재입력값:"+val+"(날짜형식:YYYY-MM-DD) ");
        return false;
    }
    return true;
}

/*-------------------------------------------------------------------------
    f_checkEmail(strEmail)
    Spec     : 이메일형식 체크
    Argument : string
    Return   : Boolean
    Example  : if(!f_checkEmail( $("#email").val()) )
-------------------------------------------------------------------------*/
    function f_checkEmail(strEmail) {
        var arrMatch = strEmail.match(/^(\".*\"|[A-Za-z0-9_-]([A-Za-z0-9_-]|[\+\.])*)@(\[\d{1,3}(\.\d{1,3}){3}]|[A-Za-z0-9][A-Za-z0-9_-]*(\.[A-Za-z0-9][A-Za-z0-9_-]*)+)$/);
        if (arrMatch == null) {
            return false;
        }
        return true;
    }

/*-------------------------------------------------------------------------
    chkPhone(str, objPhone)
    Spec     : 전화번호 형식 체크
    Argument : string, object
    Return   : Boolean
    Example  : if(!chkPhone("관리자연락처", "phone")){
-------------------------------------------------------------------------*/
function chkPhone(str, obj)
{
    var reTel = /^0(2|31|33|32|42|43|41|53|54|55|52|51|63|61|62|64)[0-9][\d]{1,3}[\d]{4}$/;
    var rePhone = /^0(11|16|17|18|19|10)[0-9][\d]{1,3}[\d]{4}$/;

    if($("#"+obj).val()!="")
    {
        if(!($("#"+obj).val().match(reTel) || $("#"+obj).val().match(rePhone)))
        {
            alert(str+' 형식이 잘못되었습니다. (xxxxxxxxxxx)');
            $("#"+obj).focus();
            return false;
        }
    }
    return true;
}

/*---------------------------------------------------
    string 'null' 제거 함수
----------------------------------------------------*/
function removeNullStr(str){
    if(str!=null){
        str = str.replace("null", "");
    }
    return str;
}


/*---------------------------------------------------
 * 브라우저 체크 - ie는 버전, 그 이외는 -1 리턴됨.
 ----------------------------------------------------*/
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


/*---------------------------------------------------
 * 반올림
 ----------------------------------------------------*/
function round(num,ja) {
    ja=Math.pow(10, ja);
    return Math.round(num * ja) / ja;
}

/*
* 문자열 값이 Y일 때 true 그 이외에는 false 리턴
* */
String.prototype.enabled = function(){
    return this == "Y" ? true : false;
};

String.prototype.isNumber = function(){
    var exp = /^[0-9]*$/g;
    var is = exp.test(this);
    return is;
}

/*---------------------------------------------------
undefined -> 0 변환
----------------------------------------------------*/
function removeUndefinedZero(str){
    if(str==undefined){
        str = 0;
    }
    return str;
}

/*---------------------------------------------------
String 특정문자 변경
----------------------------------------------------*/
function strReplace(subject, search, replace) {
    return subject.split(search).join(replace);
}

/*---------------------------------------------------
null를 0으로 리턴
----------------------------------------------------*/
function isEmpty(value) {
    if(value.trim() == ''){
        return 0;
    }else{
        return value;
    }
}