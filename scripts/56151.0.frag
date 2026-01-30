#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 random(vec2 p){
    return -1.0 + 2.0 * fract(sin(vec2(dot(p, vec2(1527.1, 3711.7)), dot(p, vec2(2629.5, 1853.3)))) * 437658.5453);
}

float noise_perlin (vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = dot(random(i), f);
    float b = dot(random(i + vec2(1., 0.)), f - vec2(1., 0.));
    float c = dot(random(i + vec2(0., 1.)), f - vec2(0., 1.));
    float d = dot(random(i + vec2(1., 1.)), f - vec2(1., 1.));
    vec2 u = smoothstep(0., 1., f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main(void){
	vec2 uv=gl_FragCoord.xy/resolution.xy;
	
	vec3 color1 = vec3(0.0, 0.0, 0.0);
	vec3 color2 = vec3(1.0, 1.0, 1.0);
	
	vec2 pos = vec2(uv*2.0 + time/5.0);

	float n = noise_perlin(pos);
	n *= 3.4;
	
	vec3 finalColor = mix(color1, color2, n );

	gl_FragColor = vec4(finalColor, 1.0);
}
