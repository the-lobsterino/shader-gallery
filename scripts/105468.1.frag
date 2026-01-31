#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 mouse;
uniform vec2 resolution;
#define g gl_FragColor
void main( void ) {
#define res resolution
	vec2 position = ( gl_FragCoord.xy - res/2. )/res.y;
        vec2 m;     m = (       mouse*res - res/2. )/res.y;
	vec2 d,d2;float c,c2 = 0.;
d = position.xy - m;d2 = position.xy - vec2(0.15,0.165656566);
c+=.05/(0.4-sqrt(d.x*d.x+d.y*d.y));
c2+=.07/(sqrt(d2.x*d2.x+d2.y*d2.y));
g = vec4( vec3(0.5*c), 1.0 );g+= vec4( vec3(0.5*c2), 1.0 );
g.xyz = 1. - exp( -g.xyz );
}