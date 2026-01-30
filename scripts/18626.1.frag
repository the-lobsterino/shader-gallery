#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x) {
	return fract(sin(x) * 43758.23);
}
float hash2(vec2 uv) {
	return fract(sin(uv.x * 15.78 + uv.y * 56.20) * 43758.23);
}


mat2 m = mat2(15.78, 35.78, 75.39, 154.27);
vec2 hash22(vec2 uv) {
	return fract(sin(m * uv) * 43758.23);
}



void main( void ) {
     vec2 uv = ( gl_FragCoord.xy / resolution.xy );
     uv = uv * 2.0 - 1.0;
     uv.x *= resolution.x / resolution.y;
//	uv *= 3.0;
	
	vec2 g = floor(uv);
	vec2 f = fract(uv);

	float res = 1.0;
	for(int i = -1; i<=1; i++){
		for(int j = -1; j <= 1; j++){
			vec2 b = vec2(i, j);
			vec2 v = b + hash22(g + b) - f;
			float d = length(v);
			res = min(d, res);
			}
	}
	
	float c = res;
	
	gl_FragColor = vec4(c, c, c, 1.0);
	
}