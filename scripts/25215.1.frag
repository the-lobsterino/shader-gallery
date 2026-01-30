#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand( vec2 p)
{
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= .5;
	uv.x *= resolution.x / resolution.y;
	
	// gl_FragColor = vec4(vec3( 3. * sin(7. * time * length(10.*uv)), 10. * cos(7. * time * length(3.*uv)), sin(length(400.*uv))), 1.);
	
	/*const float PI = 3.14159265358979323846264; 
	// float a = atan(uv.x, uv.y ) * 0.5/PI; 
	float a = uv.x * uv.y;
	float r = uv.y * uv.y; 
// 	float twist = fract(-1.*r+time+a);	 
	float twist = a + r * sin(time) * 10.;
	gl_FragColor = vec4(vec3( twist * 4., twist * 2., twist * 10. ), 1.);*/
	
	float xspeed = 3.;
	float yspeed = 5.;
	float width = 1. / 1.3;
	float heigth = 1. / 3.;
	vec2 center = vec2(sin(xspeed * time) * width, cos(yspeed * time) * heigth);
	
	vec3 col = vec3( .0, .0, .0 );
	if ( length( uv - center ) < 0.3 * (sin(time) + 1.) / 2. )
	{
		col = vec3(length( uv)); 
	}
	
	gl_FragColor = vec4(col, 1.);
	
	// gl_FragColor = 	vec4(vec3(uv.x * uv.x), 1.);
}