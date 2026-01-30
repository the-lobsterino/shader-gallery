#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
	vec2 p = gl_FragCoord.xy / resolution.x * 1.0;
	vec2 pos = -vec2(0.5, resolution.y / resolution.x * 0.5)- 0.1 * vec2(4.0 * cos(time), sin(time));
	
	bool c = length(pos + p  ) < 0.1;
	
	gl_FragColor = vec4(float(c) * hsv2rgb(vec3((p + pos).x * 4.0, 1.0, 1.0)), 1.0);
}
