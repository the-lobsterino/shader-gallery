#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// simple gamma calibrator

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float triangleWave(float t) {
	return abs(mod(t, 2.0) - 1.0);
}
float d(float t, float min, float max) {
	return (t<min || t>max)?0.0:1.0;
}
void main( void ) {
	float oddy = mod(floor(gl_FragCoord.y),2.);
	float eveny = 1.-oddy;
	float sec = 32.*gl_FragCoord.x/resolution.x;
	float tw1 = eveny*(triangleWave(sec+10.0)/2.+.50);
	float tw2 = triangleWave(sec)*oddy/2.;
	float pat = tw1+tw2;
	vec4 sel = vec4(d(sec,0.,8.),d(sec,8.,16.),d(sec,16.,24.),1.0);
	sel += vec4(d(sec,24.,32.),d(sec,24.,32.),d(sec,24.,32.),1.0);
	float gr = 3.0*mouse.y;
	float gg = 3.0*mouse.y;
	float gb = 3.0*mouse.y;
	//gamma = 1.0;
	vec4 c = vec4( pat, pat, pat, 1.0 );
	c *= sel;
	//c = vec4(1.*eveny,0.,0.,1.);
	c = pow(c,vec4(1.0/gr,1.0/gg,1.0/gb,1.0));
	gl_FragColor = c;
}