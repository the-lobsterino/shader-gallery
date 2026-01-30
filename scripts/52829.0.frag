#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.xy = position.xy - vec2(0.5, 0.5);
	position.x  = position.x * resolution.x/resolution.y;
	vec2 mmouse = mouse - vec2(0.5, 0.5);
	
	float x = position.x;
	float y = position.y;
	
	//float b = mmouse.y*1000.;
	float b = 100.;
	float a = mmouse.x*2.*sin(x*b/10.)*cos(y*b/10.);
	
	if(sin(x*b)*cos(y*b) > a){
		gl_FragColor = vec4(1, 0.7, 0.9, 1.0);
	}else{
		gl_FragColor = vec4(1, 1, 1, 1.0);
	}
}