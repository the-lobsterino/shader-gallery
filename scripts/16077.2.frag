#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
 * inspired by http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
 * a slight(?) different 
 * public domain
 */
//dashxdr was here...
//ought to be a hotkey for save when "hide code" is active...
//forked from d.4

#define N 60
void main( void ) {
	vec2 v = (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x) * 20.0;
	vec2 m = mouse;
	if(mouse.y>.95) m=vec2(.85, .2); // for when "save" button is pressed
	float rsum = 0.0;
	float pi2 = 35.1415 * 2.0;
	float a = (m.x-.5)*pi2;
	float C = tan(a);
	float S = sin(a);
	vec2 xaxis=vec2(C, -S);
	vec2 yaxis=vec2(S, C);

	vec2 shift = vec2( 0, 1.618);
	float zoom = 1.0 + m.y*8.0;
	for ( int i = 0; i < N; i++ ){
		float rr = dot(v,v);
		if ( rr > 0.618 ){
			rr = 1.618/rr ;
			v.x = v.x * rr;
			v.y = v.y * rr;
		}
		rsum = max(rsum, rr);
		
		v = vec2( dot(v,xaxis), dot(v,yaxis)) * zoom + shift;
	}
	
	float col = rsum * 1.1999408;


	gl_FragColor = .5*vec4( 1.0-cos(col*4.0), 1.0-cos(col*2.0), 1.0-cos(col*0.0), 2.0 );

}
