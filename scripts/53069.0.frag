#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.141592

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bg;

#define BPM 134.0
#define time (time * BPM / 60.0 / 16.0)

float pattern(vec2 p, float t) {
	float s_x = (16.0 + 128.0) * abs(fract((p.x / 256.0) + t / 8.0) - 0.5);
	float s_y = (16.0 + 64.0) * abs(fract((p.x / 96.0) + t / 8.0) - 0.5);
	
	float t_x = 4.0 + fract(abs(fract(p.y / s_x) * 2.0 - 1.0) + t / 100.0);
	float t_y = 3.0 + fract(abs(fract(p.x / 128.0) * 2.0 - 1.0) + t / 100.0);
	
	p.x += 1.5 * cos((p.x + t / 128.0) / t_x * PI);
	p.y += 1.5 * sin(p.y / t_y * PI);
	
	return step(0.0, (fract(p.x / 2.0) - 0.5) * (fract(p.y / 2.0) - 0.5));
}

void main( void ) {
	vec2 res = resolution.xy / 8.0;
	vec2 p = gl_FragCoord.xy / 8.0;
	vec2 uv =  p / res ;
	
	p.x -= res.x;
	float rot = ((time / 8.0 + 0.125 * 0.125 * cos(32.0 * length(uv - 0.5)) * PI)); 
	p = vec2(
		cos(rot) * (p.x - res.x * 0.5) - sin(rot) * (p.y - res.y * 0.5),
		cos(rot) * (p.y - res.y * 0.5) + sin(rot) * (p.x - res.x * 0.5)
	);
	p += res.x / 2.0;
	p = floor(p);
	
	
	
	vec3 color_bg = texture2D(bg, uv).rgb;

	float value = 0.0;
	
	
	vec3 color = vec3(
		pattern(p, time + color_bg.r),
		pattern(p, time + 1.0 / 32.0 + color_bg.g),
		pattern(p, time + 5.0 / 32.0 + color_bg.b)
	
	);
	
	color = mix(color, (color) * abs(color_bg.rbg - mix(color.brg, color.rgb, 0.5 + 0.5 * cos(time * PI))), 1.0 *fract(abs(fract(uv.y * 2.0) * 2.0 - 1.0) - time * 2.0));
	
	
	
	gl_FragColor = vec4(color, 1.0 );

}