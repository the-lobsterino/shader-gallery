#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 rgb(int x, int y, int z){
	return vec4(x,y,z,255)/255.;	
}
uniform sampler2D s2;
varying vec2 surfacePosition;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	
	vec2 p = surfacePosition*20.;
	vec2 r = vec2(length(p), atan(p.x, p.y));
	float t = time * 0.1;
	vec2 z = r.x*vec2(cos(r.y*1.5+t*2.222222222), sin(r.y*pow(3.,10.*length(mouse-.5))-t*2.+(pow(10., 2.*cos(t*.123))/(pow(10., 2.*cos(t*.112233))+r.x))));
	//gl_FragColor = vec4(position.x);
	//gl_FragColor = vec4(position.y);
	gl_FragColor = vec4(0,0,0,1);
	gl_FragColor.rgb += length(z*vec2(cos(t), sin(t)));
	gl_FragColor = mix(
		texture2D(s2, gl_FragCoord.xy/resolution)
		, gl_FragColor
		, (4./255.)+pow(abs(position.x-.5)*abs(position.y-.5), 2.)
	);
}