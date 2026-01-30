#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;
uniform vec2 resolution;
uniform sampler2D px;
#define PI 3.14159265358979
#define N 15
void main( void ) {
	float size = 0.04;
	float dist = 0.0;
	float ang = 0.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.012, 0.012, 0.025);
	float time = time/4. - 4.*length(surfacePosition);
	for(int h=0; h<N; h++){
		for(int i=0; i<N; i++){
			float r = .2;
			ang += PI / (float(N+i+h)*.125);
			pos = vec2(cos(ang),sin(ang))*r*cos(time+ang/(float(h) + float(N)))*3.;
			pos *= sin(vec2(sin(ang),cos(ang))*r*cos(time+ang/(float(h) + float(N)))*5.);
			pos -= sin(vec2(sin(ang),cos(ang))*r*cos(time+ang/(float(h) + float(N)))*7.);
			dist += size / distance(pos,surfacePosition);
		}
	}
	gl_FragColor = vec4(color * dist, 1.0);
	
	gl_FragColor += 0.975*pow((texture2D(px, gl_FragCoord.xy/resolution) - gl_FragColor), vec4(1,1.006,1.008,0));
}
//+pk