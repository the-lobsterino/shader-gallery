#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand( vec2 pos ) {
	float f = cos(pos.x * 0.32) * pos.x * 0.4 + cos(pos.y * 0.21) * pos.x * 0.77;
	return sin(f * f) * 0.5 + 0.5;
}

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy + vec2(128.0, 128.0) * 128.0;

	float f = 0.0;
	float x = 128.0;
	for (int i = 0; i < 11; i++ ) {
		f = (f * 4.0 + rand(vec2(floor(position.x / x), floor(position.y / x)))) / 3.0;
		x /= 2.0;
	}
	f = f * 0.07;

	gl_FragColor = vec4( hsv(f, 1.0, 1.0) , 1.0 );

}