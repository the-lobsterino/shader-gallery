#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 vp) {
	mat2 m = mat2(10, 35.8, 82, 163);
	return fract(sin(vp*m+time*1e-3+length(vp))*2212.3); 
	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*1e2;
	vec3 Cd;
	
	Cd = vec3( hash(floor(p*3.0)).x, 0, 0);
	
	gl_FragColor = vec4( Cd, 1.0 );

}