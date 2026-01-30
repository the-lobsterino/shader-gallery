// checkered "tunnel" with camera rotation + mouse
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 check(vec2 p, float s)
{
float r = 2.;//length(p);
float a = atan(p.x,p.y);
float f = cos(p.y*12.0/(r*r) + time)*cos(p.x* 3.0/(r*r) + time);
return vec3( cos(a+0.0), cos(a+0.5), cos(a+1.0) ) *f + f*f*f*f + 0.2/r;
}

void main( void ) {
	
	//float speed = mouse.x * 2.0;
	vec2 position = ( gl_FragCoord.xy / resolution ) - mouse ;
	vec3 col = vec3(1.0);
	vec2 uv;
	vec2 p = position * 2.0;
	
	p *= vec2( resolution.x/resolution.y, 1.0 );
	//p = vec2(cos(speed) * p.x + sin(speed) * p.y, -sin(speed) * p.x + cos(speed) *p.y);
	
	float y = length(p);

	uv.x = (p.x/y)+time+time+time;
	uv.y = (1. / abs(y) + .0 * .5) + time;
	col = check(uv, .10);
	float t = pow(abs(y), 1.0);

	gl_FragColor = vec4( col * t, 1.0 );
}