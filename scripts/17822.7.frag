// http://glsl.heroku.com/e#17822.2
// diagonal stripes
// jkozniewski

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 getRotatedCoords( vec2 coords, vec2 rotationAnchor, float rotation ){
	
	float angle = atan(coords.y - rotationAnchor.y, coords.x - rotationAnchor.x); // get angle between current uv coord and center
	float newAngle = angle + rotation; // offset original angle by certain rotation
	
	float len = length(coords - rotationAnchor); // radius
	vec2 rotatedCoords = vec2( len * cos(newAngle), len * sin(newAngle) ); // new rotated coords
	
	return rotatedCoords;	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 center = vec2( 0.5, 0.5 );
	
	vec2 rotatedCoords = getRotatedCoords( position, center, 0.785398163 );
	float offset = time*0.1;
	float frequency = 50.0;
	
	float sine = float(abs( sin( ( rotatedCoords + offset ) * frequency ) ));
	vec4 color = vec4( step( sine, 0.8 ) );
	
	gl_FragColor = color;

}