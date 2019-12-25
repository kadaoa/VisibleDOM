var htmlContent=document.getElementsByTagName('html')[0].outerHTML

// chrome.runtime.sendMessage({content: htmlContent},function(response){
// 	console.log(response.id)
// })

chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
		sendResponse({ content: htmlContent });	
		return true;
	}
)
