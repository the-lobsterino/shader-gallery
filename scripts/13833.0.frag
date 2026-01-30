#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
		
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5 + mouse / 8.0;
		
	float d= 1.0;	// d = mouse.x;
	if (p.x > d-0.5) p.x = d-0.5;
	
	float sx =0.3*(p.x+0.5)*sin(20.0*p.x+10.*time);
	float dy =7./(500.*abs(p.y-sx));
	
	float red =.03+1.*sin(.1*p.x);
	float green =.8*dy+0.1*sin(p.x);
	float blue = dy*5.+9.*sin(.1*p.x);
	
	gl_FragColor = vec4( vec3( red, green ,blue) ,1.0 );
}