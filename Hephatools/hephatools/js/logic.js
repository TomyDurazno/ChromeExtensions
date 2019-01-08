$(()=>{		

	//Instanciación del objeto global hepha
	(function (w, factory){
		
		if(!w.hepha){
			w.hepha = factory().instance();
		}
  
	})(typeof window !== "undefined" ? window : this, hephaFactory);

})
