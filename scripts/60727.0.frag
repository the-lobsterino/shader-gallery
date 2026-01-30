#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define TWO_PI 6.2831
#define r .5

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float orb(vec2 pt, float i){
	float v = time/60.;
	return 1./(r*distance(pt+vec2(70.*cos(i*(v*TWO_PI)), 70.*sin(i*(v*TWO_PI))), gl_FragCoord.xy));
}

void main(void){
	vec2 pt = resolution.xy/2.;
	float v = time/60.;
	float u = 0.;
	u += orb(pt, 1.);
	u += orb(pt, 2.);
	u += orb(pt, 3.);
	u += orb(pt, 4.);
	u += orb(pt, 5.);
	u += orb(pt, 6.);
	u += orb(pt, 7.);
	gl_FragColor = vec4(u*0.4, u*0.6, u, 1.);

}