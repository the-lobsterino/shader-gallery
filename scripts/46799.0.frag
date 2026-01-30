#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {
	
	const float mao = 3.14159/2.;
	vec2 p = 10.*surfacePosition;//+vec2(time*time,0);
	
	float r = length(p);
	float t = atan(p.x, p.y)+mod(time, mao*4.);
	
	gl_FragColor = vec4(0);
	gl_FragColor = vec4(.5+.125*fract(r/2.));
	
	float m = (r - mod(r-.5, 2.)+.5)/2.;
	//if(r > 2.5){r /= 2.;t += mao+time/2.;t = mod(t*2., mao*2.)/2.;}
	if(r > 2.5){r /= 2.;t += mao+time/2.;t = mod(t*m, mao*2.)/m;}
	//t = mod(t*3., mao*2.)/3.;
	p = r*vec2(sin(t), cos(t));
	
	if(distance(p, vec2(sqrt(2.))) < 0.05){
		gl_FragColor = vec4(1);
		return;
	}
	

}