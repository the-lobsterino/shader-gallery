#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 surface;
#define PI 3.1415926535897932384626433832795
#define scale .02
 
void main() {
	
    	float v = 0.0;
	
	vec2 d = vec2(0.0);
	
	vec2 r = resolution / 2.0;
	
    	vec2 c = (gl_FragCoord.xy - r ) * scale - scale / 2.0;
	
    	v += sin( ( c.x + time  * PI) );
	
   	v += sin( ( c.y + time * 5.0 ) / 2.0 );
	
    	v += sin( ( c.x + c.y - time ) / 2.0 );
	
	v += sin( ( c.x - c.y + sin( time * 2.0 ) ) / 4.0 ) * 2.0;
	
	v += sin( ( c.x * sin( time / 2.0 ) + c.y * cos( time / 3.0 )) + time);
	
	d = c + (r / 20.0) * vec2( sin( time / 5.0), cos( time / 3.0 ));
	
    	v += sin( sqrt( d.x * d.x + d.y * d.y + 1.0 ) + time );
	
    	v = v / 2.0;
	
    	vec3 col = vec3(cos(PI * v), sin(PI * v), 0);
	//vec3 col = vec3(cos(PI * v), 0, 0);
	//vec3 col = vec3(sin(v));
	
    	gl_FragColor = vec4(col, 1);
}