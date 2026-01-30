#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2
 resolution;



void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	float sx = 0.3 * (p.x + 0.8) * sin( 900.0 * p.x - 1. * pow(time, 0.55)*5.);
	
	float dy = 4./ ( 5000. * abs(p.y - sx));
	
	dy += 1./ (25. * length(p - vec2(p.x, 0.)));
    vec3 c=vec3((p.x + 0.1) * dy, 0.3 * dy, dy);
   if((c.r+c.g)<0.06)discard;
	gl_FragColor = vec4( c*1.5, 1.1 );

}