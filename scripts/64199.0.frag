#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);

	vec2 pm = mod(p,abs(sin(time)*0.8)) - (0.4 * abs(sin(time)));
	
	float l = 0.1 / length(pm);
	float q = mod(l,abs(sin(time)));
	float sc = abs(sin(time)*1.5);
	float cc = abs(cos(time)*1.5);
	vec3 c = vec3(0.5*sc,0.1,1.0*cc);
	
        mat2 m = mat2(sc,cc,-sc,-cc);
	
	
	
	gl_FragColor = vec4(vec3(q)*c,1.0);

}