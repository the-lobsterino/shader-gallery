  #ifdef GL_ES
  precision highp float;
  #endif
  uniform vec2 resolution;
//Julio Nuñez ITMAZ

  float  adaptarCordenadas(float posicionPantalla)
  {
        return (((4.0*posicionPantalla)/(resolution.x)) -20.0);
  }
	
  void main(void)
  {
	  vec2 c = vec2(adaptarCordenadas(gl_FragCoord.x-(resolution.x/3.0)), adaptarCordenadas(gl_FragCoord.y+(resolution.x/3.5)) ); 
	  vec2 z = vec2(0.0,0.0);
	  
	  bool noPerteneceAlConjunto = false;
	  const int iteraciones = 40;
	  
	  for (int i=0;i<iteraciones;i++){	  
		  z = vec2(((z.x*z.x) - (z.y*z.y)), (2.0*z.x*z.y)) + c;	//z=z^2+c	  
		  float longitudZ = (z.x*z.x)+(z.y*z.y);// si ||z|| > 2 -- > z no pertence al conjunto
		  if (longitudZ > 10.0) {noPerteneceAlConjunto = true;break;}
	  }
	  
	  if(noPerteneceAlConjunto)gl_FragColor = vec4(0.0,0.0,0.0,1.0);
	  else gl_FragColor = vec4(0.0,1.0,0.0,1.0);	  
    } 