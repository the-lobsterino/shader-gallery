// 100820N Creation No. ? :)


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATIONS 36.0

void main( void ) {

	vec3 uv = vec3((gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0, 0.0);

	vec3 sp = vec3(sin(uv.x+ time), cos(uv.y + time), sin(uv.x- time));
	
	for(float i = 1.0; i < ITERATIONS; i++) {
		uv.x += .1 / i * sin(i * uv.y * uv.x * 2.);
		uv.y += .1 / i * cos(i * (uv.x * uv.x - uv.y*uv.y));
	}
	
	
	gl_FragColor = vec4(distance(uv,sp) - vec3(sin(sp.x+ time), cos(sp.y + time), sin(sp.x- time)), 1.0);
	

}