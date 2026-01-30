// Yo.. someone should fix up that android app that was integrated with th'old 'glsl.herok...'


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time * 0.17

varying vec2 surfacePosition;
uniform sampler2D backbuffer;
vec2 cross_2(vec2 a, vec2 b){
	return vec2(a.x*b.y-a.y*b.x, -a.x*b.y+a.y*b.x);
}
void main( void ) {
	vec2 ir = vec2(1.)/resolution.xy;
	vec2 p = ( gl_FragCoord.xy * ir );

	vec2 c = vec2(0.5);
	
	c += 0.15*sin(time-p.x*3.);
	c += 0.15*sin(pow(time+p.y*6.-cos(time), 0.987654321));
	
	c.yx = 0.2-cross_2(c.xy, p*cos(time+length(1./(p+0.5))));
	
	gl_FragColor = c.yxxy*(0.7+0.3*sin(length(p)+time-gl_FragCoord.x+gl_FragCoord.y));
	
	gl_FragColor *= 0.03;
	gl_FragColor += 0.97*(
		texture2D(backbuffer, p+vec2(-1.)*ir)
		+texture2D(backbuffer, p+vec2(-1., 0.)*ir)
		+texture2D(backbuffer, p+vec2(-1., 1.)*ir)
		+texture2D(backbuffer, p+vec2(0., -1)*ir)
		+texture2D(backbuffer, p+vec2(0., 1.)*ir)
		+texture2D(backbuffer, p+vec2(1., -1.)*ir)
		+texture2D(backbuffer, p+vec2(1., 0.)*ir)
		+texture2D(backbuffer, p+vec2(1.)*ir)
		)/8.;
	
	
}