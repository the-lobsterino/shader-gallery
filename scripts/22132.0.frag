#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 comp_mul(vec2 z1, vec2 z2) {
	return sin(vec2(z1.x*z2.x - z1.y*z2.y, z1.x*z2.y + z1.y*z2.x));
}

vec2 comp_conj(vec2 z) {
	return vec2(z.x, -z.y);
}

float comp_module(vec2 z) {
	return (length(z));
}

vec2 comp_div(vec2 z1, vec2 z2) {
	return comp_mul(z1, comp_conj(z2) / dot(z2, z2) );
}

float square_wave(float x) {
	/*if (x - floor(x) < 1.0)
	//if (x > 0.5)
		return 1.0;
	else
		return 0.0;*/
	return mod(floor(x), 2.0) < 0.001 ? 1.0 : 0.0;
}

vec4 pos2col(vec2 pos) {
	float x = pos.x;
	float y = pos.y;
	float c = 0.001;
	return vec4(square_wave(x*x * exp(-c*x*x)), square_wave(x * exp(-c*y*y)), 0.0, 1);
	//return vec4(square_wave(x * exp(-c*abs(x))), square_wave(y * exp(-c*abs(y))), 0.0, 1);
	//return vec4(square_wave(x), square_wave(y), 0.0, 1);
	//return vec4(cos(pos.x), sin(pos.y), 0.0, 1.0);
	//return vec4(0.5*(1.0 + cos(pos.x)), 0.5*(1.0 + sin(pos.y)), 0.0, 1.0);
	//return vec4(cos(pos.x / (pos.x*pos.x)), 0.0, 0.0, 1.0);
	//return vec4(cos(x * exp(-0.001*x*x)), 0.0, 0.0, 1.0);
}

vec2 moebius_transform(vec2 a, vec2 b, vec2 c, vec2 d, vec2 z) {
	return comp_div(comp_mul(a, z) + b, comp_mul(c, z) + d);
}

vec2 moebius_transform_inverse(vec2 a, vec2 b, vec2 c, vec2 d, vec2 z) {
	return comp_div(comp_mul(d, z) - b, comp_mul(-c, z) + a);
}

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	float ratio = resolution.x / resolution.y;
	//vec2 coord = uv;
	vec2 z = (uv - vec2(0.5, 0.5)) * 2.0;
	z.x *= ratio;
	//z *= 2.0;
	//z += vec2(1.0, 0.0);

	float t = time / 4.0;
	
	//vec2 a = vec2(cos(time), sin(time));
	vec2 a = vec2(1.0, 0.0);
	//vec2 b = vec2(sin(time), 0.0);
	vec2 b = vec2(0.0, 0.0);
	//vec2 c = vec2(cos(t), sin(t));
	vec2 c = vec2(sin(t), 0.0);
	//vec2 c = vec2(0.5*(1.0+cos(t)), 0.0);
	//vec2 c = vec2(1.0, 0.0);
	//vec2 c = vec2(0.0, 0.0);
	vec2 d = vec2(1.0, 0.0);
	
	
	z = moebius_transform_inverse(a, b, c, d, z);
	//z = moebius_transform(a, b, c, d, z);
	//z = comp_div(z, vec2(1.0, 0.0));
	//z = z / 1.7;

	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor = pos2col(z);
	//gl_FragColor = vec4(1.0 / 1.8, 0.0, 0.0, 1.0);
}