#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y );
	vec3 col = vec3(0.0);
	col = vec3(0.9,0.,0.)*dot(uv,uv);
	col*=abs(sin(time));
	
	
	gl_FragColor = vec4(col, 1.0);

}