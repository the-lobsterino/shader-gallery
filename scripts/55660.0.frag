#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.);
const float PI_2 = PI * 2.;

vec3 hsv(float h, float s) {
	return cos((vec3(0., 2./3., -2./3.) + h) * PI_2) * (1.-s) + s;
}


void main( void ) {
	vec2 d_p = (gl_FragCoord.xy*2. - resolution) / resolution;
	vec2 p = (gl_FragCoord.xy - resolution * .5) / min(resolution.x, resolution.y);
	float mos_size = 10.;
	vec2 mos_p = p + vec2(sin(time + p.x));
	mos_p = floor(mos_p * mos_size) / mos_size; 
	
	float time = time + p.x*mouse.x*4.;
	
	vec2 ra = vec2(atan(d_p.x,d_p.y) + PI, length(d_p));
	
	ra.x += time;
	
	float r = PI_2 / (floor(mod(time, 4.0)) + 2.0);
	
	//	  d = cos(floor(.5+a/r)*r-a)*length(st);
	float d = cos(floor(.5+ra.x/r)*r-ra.x)*length(d_p);
	
	float mask = 1.0 - smoothstep(0.4,0.41,d);
	vec3 color = vec3(hsv(length(mos_p) + time, 0.8)) * mask;
	

	
	gl_FragColor = vec4(color, 1.0);

}