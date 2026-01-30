#ifdef GL_ES
precision mediump float;
#endif

// 7/29/16 mods rsn nrl


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.14
#define BALL_NUM 300

void main( void ) {
	vec2 uv2 = gl_FragCoord.xy / resolution * 2.0 - 1.0;
	uv2.x *= resolution.x/resolution.y;
	
	float o = 0.0;
	vec3 color = vec3(.0);
	
	for (int i = 0; i < BALL_NUM; ++i) {
		vec2 uv = uv2;
		float idx = 1.0 * float (i) / float (BALL_NUM);
		uv.x += tan(time * idx + o) - sin(time * idx*2.0 + o) + cos(o * 7.2 );
		uv.y += atan(time * idx + o) - cos(time * idx*2.0 + o) + sin(o * 12.7);
		float t = time;
		float d = length(uv) - 0.03 - pow(sin(time * 2.0) * 0.3, 2.0);
		color = mix(color, vec3(sin(o - t), sin(o*8.0+6.0 + t), cos(o*13.0*16.0 + t))*0.5+0.5, smoothstep(0.01, -0.01, d));
		color = mix(color, texture2D(backbuffer, gl_FragCoord.xy / resolution).rgb, 0.01);
		
		o += 2.0 * PI / float(1.+idx);
	}
	
	gl_FragColor = vec4(color, 1.0 );
}