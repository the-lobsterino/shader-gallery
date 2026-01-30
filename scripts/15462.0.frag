#ifdef GL_ES
precision mediump float;
#endif

// amiga ball...
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = atan(1.)*4.;


void main( void ) {

	vec2 res = vec2(resolution.x/resolution.y,1.0);
	vec2 cen = (res / 2.0);
	vec2 sc = vec2(sin(time*0.), -abs(-cos(time*0.)))*0.25;
	vec2 p = ( gl_FragCoord.xy / resolution.y ) - cen;
	vec2 m = vec2(0,1.);
	
	vec3 col=vec3(0.0);
	
	float radius = 0.1;
	p += sc;
	float height = sqrt(dot(vec3(radius, p), vec3(-radius, p)));
	vec3 normal = normalize(vec3(p.x,p.y,height));
	
	float shad = dot(normal,vec3(-0.5, .5, 1.));	
	
	col = vec3(shad);				
	
	gl_FragColor = vec4( vec3(col), 1.0 );
}