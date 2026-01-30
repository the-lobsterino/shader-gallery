#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}



void main( void ) {

	vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y)*3.5;
	
	float len = 1.0 - 0.0 / length(p);
	
	float d = distance(vec2( p.x * 0.5 + cos(p.y * 5.0 + time), p.y ), vec2(p.y, p.x) ) * 1.0;
	
	float add = cos(len + d - time);
	
	vec3 dest = 1.0 - vec3(1.0 * sin(add + time), 0.2 * cos(p.x - add), 1.0 * sin(p.y - add * 1.0) );
	
	vec3 col = rgb2hsv(dest);
		
	gl_FragColor = vec4(dest, 1.0);

}