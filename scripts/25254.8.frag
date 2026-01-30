#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float linespan = 5./length(resolution);
float drawLine( vec2 p, vec2 a, vec2 b )
{
	vec2 aToB = b - a;
	vec2 aToP = p - a;
	
	float t = length( aToP ) / length( aToB );
	if( t < 0.00 || t > 1.0 )
		return 0.00;
	
	vec2 p1 = mix( a, b, t );
	float r = length( p1 - p );
	if( r <= 0.005 )
		return (linespan-r)/linespan;

	return 0.0;
}
vec2 rotate(vec2 v, float angle) {
	//mat2 rot = mat2(cos(angle),sin(angle),-sin(angle),cos(angle)); //rot * v
	vec2 o = vec2(0);
	o.x = cos(angle)*v.x-sin(angle)*v.y;
	o.y = sin(angle)*v.x+cos(angle)*v.y;
	return o;
}
void main( void ) {

	vec2 p = surfacePosition*3.;
	vec3 c = vec3(0.0);
	
	vec3 v = vec3(1,1,0);
	//c = cross(vec3((p),0),(v))*length(p);
	
	vec2 pCenter = vec2(0,0);
	vec2 pScale = vec2(2,1);
	float angle = time;
	
	vec2 p0 = pCenter - pScale / 3.; //center of mass
	vec2 p1 = p0;	p1.x += pScale.x;
	vec2 p2 = p0;	p2.y += pScale.y;
	vec2 v0 = rotate(p0-pCenter,angle).xy;
	vec2 v1 = rotate(p1-pCenter,angle).xy;
	vec2 v2 = rotate(p2-pCenter,angle).xy;
	vec2 pr0 = pCenter + v0;
	vec2 pr1 = pCenter + v1;
	vec2 pr2 = pCenter + v2;
	
	c.r = 1.-step(0.2,length(p-pr0));
	c.g = 1.-step(0.2,length(p-pr1));
	c.b = 1.-step(0.2,length(p-pr2));
	
	c += 1.-step(0.1,length(p-pCenter));
	
	c += drawLine(p,pr0,pr1);
	c += drawLine(p,pr1,pr2);
	c += drawLine(p,pr2,pr0);
	
	gl_FragColor = vec4( c, 1.0 );
	
}