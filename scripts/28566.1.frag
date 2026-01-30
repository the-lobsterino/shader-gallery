#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rgb2hsv(vec3 c) {
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const vec3 bgColor=vec3(0.5, 0.3, 1.15);

void main( void ) 
{
	vec2 p = gl_FragCoord.xy/resolution.xy -0.5;
	p.x *= resolution.x/resolution.y;	    
 
	float time = time*4.+length(p*18.);
	float r=.2*(1.+sin(time))*pow(cos(time-atan(p.x,p.y) * 5.), 2.);
	
	float s = length(p) - r;
	
	vec3 col = bgColor*pow(s, 0.3);
	col = col * 2.0 * mouse.x;
	gl_FragColor = vec4( col, 255.0 );
}