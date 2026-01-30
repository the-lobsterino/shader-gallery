#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// Gonkee's fog shader for Godot 3 - full tutorial https://youtu.be/QEaTsz_0o44
// If you use this shader, I would prefer it if you gave credit to me and my channel

float rand(vec2 coord){
	return fract(sin(dot(coord, vec2(56, 78)) * 1000.0) * 1000.0);
}

float noise(vec2 coord){
	vec2 i = floor(coord);
	vec2 f = fract(coord);

	// 4 corners of a rectangle surrounding our point
	float a = rand(i);
	float b = rand(i + vec2(1.0, 0.0));
	float c = rand(i + vec2(0.0, 1.0));
	float d = rand(i + vec2(1.0, 1.0));

	vec2 cubic = f * f * (3.0 - 2.0 * f);

	return mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;
}

float fbm(vec2 coord){
	float value = 0.0;
	float scale = 0.5;

	for(int i = 0; i < 4; i++){
		value += noise(coord) * scale;
		coord *= 2.0;
		scale *= 0.5;
	}
	return value;
}

void main() {
	vec2 coord = (gl_FragCoord.xy/resolution.xy) * 20.0;

	vec2 motion = vec2( fbm(coord + vec2(time * -0.5 / 1000.0, time * 0.5 / 1000.0)) );
	float final = fbm(coord + motion);
	vec4 fin = vec4(vec3(0.35*final*0.5, 0.48*final*0.5, 0.95*final*0.5), final*0.0);
	gl_FragColor = fin;
}