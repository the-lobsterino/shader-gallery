#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
	float aspect = resolution.x / resolution.y;
	vec2 m = mouse.xy*8.0;
	
	p*=8.0;
	
	vec3 blue = vec3(0.1,0.2,0.3);
	vec3 orange = vec3(226. / 255., 87. / 255., 75. / 255.);
	
	vec2 q = p  - vec2(m.x * aspect, m.y);
	q *= rotate2d(time);	//PI / 6.);
	float k = 0.5 / (length(q) * mix(0.1, .9, abs(sin(q.y*q.x))));
	k = smoothstep(0., 1., k);
	
	vec3 destColor = mix(blue, orange, k);
//	destColor *= tan(m.x);
	
	gl_FragColor = vec4(destColor, 1.0);
 }