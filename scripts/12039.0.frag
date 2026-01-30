#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	float a = atan( p.y, p.x );
	float r = mod( dot( p, p ),1.0 );
	float s = r / (1.0*sin(time*0.235));
	vec2 uv = vec2( mod(cos( a ) / s + time * 0.05, 1.0 ),
	mod( sin( a ) / s + time * 0.06, 1.0 ) );
	float w = pow(max(1.5-r,0.0),2.0);
	vec4 color0 = texture2D( backbuffer, uv );
	gl_FragColor = (  color0  + pow( 1.0 - w, 3.0 ));

}