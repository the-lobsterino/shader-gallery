#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
//bpt.riffing.2017

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D S2;
#define T2(D) texture2D(S2, (D+gl_FragCoord.xy)/resolution)
varying vec2 surfacePosition;
//#define surfacePosition vec2(surfacePosition/dot(surfacePosition,surfacePosition))
//#define p vec2(surfacePosition/dot(surfacePosition,surfacePosition))
//#define p0 surfacePosition
#define time (sin(time) * 0.0134567)

void main( void ) {
	//vec2 sup = surfacePosition/dot(surfacePosition,surfacePosition);
	vec2 s = gl_FragCoord.xy/resolution;
	vec2 sup = s / dot(s, s) / 2.0 + 0.5;
	vec4 d = T2(-2.*normalize(sup));
	vec2 sp = sup/dot(sup,sup);
	vec2 p = sp /cos(time*12.*3.14159);
	
	if(cos(time/22.+dot(p,p)*27.+cos(p.x*13.)*cos(p.y*5.)*27.) < -.27){
		gl_FragColor = vec4(1.)*min(1., 1./(10.-10.*length(p)))-cos(time*time)*4./256.;
		return;
	}
	
	d.a -= 4./256.;
	int g = int(floor(mod(64.*d.a, 4.)));
	
	if(g == 0){
		gl_FragColor = vec4(d.a);
		return;
	}
	
	gl_FragColor = fract(mix(vec4(g==1,g==2,g==3,1), vec4(0), 1.-pow(abs(d.a),0.05)));

}