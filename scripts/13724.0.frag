#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;
	float f = (time+10000.) / 20.;
	
	vec2 t = p;
	p.x = t.x * cos(f) - t.y * cos(f);
	p.y = t.x * sin(f) + t.y * cos(f);
	
	float sx =pow(p.x,0.2)*tan(p.x*f);
	float dy =1./(20.*abs(p.y-sx));
	
	float sy =pow(p.y,0.7)*tan(p.y*f);
	float dx =1./(20.*abs(p.x-sy));
	
	gl_FragColor = max(dy,dx) * vec4(1.);
}
