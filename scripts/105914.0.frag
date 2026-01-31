#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 col;
vec2 pos;
vec3 rect( vec2 pos, float x ,float y, float w, float h, vec3 col0, vec3 col1 )
{
	vec3 result = col0;
	if ( pos.x > x && pos.x < (x + w) 
	  && pos.y > y && pos.y < (y + h) )
	{
		result = col1;
	}
	
	return result;
}
void sub_city2(float startpos){
	col = rect( pos, startpos+0.3, 0.3, .5, 2.2, col, vec3( 0.72, 0.50, 0.750 ) );
	col = rect( pos, startpos+0.5, 0.5, 3.3, 20.5, col, vec3( 0.75, 0.50, 0.750 ) );
	col = rect( pos, startpos+0.98, 0.4, 2.3, 1.5, col, vec3( 0.61, 0.50, 0.750 ) );
	col = rect( pos, startpos+2.8, 1.32, .1, 0.75, col, vec3( 0.75, 0.50, 0.750 ) );
	col = rect( pos, startpos+3.4, 1.33, 3.31, 0.9, col, vec3( 0.75, 0.50, 0.750 ) );
	col = rect( pos, startpos+4.4, 0.3, .31, 0.9, col, vec3( 0.85, 0.50, 0.750 ) );
	col = rect( pos, startpos+5.4, 0.3233, .231, 0.9, col, vec3( 0.85, 0.50, 0.750 ) );
	
col = rect( pos, 11.3, 2.3, 3.5, 2.2, col, vec3( 0.2, 0.50, 0.750 ) );
	col = rect( pos, 2.25, 0.35, 1.73, .35, col, vec3( 0.25, 0.50, 0.750 ) );
	col = rect( pos, 2.98, 0.94, 2., .45, col, vec3( 0.71, 1.0, 1.750 ) );
	col = rect( pos, 22.8, 0.932, 2.33, .55, col, vec3( 0.35, 1.0, 0.750 ) );
	col = rect( pos, 33.4, 1.93, 1.731, 2.39, col, vec3( 0.25, 0.50, 0.750 ) );
	col = rect( pos, 43.4, 1.33, 2.831, .9, col, vec3( 0.25, 0.50, 0.750 ) );
	col = rect( pos, 56.4, 0.9233, 3.9231, 0.9, col, vec3( 0.25, 0.50, 0.750 ) );
	gl_FragColor += vec4(0.5*pos.y*col, 1.0 );
}
void main( void ) {

	pos =2.* ( gl_FragCoord.xy / resolution.xy );
float aa = 1.*atan (pos.y,pos.x); 
	col = vec3( 0.0, 0.40, 0.40 );
	pos.x+=4.+mod(time*1.,4.);
	
	
	
	sub_city2(1.);
	sub_city2(4.);
	sub_city2(-3.);
//	gl_FragColor += vec4(0.5*pos.y*col, 1.0 );
}