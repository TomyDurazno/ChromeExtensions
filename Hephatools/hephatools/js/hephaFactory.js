function hephaFactory (){
	
	var mirror = document.getElementById("Mirror1");
								
		var mainBody = $("#mainBody");
		
		var select = $("#select-languages");
		
		var maxTabs = 15;
		
		var STRING_EMPTY = "";
		
		//editor
		var editor = CodeMirror.fromTextArea(mirror, {
				lineNumbers: true,
				mode:  "javascript",
				matchBrackets: true,
				lineWrapping: true,
				extraKeys:{
					"Ctrl-S": ()=>{ vault.store(getSelectedTab())},
					"Ctrl-Enter": ()=>{ $("#btn-execute").click()},
					"Ctrl-Backspace": ()=>{	$("#btn-borrar").click()},
					"Ctrl-Q": ()=>{	$("#btn-comentar").click()}
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
				
				if (inputValue === "") {
					swal.showInputError("Debe ingresar un nombre");
					return false
				}
				
				var repite = $("#tabs").find("li").get()
								.some(li=>$(li).text() === inputValue)
								
				if(repite){
					swal.showInputError("El nombre ya existe"); return false;
				}
				
				var cantidad = $("#tabs").find("li").length;
				
				if(cantidad >= maxTabs){
					swal.showInputError("Limite de tabs: "+maxTabs); return false;
				}
				
				swal("Ok!", inputValue + " creado exitosamente", "success");
				fnCallback(inputValue);
			
				
			});
		}
		
		download = function(){
			
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
				
				if (inputValue === "") {
					swal.showInputError("Debe ingresar un nombre");
					return false
				}
				
				var pom = document.createElement('a');
				pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editor.getValue()));
				pom.setAttribute('download', inputValue);
				pom.click();
												
				swal("Ok!", inputValue + " exportado exitosamente", "success");
			});
			
		}
					
		blocker = function(fAwesome, size){
					console.log("<i class='"+fAwesome+"'; style='font-size: "+size+" color:green'; aria-hidden='true'></i>");
					swal({
						title: "",
						text: "<i class='"+fAwesome+"'; style='font-size: "+size+"; aria-hidden='true'></i>",
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
				
				//$.cookie(mirrorState, JSON.stringify(state), { expires: expire });
				localStorage.setItem(mirrorState, JSON.stringify(state));
			}
			
			restoreMirror = function(name){
					
				//var c = $.cookie(name);
				var c = localStorage.getItem(name);
					
					if(c !== undefined && c !== null){
						
						var obj = JSON.parse(c);          	
						select.val(obj.lang);
						editor.setOption("mode", obj.lang);
						editor.setValue(obj.state);
						
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
						
						//Porque el método setBtnExpand funciona con el estado anterior del botón clickeado
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
					//$.cookie(mirrorState, JSON.stringify(arr), { expires: expire });
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
					}
				
					saveTabs();
					//$.cookie(name, JSON.stringify(obj), { expires: expire });
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
				
				var selection = editor.getSelection();
				
				var codeToBeExec = selection != STRING_EMPTY ? selection : editor.getValue();
				
				//Mensaje para content
					var obj ={
						code : codeToBeExec,
						action: "OkExec"
					}
				
				//Guardo el estado
				vault.store(getSelectedTab(), false);	

				blocker('fa fa-play',"100px");		
					
				chrome.tabs.sendRequest(tab.id, obj , function(response) { 
						console.log("response: ");
						console.log(response);
					})

				});	
			});							
			
			$("#btn-borrar").on(c,()=>{
				blocker("fa fa-backward","100px");	
				editor.setValue("");
			});
			
			$("#btn-expand").on(c,()=>{
			
			console.log($("#btn-expand").attr("title"));
			setBtnExpand($("#btn-expand").attr("title"));
			});
          
			$("#btn-comentar").on(c,()=>{editor.toggleComment();});
			
			$("#btn-info").on(c,()=>{				

				swal({
					title: "HephaTools v1.0",
					text: "<h3>Made with love by <span style='cursor:pointer' id='linker'>DuraznoLabs</span></h3> Text editor forked from CodeMirror </br> Swal forked from SweetAlert",
					html: true
				});	
						
				var linker = $("#linker");		
				
				linker.on("click",function(){
					window.open("http://www.duraznolabs.tk");
				})
				
				linker.on("mouseenter", function() {
					linker.css("color","#ea9312");//orange
				});	

				linker.on("mouseleave", function() {
					linker.css("color","#797979");//grey
				});					

			});
			
			$("#btn-guardar").on(c,()=>{				
				
				vault.store(getSelectedTab())
			});
			
			$("#btn-exportar").on(c,()=>{				
				
				download();
			});
			
			$("#btn-newTab").on(c,()=>{
				newTab((nombre)=>{
					var li = $("<li><a data-toggle='tab' href='#home'>"+ nombre +"</a></li>");
					li.on("click",(e)=>{
						restoreMirror(nombre);						
					})
					$("#tabs").append(li);
				});
			});
			
			$("#btn-link").on(c, () => {
				
					
				//DOMLoaded del popup 
				chrome.tabs.getSelected(null, function(tab) {
				_tab = tab;
				
				//Mensaje para content
					var obj ={	
						action: "Link"
					}

				//blocker('fa fa-play',"100px");		
					
				chrome.tabs.sendRequest(tab.id, obj , function(response) { 
					
					})

				});	
				
			});
			var state = "javascript";
			
			select.on(c,(event)=>{
				
				if(state !== event.currentTarget.value){					
					editor.setOption("mode", event.currentTarget.value);
					state = event.currentTarget.value;
				}
				
			});
									
		}
		
		
		// objeto de retorno del factory
		var inner = {};

		inner.instance = function(){
				setBotones();				
				vault.restoreTabs().restoreMirror(getSelectedTab());	
				return inner;
		}
			
		inner.getEditor = function(){
			return editor;	
		} 
		
		return inner;
		
}