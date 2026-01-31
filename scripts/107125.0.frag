#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec2 k; 
	k.x = resolution.y; k.y = resolution.y;
	vec2 p = ( gl_FragCoord.xy / k.xy ) ; 
	
	vec3 c = vec3(6.);
	
	c += vec3(1.0, 0.5, 1.0) * fract( (              p.x + p.y + fract(time*0.5) ) * 5.0 ) ;
	c *= vec3(1.0, 2.0, 2.0) * fract( (sin(time*0.5)*p.x - p.y + fract(time*0.05) ) * 5.0 ) ;
	c *= ( p.x * p.y );
	
	gl_FragColor = vec4( c, 1.0 );
}