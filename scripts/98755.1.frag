#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
//p.x+=time*0.25;
	float x = p.x*2.;
	float y = p.y*2.;
	float m = 1.-(y*1.5)*(2.+sin(-time*0.5)*.6)*.300+sin(y*2.+x*4.-time*1.)*
		sin(y*.7-x*6.-time+sin(x*1.-y*.2-time*.1)+cos(0.5-y*1.50+x*3.)*.5)*2.;
	gl_FragColor = vec4( sin(abs(atan(p.x-0.50,p.y+10.5))),m*.5,m*10.0, 1.0 );

}