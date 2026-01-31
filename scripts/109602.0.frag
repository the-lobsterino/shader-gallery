#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 getRgbColor( int i )
{
	vec3 result;
	vec3 cols[10];
	cols[0] = vec3( float(  0.0/255.0), float(  0.0/255.0), float(  0.0/255.0)); // black
	cols[1] = vec3( float(255.0/255.0), float(255.0/255.0), float(255.0/255.0)); // white
	cols[2] = vec3( float(255.0/255.0), float(204.0/255.0), float(204.0/255.0)); // beige
	cols[3] = vec3( float(128.0/255.0), float(  0.0/255.0), float(  0.0/255.0)); // brown
	cols[4] = vec3( float(255.0/255.0), float(  0.0/255.0), float(  0.0/255.0)); // red
	cols[5] = vec3( float(255.0/255.0), float(255.0/255.0), float(  0.0/255.0)); // yellow
	cols[6] = vec3( float(  0.0/255.0), float(255.0/255.0), float(  0.0/255.0)); // green
	cols[7] = vec3( float(  0.0/255.0), float(255.0/255.0), float(255.0/255.0)); // water
	cols[8] = vec3( float(  0.0/255.0), float(  0.0/255.0), float(255.0/255.0)); // blue
	cols[9] = vec3( float(128.0/255.0), float(  0.0/255.0), float(128.0/255.0)); // purple
	result = i == 0 ? cols[0] : result;
	result = i == 1 ? cols[1] : result;
	result = i == 2 ? cols[2] : result;
	result = i == 3 ? cols[3] : result;
	result = i == 4 ? cols[4] : result;
	result = i == 5 ? cols[5] : result;
	result = i == 6 ? cols[6] : result;
	result = i == 7 ? cols[7] : result;
	result = i == 8 ? cols[8] : result;
	result = i == 9 ? cols[9] : result;
	return result;
}

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

#define PI 3.14159

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	vec3 col = vec3( 0.0, 0.0, 0.0 );;

	for ( int i = 0; i < 30; i++ ) 
	{
		float x = 0.1 * sin( 2.0 * PI * float(i)/30.0 + time ) + 0.5;
		float y = 0.1 * cos( 2.0 * PI * float(i)/4.0 + time ) + 0.5;
		
		//col = rect( pos, float(i)/10.0, 0.5, 0.1, 0.1, col, getRgbColor(i) );
		col = rect( pos, x, y, 0.1, 0.1, col, getRgbColor(int(mod(float(i),10.0))) );
	}

	gl_FragColor = vec4( col, 1.0 );
}