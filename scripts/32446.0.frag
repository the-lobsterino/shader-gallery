#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceToLine(vec2 p1, vec2 p2, vec2 point) {
    float a = p1.y-p2.y;
    float b = p2.x-p1.x;
    return abs(a*point.x+b*point.y+p1.x*p2.y-p2.x*p1.y) / sqrt(a*a+b*b);
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*2.0-vec2(1.0);
		pos *= vec2(resolution.x/resolution.y,1.0);
	vec2 m = ( mouse.xy )*2.0 -vec2(1.0);
	

	vec3 c = vec3(0.0);
	
	
	vec2 p1 = m;
	vec2 p2 = vec2(-1.0 * (resolution.x / resolution.y), -1);
	vec2 point = vec2(1.0,0.5)-pos;
	
	
	float distToLine = distanceToLine(p1,p2,pos);
	float distToPoint = length(point);

	
	c = vec3(smoothstep(0.0,0.01,distToLine))*2.;
	
	c.b = c.p *smoothstep(0.0,distToPoint,distToLine)*2.;

	
	
	gl_FragColor = vec4( (c)/2.0, 1.0 );
}