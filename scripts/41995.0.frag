#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 pixelCoord(vec2 Coord, float scale) {
	return (vec2(floor(Coord))+0.5) / scale;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float scale = 20.0;//10.0 / mouse.x;
	vec2 pixel = (fract(uv * scale) - 0.5);
	vec3 color = vec3(1.0 / length(pixel) * 0.02);
	color += (1.0 / length(uv - pixelCoord(vec2(10.0 *sin(time), 10.0 * cos(time)), scale)) * 0.01) * vec3(1.0, 0.0, 0.0);
	for (int i = 0; i <= 10; ++i)
	color += (1.0 / length(uv - pixelCoord(vec2(10.0 *sin(time + 2.0 * 3.1415 * float(i) / 10.0), 10.0 * cos(time * float(i) / 10.0 + 2.0 * 3.1415 * float(i) / 10.0)), scale)) * 0.01) * vec3(0.0, float(i) / 10.0, 1.0 - float(i) / 10.0);
	
	gl_FragColor = vec4(vec3(color), 1.0);
}
