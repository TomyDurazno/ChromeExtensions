 function hephaFactory (window){
	
	var mirror = document.getElementById("Mirror1");
	var logger = document.getElementById("logger");
	var CANTIDAD_TABS = 10;
								
		var mainBody = $("#mainBody");
		
		var select = $("#select-languages");

		//editor
		var editor = CodeMirror.fromTextArea(mirror, {
				lineNumbers: true,
				mode:  "javascript",
				matchBrackets: true,
				lineWrapping: true,
				extraKeys:{
					"Ctrl-S": () => vault.store(getSelectedTab()),
					"Ctrl-Enter": () => $("#btn-execute").click(),
					"Ctrl-Backspace": () => $("#btn-borrar").click(),
					"Ctrl-Q": () => $("#btn-comentar").click(),
				}
		});		
		
		getSelectedTab = function(){
			return $($("#tabs").find("li").get().filter(li=>$(li).hasClass("active"))).text();
		}
		
		setBtnExpand = function(title){
			 
			 if(title === "Expandir"){
					
 					mainBody.removeClass("contract").addClass("expand");					
 					$("#btn-expand")
 					.html("<b><i class='fa fa-compress' aria-hidden='true'></i></b>")
 					.attr("title", "Contraer");
					
 			}else{
 					mainBody.removeClass("expand").addClass("contract");
 					$("#btn-expand")
 					.html("<i class='fa fa-expand' aria-hidden='true'></i>")
 					.attr("title", "Expandir");

 			}			
		}
				
		newTab = function(fnCallback){
			
		swal({
			title: "Nuevo Tab",
			text: "",
			type: "input",
			showCancelButton: true,
			confirmButtonColor: "#204d74",
			confirmButtonText: "Crear",
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Nombre: ",
			inputType:"text"
			}, function(inputValue){
	
				if (inputValue === false) return false;	
				
				if (inputValue === "") { swal.showInputError("Debe ingresar un nombre"); return false; }
				
				var repite = $("#tabs").find("li")
									   .get()
									   .some(li=>$(li)
									   .text() === inputValue)
								
				if(repite){	swal.showInputError("El nombre ya existe"); return false; }
				
				var cantidad = $("#tabs").find("li").length;
				
				if(cantidad >= CANTIDAD_TABS){ swal.showInputError("Limite de tabs: " + CANTIDAD_TABS); return false; }
				
				swal("Ok!", inputValue + " creado exitosamente", "success");
				fnCallback(inputValue);							
			});
		}
		
		download = function(inputValue){
			
		var downInvoke = (textValue) => {
				var pom = document.createElement('a');
				pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textValue));
				pom.setAttribute('download', inputValue);
				pom.click();
												
				swal("Ok!", inputValue + " exportado exitosamente", "success");
		} 	
			
		swal({
			title: "Exportar",
			text: "",
			type: "input",
			showCancelButton: true,
			confirmButtonColor: "#204d74",
			confirmButtonText: "Exportar",
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Nombre: ",
			inputType:"text"
			}, function(inputValue){
	
				if (inputValue === false) return false;	
				
				if (inputValue === "") { swal.showInputError("Debe ingresar un nombre"); return false }
				
				downInvoke(editor.getValue());
			});
			
		}
		
		getPage = function(fnCallback){	
				//DOMLoaded del popup 
				chrome.tabs.getSelected(null, function(tab) {
				
				//Mensaje para content
				var obj = {	action: "Scrap"	}

				blocker('fa fa-play',"100px");	

				var inicial = new Date();	
					
				chrome.tabs.sendRequest(tab.id, obj, (response) => fnCallback(response));	
			});
		}
		
		downloadTxt = function(){
			
		swal({
			title: "Pagina a Txt",
			text: "",
			type: "input",
			showCancelButton: true,
			confirmButtonColor: "#204d74",
			confirmButtonText: "Txt",
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Nombre: ",
			inputType:"text"
			}, function(inputValue){
	
				if (inputValue === false) return false;	
				
				if (inputValue === ""){ swal.showInputError("Debe ingresar un nombre"); return false }								
				
				//getPage((response) =>{
														
				//var pom = document.createElement('a');
				//pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response));
				//pom.setAttribute('download', inputValue);
				//pom.click();
												
				//swal("Ok!", inputValue + " exportado exitosamente", "success");
					
				//});
				
				download(inputValue);
			});
			
		}
					
		blocker = function(fAwesome, size){
					swal({
						title: "",
						text: "<i class='" + fAwesome + "'; style='font-size: " + size + "; aria-hidden='true'></i>",
						timer: 500,
						customClass: "transparentModal",
						html: true,
						showConfirmButton: false
					});
				
		}
		
		//Objeto encargado de guardar el estado de los diferentes componentes
		var vault = function getVault(){
		
			var v = {};
		
			const expire = 7;
			const mirrorState = "state";
			
			saveTabs = function(){
			
				var state = {};
				
				state.size = $("#btn-expand").attr("title")
					
				state.tabs = $("#tabs")
					 .find("li")
					 .get()
					 .map((li)=> { 
						return {
							"text": $(li).text(), 
							"state" : $(li).hasClass("active") ? "active" : "not"
						}
					})	
				
				localStorage.setItem(mirrorState, JSON.stringify(state));
			}
			
			restoreMirror = function(name){
					
				var c = localStorage.getItem(name);
					
					if(c !== undefined && c !== null){
						
						var obj = JSON.parse(c);          	
						select.val(obj.lang);
						editor.setOption("mode", obj.lang);
						editor.setValue(obj.state);
						$('#logger').val(obj.log)
						
					}else{
						editor.setValue("");
					}							
				
				return v;
					 
			}

			setTabs = function(container, tabs){
				
				tabs.forEach((tab)=>{
					
					if(tab.state === "active"){
						var li = $("<li class='active'><a data-toggle='tab' href='#home'>"+ tab.text +"</a></li>");
							}else{
						var li = $("<li><a data-toggle='tab' href='#home'>"+ tab.text +"</a></li>");
									
					}				
							
					li.on("click",(e)=>{
						restoreMirror(li.text());						
					})
					container.append(li);
				})
				
			}	

			restoreTabs = function(){
				//var state = $.cookie(mirrorState);
				var state = localStorage.getItem(mirrorState);
					
					if(state !== undefined && state !== null){
						state = JSON.parse(state);
						
						var tabs = state.tabs;
						
						var container = $("#tabs");
						
						//Porque el m�todo setBtnExpand funciona con el estado anterior del bot�n clickeado
						state.size === "Expandir" ? state.size = "Contraer" : state.size = "Expandir";
						
						setBtnExpand(state.size);
						
						setTabs(container,tabs);						
	
					}else{
						//get default tabs
						var container = $("#tabs");
								
						var tabs = [
							{"text": "I", "state": "active"},
							{"text": "II", "state": "not"},
							{"text": "III", "state": "not"}
						]
						
						var state = {};
						state.tabs = tabs;
						state.size = "Expandir";
						
						setBtnExpand(state.size);
						setTabs(container,tabs);
						
					}	
			}		
			
			v = {
				
				setMirrors : function(arr){
					localStorage.setItem(mirrorState, JSON.stringify(arr));
				},
				
				restoreTabs : function() {
					restoreTabs();										
					return v;
				},
				
				restoreMirror : function(name){
					
					restoreMirror(name);
					return v;
					 
				},
				
				store : function(name, notBlocker){ 
					
					if(notBlocker === undefined){
						blocker('fa fa-floppy-o','100px');
					}
					
					var obj = {
						nombre: name,
						state : editor.getValue(),
						lang : select.val(),
						log : $('#logger').val()
					}
				
					saveTabs();
					localStorage.setItem(name, JSON.stringify(obj));
				},

			}
			
			return v;
		
		}();
		
		//Seteo de los handlers de los botones
		setBotones = function (){
			
			var c= "click";
			
			$("#btn-execute").on(c,(event)=>{
				
				var _tab;
	
				//DOMLoaded del popup 
				chrome.tabs.getSelected(null, function(tab) {
				_tab = tab;
				
				//Mensaje para content
					var obj ={
						code : editor.getValue(),
						action: "OkExec"
					}
				
				//Guardo el estado
				vault.store(getSelectedTab(), false);	

				blocker('fa fa-play',"100px");		
					
				chrome.tabs.sendRequest(tab.id, obj , function(response) { 
					console.log("Response");
					console.log(response);
					})

				});	
			});										

			$("#btn-borrar").on("click",()=>{
				blocker("fa fa-backward","100px");	
				editor.setValue("");
			});
			
			$("#btn-expand").on("click",()=> setBtnExpand($("#btn-expand").attr("title")));
          
			$("#btn-comentar").on("click",()=> editor.toggleComment());
			
			$("#btn-info").on("click",()=>{				

				swal({ title: "HephaTools v1.0", text: "<h3>Made with love by <span style='cursor:pointer' id='linker'>DuraznoLabs</span></h3> Text editor forked from CodeMirror </br> Swal forked from SweetAlert", html: true});	
						
				var linker = $("#linker");		
				
				linker.on("click", () => window.open("http://www.duraznolabs.tk"));
				
				linker.on("mouseenter", () => linker.css("color","#ea9312")); //orange

				linker.on("mouseleave", () => linker.css("color","#797979"));					

			});
			
			$("#btn-guardar").on("click", () => vault.store(getSelectedTab()));
			
			$("#btn-exportar").on("click",() => download());
			
			$("#btn-newTab").on("click",() => {
				newTab((nombre)=> {
					var li = $("<li><a data-toggle='tab' href='#home'>" + nombre + "</a></li>");
					li.on("click",(e) => restoreMirror(nombre))
					$("#tabs").append(li);
				});
			});
			
			$("#btn-pagina").on("click", () => downloadTxt());
			
			var state = "javascript";
			
			select.on(c,(event)=>{
				
				if(state !== event.currentTarget.value){					
					editor.setOption("mode", event.currentTarget.value);
					state = event.currentTarget.value;
				}
				
			});
									
		}

					
		_scrap = function (logger){
				
			//	var _tab;
	
				//DOMLoaded del popup 
				chrome.tabs.getSelected(null, function(tab) {
			//	_tab = tab;
				
				//Mensaje para content
					var obj ={
						code : logger.val(),
						action: "Scrap"
					}

				blocker('fa fa-play',"100px");	

				var inicial = new Date();	
					
				chrome.tabs.sendRequest(tab.id, obj , function(response) { 
				
				window.rest = response.split("");
				rest = rest.filter((f,a)=>a!= 0 && a != rest.length-1).join('');
				console.log(rest)
				var finalT =new Date(rest);

				console.log(finalT);
						console.log(finalT - inicial);
					})

				});	
			};
		
		// objeto de retorno del factory
		return inner = {
			
			instance : function(){
				setBotones();				
				vault.restoreTabs().restoreMirror(getSelectedTab());	
				
				var conLogger = $('#logger')
				
				conLogger.keydown( e => { if (e.ctrlKey && e.keyCode == 13) {

						_scrap(conLogger);
				}})	

				return inner;
			},
			
			getEditor: function(){
				return editor;	
			},
			scrap: function(code){
				_scrap(code);
			},
			setResize: function(innerHeight){
				var height = innerHeight - 212;
				$("#CodeMirror").css({height: height});
			}	
		};
	
}


