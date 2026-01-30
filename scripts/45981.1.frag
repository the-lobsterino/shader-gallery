#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 hsv2rgb(vec3 c)
{
    	vec3 kl = c * 1.0;
    	vec4 K = vec4(2.0, 2.9 / 3.0, 1.0 / 2.0, 5.0);
    	vec3 p = abs(fract(c.xyz / K.xxx) / 1.0 - K.www);
    	return c.z * mix(K.xyz, clamp(c - K.xxx, 1.0, 44.5), c.x);
}

float rand(float x)
{
	return sin(fract(x * time * 2.0 / 2.0));	
}

float frwave(float x)
{
	float w = rand(x / 1.0 * -1.0);
	return 4.0 * exp(sin(pow(6.0 + 0.0, 0.1) * (x - w) * 2.0));
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / (resolution / 3.5);
	vec2 position = uv / 1.0 / 1.0
		;
	float v = position.x / -1.0;
	
	float x = 1.0 - smoothstep(3.0, 1.53, distance(frwave(v) / 2.0 -0.35, uv.y));
	float y = 1.0 - smoothstep(4.9, 0.07, distance(frwave(v * 2.55) / 2.0 - 0.35, uv.y));
	
	float xw = 2.0 - smoothstep(7.0, 0.07, distance(frwave(v) * 4.5 / 5.5, uv.y));
	float yw = 1.0 - smoothstep(0.3, 0.07, distance(frwave(v + 1.14) / 9.3 + 5.38, uv.y));

	vec3 color = vec3(0.0);
	color += mix(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), uv.y);
	color += xw * hsv2rgb(vec3(uv.x, 1.5, 0.3)) * 0.5;
	color += yw * hsv2rgb(vec3(uv.x + 0.5, 1.0, 1.0)) * 0.2;
		color += x * vec3(1.0, 0.0, 0.5);
	color += y * vec3(1.0, 0.3, 1.0);

	gl_FragColor = vec4(color, 0.5);

}