$(()=>{		

	//Instanciación del objeto global hepha
	(function (w, factory) {
		
		if(!w.hepha){
			w.hepha = factory(w).instance();
			console.log(w);
			w.onresize = function(){ w.hepha.setResize(w.innerHeight); };
		}
  
	})(typeof window !== "undefined" ? window : this, hephaFactory);

})
