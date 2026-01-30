#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

vec3 norm(vec3 old)
{
	float r = old.r;
	if(r > 1.0)
		r = 1.0;
	if(r < 0.0)
		r = 0.0;
	
	float g = old.g;
	if(g > 1.0)
		g = 1.0;
	if(g < 0.0)
		g = 0.0;
	
	float b = old.b;
	if(b > 1.0)
		b = 1.0;
	if(b < 0.0)
		b = 0.0;
	
	return vec3(r, g, b);
}

vec3 invert(vec3 old)
{
	return vec3(1.0 - old.r, 1.0 - old.g, 1.0 - old.b);	
}

void main()
{
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	vec2 center = vec2(resolution.x / 2.0, resolution.y / 2.0);
	vec2 pos = gl_FragCoord.xy;
	float radius = distance(center, pos);
	float theta = atan(pos.y, pos.x);
	
	float center_val = 900.0 / pow((radius + 1.0), 1.8);
	//r = center_val;
	//g = center_val;
	//b = center_val;
	
	
	if(pow(theta*50.0, 1.83) - radius < 1.0 && pow(theta*60.0, 2.0) - radius > 0.8)
	{
		r += 1.0;
		g += 1.0;
		b += 1.0;
		if(pow(theta*60.0, 2.0) - radius > 130.0) 
		{
			float val = 0.005*((pow(theta*60.0, 2.0) - radius) - 130.0);
			r = val;
			g = val;
			b = val;
		}
	}

	
	
	gl_FragColor = vec4(invert(vec3(r, g, b)), 1.0);
	
	/*vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );*/

}