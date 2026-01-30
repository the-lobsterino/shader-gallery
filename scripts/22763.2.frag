#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pixel(vec2 pos)
{
	float c = pow(16.0 / length(gl_FragCoord.xy - pos.xy), 4.0);
	return c;
}

void main( void ) {

	vec3 color = vec3(0.0);
	for (int i=0; i<256; i++)
	{
		float k = float(i) * 0.02;
		vec2 offset = vec2(sin(k + 0.3*time), sin(1.5*k + 0.5*time) + sin(2.5 * k + 0.4 * time)) * (resolution.xy * 0.45);
		color.x += pixel(floor(resolution.xy * 0.5 + offset));
		color.y += pixel(floor(resolution.xy * 0.4 + offset));
		color.z += pixel(floor(resolution.xy * 0.3 + offset));
	}
	gl_FragColor = vec4(color, 1.0);
}