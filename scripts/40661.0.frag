#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;

bool pointcheck( vec3 a, vec3 b, vec3 c, vec3 p) {
	return(((b.x - a.x) * (p.y - a.y) > (b.y - a.y) * (p.x - a.x)) &&
	   ((c.x - b.x) * (p.y - b.y) > (c.y - b.y) * (p.x - b.x)) &&
	   ((a.x - c.x) * (p.y - c.y) > (a.y - c.y) * (p.x - c.x))
	  );
}

void main( void ) {

	vec3 p;
	p.xy = surfacePosition;

	vec3 color = vec3(0.0);
	
	vec3 a = vec3(0.1,0.4,1.0);
	vec3 b = vec3(-0.5,-0.2,1.0);
	vec3 c = vec3(0.5,-0.30,1.0);
	
	if(pointcheck(a,b,c,p)) color += 0.5;
	
	gl_FragColor = vec4( color, 1.0 );

}
