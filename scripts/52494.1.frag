#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




vec4 Field(vec3 position){


vec3 m = position/2.0;
	
float d = atan(position.x,position.y);
vec3 c = vec3(-sin(d*time)*2.0,0.3,0.5);	
	
return vec4(c,1.0);
	
}


void main( void ) {
	
	vec2 st = gl_FragCoord.xy/resolution.xy;

	

	
	gl_FragColor =Field(vec3(st,1.0));

}