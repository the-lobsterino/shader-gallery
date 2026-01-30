#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define N 6

void main( void ) {
	vec2 v = (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x) * 30.0;
	
	float x = v.x;
	float y = v.y;
	
	float t = time * 0.5;
	float r;
	for ( int i = 0; i < N; i++ ){
		float d = 3.0 / float(N) * float(i) * 5.0;
		r = length(vec2(x,y)) + 0.01;
		float xx = x;
		x = x + cos(y +cos(2.*r) + d) + cos(t);
		y = y - sin(xx+cos(2.*r) + d) + sin(t);
	}

	gl_FragColor = vec4( vec3(cos(r*(atan(.1)))), 1.0 );

}