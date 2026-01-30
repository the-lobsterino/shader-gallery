#ifdef GL_ES
precision mediump float;
#endif
#define WAVES 100.0
uniform float time;
uniform vec2 resolution;

void main( void )
{
	vec2 uv = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(.1);

	for (float i=0.0; i<WAVES + 1.0; i++) {
		float freq = 1.0+tan(i+time);
		vec2 p = vec2(uv);
		p.x += i * 0.04 + freq * 0.03;
		p.y += sin(p.x * 10.0 + time) * cos(p.x * 2.0) * freq * 0.2 * ((i + 1.0) / WAVES);
		float intensity = abs(0.01 / p.y) * clamp(freq, 0.15, 2.0);
	        color += vec3(clamp(0.5 * intensity, .0, 1.9)) * (1.0 / WAVES);
	}
	color = 1.0-color*0.8;
   
	gl_FragColor = vec4(color, 1.0);
}