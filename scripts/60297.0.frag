#ifdef GL_ES
precision highp float;
#endif

float pi = 3.14159265;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )-0.5  ;
	
	p.x *= resolution.x/resolution.y;

	float a = atan( p.y, p.x );
	float r = 0.01+sqrt( dot( p, p ) *0.8);
	
	vec3 v= normalize(vec3(sin(time*0.5),cos(time*0.3),-sin(time*0.8)));

	vec2 uv = vec2( 0.0, 0.0);
	uv.x = mod(   cos( a ) / r + time * 0.5, 1.0 );
	uv.y = mod(   sin( a ) / r + time * 0.06, 1.0 );
	
	float amount = sin( time * 0.5 ) * 0.02;

	vec4 c0 = vec4(v.x,v.y,v.z,1.0);
	vec4 c1 = texture2D( backbuffer, uv + vec2( 0.0, - amount ) );
	vec4 c2 = texture2D( backbuffer, uv + vec2( 0.0, amount ) );
	vec4 c3 = texture2D( backbuffer, uv + vec2( amount, 0.0 ) );
	vec4 c4 = texture2D( backbuffer, uv + vec2( - amount, 0.0 ) );

	gl_FragColor = ( ( c0+c1+c2+c3+c4 ) / 6.0 )  ;

	float border = 0.55;

	if ( p.x < - border || p.x > border || p.y < - border+0.1 || p.y > border-0.1 ) {

		gl_FragColor = vec4( p.x * p.y );

	}

}