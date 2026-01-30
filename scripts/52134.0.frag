#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 x){
    return fract(sin(dot(x, vec2(12.9898, 12.9898 * 1.321))) * 43758.5453);
}

float valuenoise2D(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x), mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0)), u.x), u.y);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	     color += valuenoise2D(position * 55.0);

	gl_FragColor = vec4(color, 1.0 );

}