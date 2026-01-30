#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 3.14159265

void rotate2D (inout vec2 vertex, float rads)
{
  mat2 tmat = mat2(cos(rads), -sin(rads),
                   sin(rads), cos(rads));
 
  vertex.xy = vertex.xy * tmat;
}

void main( void ) {

	
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	p.x /= resolution.y/resolution.x * vec2((32.0 * sin(time*0.1)), 16.0 * cos(time*0.12));
	
	rotate2D(p, (-55.0*PI/6.) );
	
	float x = p.x;
	
	float t = atan(p.y,p.x);
	
	float h = t / (4.0* PI) * 6.0 * time;
	
	
	rotate2D(p, floor(2.0+h)*(-2.0*PI/6.0) *time*0.01);
	
	
	
	
	float dy = 1./ ( 50. * abs(length(p.y) - 0.3));
	
	gl_FragColor = vec4( (x + 0.2) * dy, 0.5 * dy, dy, 1.0 );

}