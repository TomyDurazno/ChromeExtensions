//Instagrammer2

var Instagrammer = function()
{
	var widthestImg = (a, b) => a.width > b.width ? a : b; 

var isMainModalOn = target => 
	target instanceof HTMLElement &&
	target.tagName === "DIV" &&
	Array.from(target.querySelectorAll("div")).some(e => e.hasAttribute("role"));

var getImg = target => Array.from(target.querySelectorAll("img")).reduce(widthestImg);
	
	
var getSelectedItemIndex = (arr, ev) => 
{
	var items = arr.map((item, index) => item ? index : false).filter(i => !(i === false));
		
	if(items.length == 2)
	{
		//PROBLEM: LA GALLERY DE 2 ELEMENTOS!
		//Fix: fijarse en el 'transform' de la gallery
		var roles = Array.from(ev.target.querySelectorAll("div"))
						 .filter(r => r.getAttribute("role") === "button" && r.style.transform);
		
		var transform = roles[0].style.transform;
		
		if(transform.indexOf("(0px)") !== -1)
		{
			return items[0];
		}
		else
		{
			return items[1];
		}
	}
	else
	{
		return items[1];
	}	
}	

var galleryHandler = ev => 
{
	var uls = ev.target.querySelectorAll("ul");
	
	if(uls.length)
	{				
		var lis = Array.from(uls[0].querySelectorAll("li"));

		var popLis = lis.map(l => l.innerHTML !== "");

		var src = lis[getSelectedItemIndex(popLis, ev)].querySelectorAll("img")[0].src;
		window.open(src, '_blank');
	}	
}

var singleImageHandler = ev => 
{
	var src = getImg(ev.target).src;
	window.open(src, '_blank');
}
	
var isProfile = () => location.href.split("/").length > 4;
	
var nodeInsertedHandler = function (ev) 
{		
	if(isProfile() && isMainModalOn(ev.target))
	{   
		var handler;
		var uls = ev.target.querySelectorAll("ul");		
		
		switch(uls.length)
		{
			case 0:
				// caso: single image sin comentario
				if(ev.target.classList.length === 0)
				{
					handler = singleImageHandler;
					//console.log("single");
				}
				
				break;
			
			case 1:
			
				//console.log("single");
				handler = singleImageHandler;
				break;

			case 2:
				
				//console.log("multiple");
				handler = galleryHandler;
				break;	
		}
		
		
		ev.target.addEventListener('contextmenu', function(e) 
		{
			if(handler)
				handler(ev);
			//e.preventDefault();				
		}, false)
		
	}
}

var inst =
{		
	initialize: function()
	{
		if(!window.Instagrammer)
		{
			//EDIT: BUSCAR UNA FORMA DE QUE SOLAMENTE FUNCIONE EN EL PROFILE
			document.querySelector("body").addEventListener("DOMNodeInserted", nodeInsertedHandler, false);
			console.log("Instagrammer loaded succesfully!");	
		}
		else
		{
			console.log("Instagrammer already exists!");	
		}
		
		return inst;
	}		
}
	
return inst;

}().initialize();








