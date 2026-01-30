#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//by BeastLe9enD (instagram.com/beastle9end)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 hsv2rgb(vec3 c)
{
    	vec3 kl = c;
    	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 4.0);
    	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(float x)
{
	return sin(fract(x * time));	
}

float frwave(float x)
{
	float w = rand(x);
	return 0.4 * exp(sin(pow(0.05 + 1.0, 2.0) * (x - w)));
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution;
	vec2 position = uv * 2.0 - 1.0;
	float v = position.x * 10.0;
	
	float x = 1.0 - smoothstep(0.0, 0.01, distance(frwave(v) / 3.0 + 0.35, uv.y));
	float y = 1.0 - smoothstep(0.0, 0.01, distance(frwave(v + 3.14) / 3.0 + 0.35, uv.y));
	
	float xw = 1.0 - smoothstep(0.0, 0.07, distance(frwave(v) / 3.5 + 0.38, uv.y));
	float yw = 1.0 - smoothstep(0.0, 0.07, distance(frwave(v + 3.14) / 3.5 + 0.38, uv.y));

	vec3 color = vec3(0.0);
	color += mix(vec3(0.0, 0.0, 0.1), vec3(0.0, 0.0, 0.3), uv.y);
	color += xw * hsv2rgb(vec3(uv.x, 1.0, 1.0)) * 0.35;
	color += yw * hsv2rgb(vec3(uv.x + 1.0, 1.0, 1.0)) * 0.35;
		color += x * vec3(0.0, 0.0, 1.0);
	color += y * vec3(0.0, 0.0, 1.0);
	
	gl_FragColor = vec4(color, 1.0);

}