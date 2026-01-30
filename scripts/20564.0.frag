#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec2 a; 
	a.x = resolution.y; a.y = resolution.y;
	vec2 p = ( gl_FragCoord.xy / a.xy ) * 1.25;
	vec2 q = vec2( cos(p.x), sin(p.y) );
	float time = time + q.x * q.y + length( q );
	
	vec3 c = vec3( 0.0 );
	
	c += vec3(1.0, 0.5, 1.0) * fract( (              p.x - p.y + fract(time*0.07) ) * 5.0 ) ;
	c -= vec3(1.0, 7.0, .3) * fract( (sin(time*0.5)*p.x - p.y + fract(time*0.05) ) * 5.0 ) ;
	c += ( p.x * p.y );
	
	gl_FragColor = vec4( c, 1.8 );
}