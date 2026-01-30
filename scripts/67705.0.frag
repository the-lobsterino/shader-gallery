#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float oran = resolution.x/resolution.y;
	position.x *= oran;

	vec3 color1 = vec3(0.2) * sin(time * 0.6) - 0.2;
	
	float yaricap1 = 0.05;
	float yaricap2 = 0.02;
	vec2 merkez2 = mouse;
	vec2 merkez1 = mouse + vec2( sin(time * 4.0) *0.1, cos(time* 4.0)*0.1);
	
	if( pow((position.x - merkez1.x * oran), 2.0) + pow((position.y - merkez1.y), 2.0)  < pow(yaricap1, 2.0 )){
		color1 = vec3(sin(mouse.x), sin(time * 4.0), cos(time * 4.0));
	}

	else if( pow((position.x - merkez2.x * oran), 2.0)  + pow((position.y - merkez2.y) ,2.0)  < pow(yaricap2, 2.0) ){
		color1 += vec3( 0.3, 0.9, 1.99);
	}
	
	else{
		if(sin(time) == gl_FragCoord.x){
			gl_FragColor = vec4(1.0);
		}
	}

	gl_FragColor = vec4( vec3( color1), 1.0 );

}