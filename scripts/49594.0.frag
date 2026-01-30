#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define N 10

void main( void ) {
	vec2 v = (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x) * 30.0;
	
	float x = v.x;
	float y = v.y;
	
	float t = time * 0.6;
	float r;
	for ( int i = 0; i < N; i++ ){
		float d = 3.14159265 / float(N) * float(i) * 9.0;
		r = length(vec2(x,y)) + 0.9;
		float xx = x;
		float yy=y;
		x = x + sin(yy +cos(2.*r) + d) + cos(t);
		y = y - atan(xx+atan(2.*r) + d) + atan(t);
	}

	gl_FragColor = vec4( vec3(tan(r*(atan(.3)))), 1.0 );

}