var result

// function isEmptyText(textString){
// 	if(textString.length<1){
// 		return true
// 	}
// 	for (let c of textString) {
// 		if (c!=' ') {
// 			return false
// 		}
// 	}
// 	return true
// }
//本来是判断空文字节点的，后来想想没必要

function getCurrentTabId(callback){
	chrome.tabs.query({active: true, currentWindow: true},function(tabs)
	{
		if(callback) 
			callback(tabs.length ? tabs[0].id: null);
	});
}

function toContent(callback)
{
	getCurrentTabId((tabId) =>{
		chrome.tabs.sendMessage(tabId, { content: 'WAKE!'}, function(response)
		{
			if(callback) 
				callback(response);
		});
	});
}

function traversal(root,depth,father){
	var childNodes=root.childNodes
	for(var index=0;index<childNodes.length;index++){
		var child=childNodes[index]
		var childNodeObject={
			'name': '',
			'nodeContent':[
				
			],
			'children':[
				
			],
			'className':''
		}
		for (var i = 0; i < depth; i++) {
			result+="-"
		}
		switch (child.nodeType){
			case 1:				//element
				childNodeObject.name=child.nodeName
				childNodeObject.className='ele'
				result+=childNodeObject.name
				for (let attr of child.attributes) {
					childNodeObject.nodeContent.push(attr.name+"=\""+attr.value+"\"")
				}
				for (let ct of childNodeObject.nodeContent){
					result+=" "+ct
				}
				break;
			// case 2:				//attribute
			// 	result+='attr'
			// 	break;
			//  attribute节点在现在的规范下貌似不继承于node而是包含在标签节点内，所以这里基本应该是搜不出Attribute节点
			case 3:				//text

				childNodeObject.name="TextNode"
				childNodeObject.className='text'
				result+=childNodeObject.name
				childNodeObject.nodeContent.push(child.nodeValue.length>30 ? child.nodeValue.slice(0,30)+"......" : child.nodeValue)
				result+=childNodeObject.nodeContent[0]
				result+="/text"
				
				break;
			case 8:				//comment
				result+='comment'
				break;
			default:			//如果有例外情况我估计是时间穿越了
				result+="WTF"
				break;
		}
		result+="\n"
		if(child.childNodes.length>0){
			traversal(child,depth+1,childNodeObject)
		}
		father.children.push(childNodeObject)
	}
}



var domparser=new DOMParser();
toContent( 
	function (response){
		var htmlDocument=domparser.parseFromString( response.content,"text/html");
		var rootNodeObject={
			'name': 'DOMRoot',
			'nodeContent':[
				
			],
			'children':[
				
			],
			'className':''
		}
		traversal(htmlDocument.childNodes[0],1,rootNodeObject);
		// vm.tabUrl=JSON.stringify(rootNodeObject);
		
		$('#tree').orgchart({
		  'data' : rootNodeObject, //数据
		  'nodeContent': 'nodeContent' ,//内容对应的字段
			'pan' : true,
			'zoom' : true,
			'visibleLevel': 2,
			'exportButton': true,
			'exportFilename': 'DOMTree'
			// 'createNode': function($node, data) {
			//   $node.on('click', function(event) {
			//     if (!$(event.target).is('.edge, .toggleBtn')) {
			//       var $this = $(this);
			//       var $chart = $this.closest('.orgchart');
			//       var newX = window.parseInt(($chart.outerWidth(true)/2) - ($this.offset().left - $chart.offset().left) - ($this.outerWidth(true)/2));
			//       var newY = window.parseInt(($chart.outerHeight(true)/2) - ($this.offset().top - $chart.offset().top) - ($this.outerHeight(true)/2));
			//       $chart.css('transform', 'matrix(1, 0, 0, 1, ' + newX + ', ' + newY + ')');
			//     }
			//   });
			// }
			// 聚焦功能，但是如果dom树比较复杂就没什么可用性
			
		});
})
// chrome.runtime.onMessage.addListener(
// 	function(request,sender,sendResponse){
// 		var htmlDocument=domparser.parseFromString(request.content,"text/html");
// 		traversal(htmlDocument.childNodes[0],1);
// 		console.log(result)
// 		vm.tabUrl=result
// 		sendResponse({ id : 4396 });	
// 	}
// )
//	本来是从content发送到background，但是content先于background启动，所以必须由backgroun主动请求
console.log("BackgroundRunning")