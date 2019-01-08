chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	
	if (request.action == "OkExec"){
										
			globalEval(request.code);
	}
	
	if (request.action == "Link"){					
											
			download(formatOpen(location.href), getName(), ".html");
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

function getName()
{
	return document.title + ".html";
}

function formatOpen(auxTxt)
{
	return "<script>window.open('"+auxTxt+"','_self')</script>";
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
}