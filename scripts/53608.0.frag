#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Distline(vec3 ro, vec3 rd, vec3 p){
	return length(cross(p-ro, rd)) / length(rd);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	uv -= .5;
	
	uv.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(0., 0., -2);
	
	vec3 rd = vec3(uv.x, uv.y, 1.);
	
	vec3 p = vec3(0., 0., 3.);
	
	float d = Distline(ro, rd, p);
	
	gl_FragColor = vec4(vec3(d) ,1.);
}