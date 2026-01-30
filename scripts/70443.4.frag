#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#extension GL_OES_standard_derivatives : enable

//variables tipo vec4 (vectores de 4 casillas)
vec4 red();
vec4 green();
vec4 yellow();
vec4 purple();

uniform float timeSinceStart;

void main( void ) {
	
	//Final pixel color on screen
	//gl_FragColor toma como parametro 3 floats.
	//Por su naturaleza, los valores no se le pueden asignar de manera directa
	//Por eso usamos un vec4
	gl_FragColor = red();

}

vec4 red(){
	return vec4(
		0.715,  //R
		0.193,  //G
		0.213,  //B
		1.000); //A
}

vec4 green(){
	return vec4(
		0.167,  //R
		0.830,  //G
		0.214,  //B
		1.000); //A
}

vec4 purple(){
	return vec4(0.932,0.253,1.000,1.000);
}



