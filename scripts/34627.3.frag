#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


/**
 * Returns the distance from pos to the closest position on the segment, as well as the relative position of the closest position on the segment.
 */
vec2 distanceToSegment(vec2 pos, vec2 p1, vec2 p2) {
	
	vec2 segment = p2 - p1;
	float segLen = length(segment);
	vec2 segNormal = segment / segLen;

	float relSegPos = clamp(dot(segNormal, pos - p1) / segLen, 0., 1.);

	vec2 closestPointOnSegment = p1 + relSegPos * segment;
	
	return vec2(length(pos - closestPointOnSegment), relSegPos);
}

float relativePositionOnSegment(vec2 pos, vec2 p1, vec2 p2) {

	vec2 c = pos - p1;
	vec2 v = normalize(p2 - p1);
	float d = length(p2-p1);
	float t = dot(v, c) / d;
	
	return clamp(t, 0., 1.);
}

vec2 closestPositionOnSegment(vec2 pos, vec2 p1, vec2 p2) {

	vec2 c = pos - p1;
	vec2 v = normalize(p2 - p1);
	float d = length(p2-p1);
	float t = dot(v, c);
	t = clamp(t, 0., d);
	
	return p1 + t * v;
}


float distanceToLine(vec2 pos, vec2 p1, vec2 p2) {

	vec2 dir = p2 - p1;
	vec2 normal = normalize(vec2(dir.y, -dir.x));	
	vec2 posToP1 = p1 - pos;

	return dot(normal, posToP1);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	
	vec2 p1 = vec2(0.3, 0.4);
	vec2 p2 = vec2(0.7+0.3*cos(time*1.3), 0.6+0.6*sin(time));
	
	
	float line1 = length(position - closestPositionOnSegment(position, mouse, p2));
	float line2 = length(position - closestPositionOnSegment(position, mouse, p1));
	float line3 =  length(position - closestPositionOnSegment(position, p2, p1));
	
	// Combine lines
	//float line = min(min(line1,line2),line3);

	// Segment thingy
	vec2 ds = distanceToSegment(position, p1, mouse);
	float line = ds.x;
	float linePos = ds.y;
	
	// Funky
	//float line = line1*line2*line3*10.;

	
	vec3 color = vec3(1.0) - sign(line) * vec3(0.1,0.4,0.7);
    	color *= (1.0 - exp(-4.0*abs(line))) * (0.8 + 0.2*cos(140.*line));
	
	if (abs(line) < 0.01) color += cos(150.*line);
	color += vec3(-0.5, 0.5, 0.25) * linePos;
	
	gl_FragColor = vec4( color, 1.0 );

}