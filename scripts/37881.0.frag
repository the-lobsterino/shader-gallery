
precision mediump float;


uniform float time;
uniform vec2 resolution;

#define PI 3.14159

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	float sx = 0.1* (p.x + 0.6) * sin( 200.0 * p.y - 10. * time);
	float dy = 4./ ( 100. * abs(p.y - sx));
	dy += (vec2(p.x , 0.)*0.6/(30. * length(p + vec2(p.x, 0.)))).y;
	sx += (vec2(p.y , 0.)*0.1*( p.x + 0.9)*dy).x;
	gl_FragColor = vec4( (p.x + 0.5) * dy, 0.2 * dy, dy, 10. );

}