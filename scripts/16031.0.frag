#ifdef GL_ES
precision highp float;
#endif

//varying vec2 position;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) 
{
	float multiplier = 5.0;
	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 z = vec2(0.0);
	
	vec4 col = texture2D(backbuffer, position);
	
	
	col.y = (col.y) * multiplier;
	col.z = (col.z) * multiplier;
	
	/*if(col.r >= 1.0)
	{
		gl_FragColor = vec4(1.0,0.0,0.0,1.0);
		return;
	}*/
	
	
	
	if (((col.y*col.y)+(col.z*col.z)) > 4.0 || col.r >=0.98)
	{	
		col.y = col.y / multiplier;
		col.z = col.z / multiplier;
		gl_FragColor = col;
		return;
	}
	
	col.r += 1.0/255.;
	float tz0 = col.y;
	col.y = col.y * col.y - col.z * col.z + 4.0*(position.x-0.5);
	col.z = 2.0 * tz0 * col.z + 4.0*(position.y-0.5);
	
	
	
	
	
	//float nor = max(col.y,col.x);
	col.y = col.y / (multiplier*multiplier);
	col.z = col.z / (multiplier*multiplier);
	
	/*if (col.y > 1.0 || col.y < 0.0)
	{
		col.y = 0.0;
		col.r = 0.0;
	}
	if (col.z > 1.0 || col.z < 0.0)
	{
		col.z = 0.0;
		col.r = 0.0;
	}*/
	//col = vec4(0.0);
	gl_FragColor = col;
}