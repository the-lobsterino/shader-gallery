#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution.xy;
	
	vec3 p = vec3(pos.x, pos.y, pos.y);
	
	p.x /= p.z;
	p.y /= p.z;
	
	float map;
	
	map = mod(gl_FragCoord.x, 1.) * p.x;
	//col = map[p.x][p.z];
	float col = map;
	
	
	gl_FragColor = vec4(vec3(col, 0, 0), 1);

}