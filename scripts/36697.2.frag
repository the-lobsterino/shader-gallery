#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;

	vec3 destColor = vec3(1.0,  1.0,  1.0);
	
	float f = 0.0;
	

	float s = sin(time) ;
        float c = cos(time)  ;
	f += 0.3 / abs(length(p * 5.0 + vec2(c, s)) - 1.5);
	
	gl_FragColor = vec4(destColor*f  , 1.0);
}