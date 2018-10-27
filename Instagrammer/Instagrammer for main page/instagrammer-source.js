
var instagrammer = function(){
			
	let maxBy = (array, fn) => array.map((x) => [x, fn(x)]).reduce((max, x) =>x[1] > max[1] ? x : max)[0]	
					

	let slice = e => Array.prototype.slice.call(e) 

		
	let  addToArticles = articles => { 
	
		return slice(articles).map(ar=> {		
				return obj = { 
					article : ar,
					img : maxBy(slice(ar.getElementsByTagName('img')), i => i.clientWidth)
				}
			}).map(o => o.article.addEventListener('contextmenu', function(e) {
			
				window.open(o.img.src, '_blank');
				e.preventDefault();
			
		}, false))
	}			

	
	let nodeInsertedHandler = () => {

	 document.querySelector("body").addEventListener("DOMNodeInserted", function (ev) {

			if(ev.target instanceof HTMLElement){

				if(ev.target.tagName === "ARTICLE"){
					var arr = [];
					arr.push(ev.target);
					addToArticles(arr);				
				}

			}	

		}, false);

	}
	
	var obj = {
		start : function(){
			addToArticles(document.getElementsByTagName("article"));
			nodeInsertedHandler();
			return obj;
		}
	}
	
	return obj;

}().start();





