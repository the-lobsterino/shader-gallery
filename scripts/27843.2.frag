#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 center = vec2(0.5,0.5);



void main( void ) {
	
	float invAr = resolution.y / resolution.x;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	
	float color = 0.0;
	color += sin(position.x*3.0+time*3.0); //move from left to right here
	
	
	//
	float x = (center.x-position.y)*1.0; //center x
	float y = (center.y-position.y) * invAr; //center y	
	float r = -sqrt(x*x + y*y)*2.0; //radius

	color *=  (0.03 / r);
	
	
	float xx = (center.x-position.x);
	float yy = (center.y-position.y) * invAr;
	
	float rr = -sqrt(xx*xx + yy*yy)*0.3;
	
	color *= 0.05/(rr);
	
	//clamp(vec3(color, color,color), vec3(color2, color2,color2));
	
	
	
	
	


	gl_FragColor = vec4( vec3(color, color,color), 1 );
}