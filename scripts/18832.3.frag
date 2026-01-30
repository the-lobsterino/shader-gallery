#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash (vec2 uv) {
	vec2 o = mat2(15.3, 32.1, 65.7, 122.3) * uv;
	return fract(sin(o) * 42315.234);
}

vec2 shash (vec2 uv) {
	return hash(uv) * 2.0 - 1.0;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x *= resolution.x/resolution.y;
	uv *= 20.0;
	vec2 g = floor(uv);
	vec2 f = fract(uv);
	//vec2 k = 3.0 * f * f - 2.0 * f * f * f;
	vec2 k = f*f*f*(6.0*f*f - 15.0*f + 10.0);
	
	float res = 0.0;

	vec2 lt = vec2(0.0, 0.0);
	vec2 rt = vec2(1.0, 0.0);
	vec2 lb = vec2(0.0, 1.0);
	vec2 rb = vec2(1.0, 1.0);
	
	int mode = 1;
	if(mode == 0) {
		float LT = dot(normalize(shash(g + lt)), normalize(f - lt));
		float RT = dot(normalize(shash(g + rt)), normalize(f - rt));
		float LB = dot(normalize(shash(g + lb)), normalize(f - lb));
		float RB = dot(normalize(shash(g + rb)), normalize(f - rb));
		
		float t = mix(LT, RT, k.x);
		float b = mix(LB, RB, k.x);
		res = mix(t, b, k.y);
	}
	
	float tl = 0.0, tr = 0.0, bl = 0.0, br = 0.0;
	/*
	tl = length(hash(g + vec2(0.0, 0.0)));
	tr = length(hash(g + vec2(1.0, 0.0)));
	bl = length(hash(g + vec2(0.0, 1.0)));
	br = length(hash(g + vec2(1.0, 1.0)));
	*/
	
	if(mode == 1) {
		tl = dot(shash(g + vec2(0.0, 0.0)), - f + vec2(0.0, 0.0) );
		tr = dot(shash(g + vec2(1.0, 0.0)), - f + vec2(1.0, 0.0) );
		bl = dot(shash(g + vec2(0.0, 1.0)), - f + vec2(0.0, 1.0) );
		br = dot(shash(g + vec2(1.0, 1.0)), - f + vec2(1.0, 1.0) );
		
		float t = mix(tl, tr, k.x);
		float b = mix(bl, br, k.x);
		res = mix(t, b, k.y);
	}
	
	float c = 0.5 + 0.5 * res;
	gl_FragColor = vec4( c, c, c, 1.0 );

}