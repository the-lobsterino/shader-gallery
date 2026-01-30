precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smoothlin(float x) {
	return 0.5 - 0.5 * cos(3.1415 * x);
}

float sinusoider(float x, float d, float f) {
	float p = d * f;
	float freq = pow(2.0, floor(p));
	float t = p - floor(p);
	return 0.5 + 0.5 * (cos(x * freq) * smoothlin(1.0 - t) + cos(x * freq * 2.0) * smoothlin(t));
}

void main( void ) {

	vec2 pos = ( (gl_FragCoord.xy / resolution.x - vec2(0.5, 0.25)) )*4.0;

	vec3 color = vec3(0);
	
	float param1 = 10.0*mouse.x;
	float param2 = 10.0*mouse.y;
	
	float d = length(pos);
	float ang = atan(pos.y, pos.x);
	
	//float b = 0.5 + 0.5*cos(exp(d*param1));
	float b = sinusoider(d, d, param1);
	
	float a = sinusoider(ang, d, param2);
	
	float c = sinusoider(ang, d, param2 * 0.9);
	
	float cc = sinusoider(d, d, param1 * 0.9);
	
	
	color = vec3(b * a, b * c, cc * a);
	
	gl_FragColor = vec4(color, 0);
	//gl_FragColor = vec4(0);

}