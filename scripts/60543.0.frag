#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x, float y) {
	return fract(abs(sin(sin(123.321+x) * (y+321.123)) * 456.654));
}

float lerp(float a, float b, float t) {
	return a*(1.0-t) + b*t;
}

float perlin(float x, float y) {
	float col = 0.0;
	for (int i = 0; i < 5; i++) {
		float fx = floor(x);
		float fy = floor(y);
		float cx = ceil(x);
		float cy = ceil(y);
		float a = hash(fx, fy);
		float b = hash(fx, cy);
		float c = hash(cx, fy);
		float d = hash(cx, cy);
		col += lerp(lerp(a, b, fract(y)), lerp(c, d, fract(y)), fract(x));
		col /= 2.0;
		x /= 2.0;
		y /= 2.0;
	}
	return col;
}

float dperlin(float x, float y) {
	float d = perlin(x, y)*20.0;
	return perlin(x + d, y + d);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse;
	
	position *= 800.0;
	
	float color = dperlin(position.x, position.y);
		
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}