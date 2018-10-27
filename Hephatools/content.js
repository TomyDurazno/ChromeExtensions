chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	
	if (request.action == "OkExec"){
	   
		globalEval(request.code);
	}
	
	 if (request.action == "Scrap"){
		
		var m =	{location: location.href};
		 //sendResponse(JSON.stringify(m));
	 }
	 
	  if (request.action == "Pagina"){
		
		var m =	{location: location.href +"13"};
		// sendResponse(JSON.stringify(m));
	 }
	 
	 //
	 
	switch(request.action)
	 {
		 case "OkExec":
			globalEval(request.code);
		 break;
	 
		case "Scrap":
			sendResponse(JSON.stringify({location: location.href}));
		 break;
		 
		 case "Pagina":
			sendResponse(JSON.stringify({location: location.href +"13"}))
		 break;
	 }
	
});

function globalEval(code){
	
		var s = document.createElement('script');
		
		s.innerHTML = code;
		s.onload = function() {
			this.parentNode.removeChild(this);
		};

		(document.head||document.documentElement).appendChild(s);
	
}


//chrome.runtime.onMessage.addListener(function(any message, MessageSender sender, function sendResponse){}