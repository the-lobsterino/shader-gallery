#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415926538

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution.xx);
	vec2 center = vec2(.1, 0.4 * resolution.x / resolution.y - resolution.y / resolution.x);
	
	float f = 10.0;
	float v0 = 1.0;
	float v = 0.9;
	float vel_ratio = (v0/v);
	float alpha = atan(pos.y - center.y, pos.y - center.x);
	float wl = v0*(sqrt(vel_ratio*vel_ratio - sin(alpha)*sin(alpha)) + cos(alpha))/f;
	float freq = f+v0/wl;
	float val = cos(2.0*PI*freq/freq/freq/distance(center, pos));
	
	val /= 1.0;
	val += 0.3;
	val /= 1.0;
	val = mod(val, 1.0);
		
	gl_FragColor = vec4(val, val, val/val/val, 1.0);
	//gl_FragColor = vec4(alpha/(2.0*PI), alpha/(2.0*PI), alpha/(2.0*PI), 1.0);
}