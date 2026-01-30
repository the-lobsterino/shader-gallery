#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//STEALTH_1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 position = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;

	position.x*=(resolution.x/resolution.y) ;
	float as=1.0/(abs(sin(position.x*3.14159*7500.0))*pow(0.5+distance(position,vec2(0.0)),20.0)) ;

	gl_FragColor=vec4(as,0.0,0.0,1.0) ;
	

}
