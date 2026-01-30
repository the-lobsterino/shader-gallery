#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 boxPosition = mouse * resolution;
vec2 boxSize = vec2(256, 256);

bool inBox(vec2 point){
	return point.x >= boxPosition.x && point.y >= boxPosition.y && point.x <= boxPosition.x + boxSize.x && point.y <= boxPosition.y + boxSize.y;
}

void main( void ){
	vec2 coord = gl_FragCoord.xy;
	if(inBox(coord)){
		vec2 coordInBox = (coord - boxPosition) / boxSize;
		gl_FragColor = vec4(coordInBox,1,1);
	}else discard;
}