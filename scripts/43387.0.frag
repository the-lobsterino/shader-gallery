#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time

float calc(vec2 p, float x) {
	vec2 pp;
	
	for (int j = 1; j <10; j++) {
		float i = float(j)*.251;
		vec2 c = vec2(sin(x*i * 246.563*(1.5+0.015*(sin(p.x*0.51)+sin(p.x*0.151)*.51)-sin(p.y*0.5121)*0.0125-sin(p.y*0.123)*0.025) + 0.534 + t * 1.143), sin(i * 17.413 + 1.353 - t * .514));
		float r = distance(c, p)+.71;
		float a = sin(i * 134.125 + .524 + t * .10246) * 13.14159265359 / max(r, 0.01);
		mat3 m = mat3(
			cos(a+t*.91)*2., -cos(a+t*.687)*2., 0.0,
			sin(a+t*.7)*2., sin(a+t*.871)*2., 0.0,
			c.x*5., c.y*5., 10.0
		);
		p = (m * vec3(p, 1.0)).xy/float(j)*0.33;
		pp+=p;
	}
	
	return sin(pp.x * 1.0) * sin(pp.y * 1.0)*0.55+0.5;
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	p.x *= resolution.x / resolution.y;
	p.x*=5.;
	p.y*=5.;
	
	float t1 = t*5.5;
	float rd = (sin(t+127.)+0.7*sin(t*1.7+65.) + 0.5*sin(t*1.43+233.))*0.005;
	float gd = (sin(t+30.)+0.7*sin(t*1.7+271.) + 0.5*sin(t*1.43+111.))*0.005;
	float bd = (sin(t-30.)+0.7*sin(t*1.7+15.) + 0.5*sin(t*1.43+14.))*0.005;
	
	float r	= calc(p, 2.+rd)*0.25;
	float g	= calc(p, 2.+gd)*0.5;
	float b	= calc(p, 2.+bd);
	
	//vec3 c = mix(vec3(0.21, 0.75, 1.0), vec3(0.25, 0.13, 0.25), v);
	
	gl_FragColor = vec4(r+g*0.25+b*0.25, g+b*0.75, b+r*0.25+g*0.5, 1.0);

}