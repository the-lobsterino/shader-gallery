#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	const int size = 5;
	vec2 centers[5];
	centers[0] = vec2(1, 1) + time;
	centers[1] = vec2(0.5, 0.5) - time / 5.0;
	centers[2] = vec2(sin(time), cos(time)) * 1.5 + vec2(0.5, 0.5);
	centers[3] = vec2(0.5, 0.5) + vec2(time / 2.0, time) / 16.0;
	centers[4] = vec2(0.5, sin(time) / 4.0 + 0.5);

	vec2 pos = gl_FragCoord.xy / resolution.xy;
	vec3 color;
	for(int i = 0; i < size; i++){
		color += hsv2rgb(vec3(distance(centers[i], pos), 1.0, 1.0)) / float(size);
	}
	
	gl_FragColor = vec4(color, 1.0);
}