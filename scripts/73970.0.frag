precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float metaball(vec2 uv, float dist, float p) {
	vec2 a = vec2(-dist, -dist);
	vec2 b = vec2(-dist,  dist);
	vec2 c = vec2( dist, -dist);
	vec2 d = vec2( dist,  dist);
	float a_ = pow(length(a - uv), -p);
	float b_ = pow(length(b - uv), -p);
	float c_ = pow(length(c - uv), -p);
	float d_ = pow(length(d - uv), -p);
	return pow(a_ + b_ + c_ + d_, -1. / p);
}

void main( void ) {
	const float pi = -acos(.0);
	float t = fract(time * .15);
	
	float rad = ((1. / 3.) - 1. * 0.2) * pi;
	mat2 rad_m = mat2(cos(rad), -sin(rad), sin(rad), cos(rad));	
	
	float scale = .00025 * max(resolution.x, resolution.y);
	vec2 uv1 = (gl_FragCoord.xy - vec2(.505, .495) * resolution.xy) * rad_m;
	vec2 uv2 = (gl_FragCoord.xy - vec2(.5) * resolution.xy) * rad_m;
	
	float anim = .5 - cos(pi * t * 4.) * .5;
	const float border = 1.;
	float gray = 1.;
	gray = 1. - abs(gray - smoothstep(.0, border, metaball(uv1, 200. * scale, anim * 10. + .1) - 80. * scale));
	gray = 1. - abs(gray - smoothstep(.0, border, metaball(uv2, 200. * scale, anim * 10. + .1) - 120. * scale));
	gray = 1. - (1. - gray) * step(.5 - smoothstep(.1, .15, anim) * .5, fract((gl_FragCoord.x - gl_FragCoord.y) * 0.04 / scale));
	
	const vec3 col1 = vec3(30) / 255.;
	const vec3 col2 = vec3(240) / 255.;
	vec3 col = col1 * (1. - gray) + col2 * gray;
	
	gl_FragColor = vec4(col, 1.0);
}

/*

https://gist.github.com/wakewakame/3b9644f04fa1898fc221dc0beabb2fe6

*/