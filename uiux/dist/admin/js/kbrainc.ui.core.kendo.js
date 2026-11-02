/**
 * KBRAINC UI CORE (Kendo UI 포함)
 * dependency : jquery, kendo
 */
// kbrainc.ui.core.js를 먼저 로드한 후 이 파일을 로드해야 합니다
// <script src="kbrainc.ui.core.js"></script>
// <script src="kbrainc.ui.core.kendo.js"></script>
;(function($, undefined) {
	'use strict';

	if (typeof kendo === 'undefined') {
		console.error('Kendo UI is not loaded. Please load kendo before ui.core.kendo.js');
		return;
	}

	var ui = kbrainc.ui || {},
	isFunction = kendo.isFunction,
	extend = $.extend,
	each = $.each,
	proxy = $.proxy,
	DataSource = kendo.data.DataSource,
	Widget = kendo.ui.Widget, 
	progress = kendo.ui.progress,
	POST = 'POST',	
	JSON = 'json',
	VISIBLE = ":visible",
	DISABLED = "disabled",
	STRING = 'string',
	CLICK = "click",
	CHANGE = "change",	
	OPEN = "open",
	HIDDEN = "hidden",
	CURSOR = "cursor",	
	DEACTIVATE = "deactivate",
	ACTIVATE = "activate",	
	UNDEFINED = "undefined";

	function grid(renderTo, options){
		options = options || {};		
		if(!renderTo.data("kendoGrid")){			
			 renderTo.kendoGrid(options);
		}		
		return renderTo.data("kendoGrid");
	}
	
	function listview( renderTo, options){		
		if(!renderTo.data("kendoListView")){			
			 renderTo.kendoListView(options);
		}		
		return renderTo.data("kendoListView");
	}
	
	var DEFAULT_PAGER_SETTING = {
			refresh : true,		
			buttonCount : 9,
			info: false
	};	
	
	function pager ( renderTo, options ){		
		if(!renderTo.data("kendoPager")){		
			options = options || {};		
			var settings = extend(true, {}, DEFAULT_PAGER_SETTING , options ); 
			renderTo.kendoPager(settings);
		}		
		return renderTo.data("kendoPager");
	}

	var DEFAULT_UPLOAD_SETTING = {
		multiple : true,
		width: 300,
		showFileList : false,
		localization:{ select : '파일 선택' , dropFilesHere : '업로드할 파일들을 이곳에 끌어 놓으세요.' },
		async: {			
			autoUpload: true
		},
		upload: function (e) {								         
	    	 e.data = {};														    								    	 		    	 
	    }
	};
	
	function upload(renderTo, options){
		if(!renderTo.data("kendoUpload")){		
			options = options || {};		
			var settings = extend(true, {}, DEFAULT_UPLOAD_SETTING , options ); 
			renderTo.kendoUpload(settings);
		}		
		return renderTo.data("kendoUpload");		
	}
	
	var DEFAULT_DATASOURCE_SETTING = {
			transport:{
				read:{
					type :POST,
					dataType : JSON
				} 				
			},
			serverPaging: true,
			error: kbrainc.ui.handleAjaxError,
			pageSize: 10		
	};
	
	
	function datasource(url, options){		
		options = options || {};		
		var settings = extend(true, {}, DEFAULT_DATASOURCE_SETTING , options ); 
		if( defined(url) ){
			settings.transport.read.url = url;			
		}		
		var dataSource =  DataSource.create(settings);
		return dataSource;
	};
	
	var DEFAULT_NOTIFICATION_SETTING = {
		autoHideAfter : 3000,
		title : null,
		position : { pinned : true, top : 10, right : 10 },
		stacking : "down",
		width : 300,
		templates : [{
			type : "warning",
			template : '<div class="notification-warning">#if(title){#<div class="notification-title">#= title #</div>#}#<div class="notification-mesage">#= message #</div></div>'
		},
		{
			type : "error",
			template : '<div class="notification-error">#if(title){#<div class="notification-title">#= title #</div>#}#<div class="notification-mesage">#= message #</div></div>'
		},
		{
			type : "info",
			template : '<div class="notification-info">#if(title){#<div class="notification-title">#= title #</div>#}#<div class="notification-mesage">#= message #</div></div>'
		}, 
		{
			type : "success",
			template : '<div class="notification-success">#if(title){#<div class="notification-title">#= title #</div>#}#<div class="notification-mesage">#= message #</div></div>'
		} ]		
	};
	
	function notification (options) {
		options = options || {};
		var renderToString = "#notification";
		if ($(renderToString).length == 0) {
			$('body').append(	'<span id="notification" style="display:none;"></span>');
		}		
		var settings = extend(true, {}, DEFAULT_NOTIFICATION_SETTING , options ); 
		var renderTo = $(renderToString) ;
		if (!renderTo.data("kendoNotification")) {
			renderTo.kendoNotification(settings);
		}
		return renderTo.data("kendoNotification");
	};

	/**
	 * DataSource 에러 핸들러
	 */
	function error(e){
		kbrainc.ui.handleAjaxError(e.xhr);
	}

	function culture(locale){
		 kendo.culture(locale);		
	}

	extend(ui , {
		datasource : kbrainc.ui.datasource || datasource,
		listview : kbrainc.ui.listview || listview,
		grid : kbrainc.ui.grid || grid,
		pager : kbrainc.ui.pager || pager,
		error: error,
		fx : kendo.fx,
		bind : kendo.bind,
		progress : kendo.ui.progress,
		culture : culture,
		stringify : kendo.stringify,
		template : kendo.template,
		upload : kbrainc.ui.upload || upload,
		observable : kendo.observable,
		notification : kbrainc.ui.notification || notification,
	});


	
})(jQuery);