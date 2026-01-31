#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159;

mat2 rotMat(float angle) {
	angle *= PI / 180.0;
   	float sine = sin(angle), cosine = cos(angle);
   	return mat2( cosine, -sine, 
                 sine,    cosine );
}

vec2 rotate( vec2 target, float angle ) {
	return target * rotMat(angle);
}

vec4 calc( vec2 uv, int i ) {
	vec4 color;
	float val = mod((uv.x + uv.y * 0.1 + time / 10.0) * 12.5, 2.0);
	
	if (val > 0.5 * float(i / 2)) color = vec4(vec3(0.0), 1.0);
	else {
		vec3 mult = vec3(5.0, 0.3, 5.0 * abs(cos(time)));
	
		color.r = fract(-uv * float(i)).y * sin(time) * mult.x;
		color.g = fract(uv).x * sin(time) * mult.y;
		color.b = uv.x * sin(time) * mult.z;
		color.a = 1.0;
	}
	
	return color * (1.0 / pow(2.0, float(i)));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	uv = rotate(uv, uv.y * 60.0);
	vec4 frag_color;
	float time = time * 5.0;
	
	for (int i = 0; i < 10; i++) {
		frag_color += calc(uv, i);
	}

	gl_FragColor = frag_color;
}