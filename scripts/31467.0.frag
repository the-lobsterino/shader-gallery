#ifdef GL_ES
precision mediump float;
#endif
#define WAVES 20.0
uniform float time;
uniform float mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 uv = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);

	for (float i=0.0; i<WAVES + 1.0; i += 0.5) {
		float freq = 1.0+sin(i+time * 5.0);
		vec2 p = vec2(uv);
		p.x += i * 0.04 + freq * 0.03;
		p.y += sin(p.x * 10.0 + time) * cos(p.x * 2.0) * freq * 0.2 * ((i + 1.0) / WAVES);
		float intensity = abs(0.01 / p.y) * clamp(freq, 0.35, 2.0);
		float val = clamp(0.5 * intensity, 0.0, 10.0);
	        color += vec3(val * sin(time), val * sin(time + 1.56), val * sin(time + 3.14)) * (5.0 / WAVES);
	}
	color = color;
   
	gl_FragColor = vec4(color, 1.0);
}