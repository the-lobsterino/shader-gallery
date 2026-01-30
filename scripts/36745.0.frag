#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;

	vec3 destColor = vec3(0.0,  1.0,  0.5);
	
	float f = 0.2;
	

	float s = sin(-time-p.y*(1.-p.x)) ;
        float c = cos(0.1*time)  ;
	f += 0.3 / abs(length(p * 5.0 + vec2(c, s)) - 1.5);
	
	gl_FragColor = vec4(destColor*f  , 1.0);
}