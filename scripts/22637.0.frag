#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

#define PI 3.14159

void main( void ) {

	vec2 p = surfacePosition;
	vec2 aspect = vec2(resolution.x/resolution.y,1.);
	vec2 m = (mouse-0.5)*aspect;
	vec2 vb = texture2D(backbuffer, p*1./aspect+.5).xy*2.-1.; //-1 to +1
	const float e = 1.;
	vec2 vb00 = texture2D(backbuffer, +vec2(-e,-e)/resolution+(p)*1./aspect+.5).xy*2.-1.; //-1 to +1
	vec2 vb01 = texture2D(backbuffer, +vec2(-e,+e)/resolution+(p)*1./aspect+.5).xy*2.-1.; //-1 to +1
	vec2 vb10 = texture2D(backbuffer, +vec2(+e,-e)/resolution+(p)*1./aspect+.5).xy*2.-1.; //-1 to +1
	vec2 vb11 = texture2D(backbuffer, +vec2(+e,+e)/resolution+(p)*1./aspect+.5).xy*2.-1.; //-1 to +1
	vec2 v = vec2(0,0); //-1 to +1
	vec2 pl = p-m;
	float l = length(pl);
	const float pointSize = 0.05;
	if (l < pointSize) {
		float ma = atan(pl.x, pl.y);
		float mr = length(pl);
		v = pl/pointSize; //-1 to +1
	}
	else {
		vec2 stay = vec2(0);
		stay = vb; //optional line
		//v = vb + 1.0*((stay+vb00+vb01+vb10+vb11)/4. - vb);
		
		//http://www.mat.ucsb.edu/~wakefield/594cm/assignment.htm
		float a = 1.0;
		v = (vb + a*(vb00+vb01+vb10+vb11))/(1.+4.*a); // diffuse
	}
	vec3 col = vec3(v*.5+.5, 0); //0 to +1
	gl_FragColor = vec4(col, 1.0);

}