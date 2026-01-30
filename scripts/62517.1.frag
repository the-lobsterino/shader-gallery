// necip's heart https://www.youtube.com/watch?v=dXyPOLf2MbU
// mixed with gls sandbox demo

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define S(a,b,t) smoothstep(a,b,t)

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy; // 0 <> 1
    	uv -= .5;
    	uv.x *= resolution.x/resolution.y;
	
	uv.y -= sqrt(abs(uv.x))*0.5;
	float d = length(uv);
	float h = S(.3,.28, d);
	
	float c = h;
	c += sin( uv.x * cos( time / 15.0 ) * 80.0 ) + cos( uv.y * cos( time / 15.0 ) * 10.0 );
	c += sin( uv.y * sin( time / 10.0 ) * 40.0 ) + cos( uv.x * sin( time / 25.0 ) * 40.0 );
	c += sin( uv.x * sin( time / 5.0 ) * 10.0 ) + sin( uv.y * sin( time / 35.0 ) * 80.0 );
	c *= sin( time / 10.0 ) * 0.5;
	

	gl_FragColor = vec4( vec3( h, c * 0.5, sin( c + time / 3.0 ) * 0.75), 1.0);	
}