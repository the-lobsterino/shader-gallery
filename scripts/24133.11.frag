#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void )
{
	vec3 col = vec3(0.0);
	//vec2 pos = surfacePosition - vec2(0.8,0.0);
	
	float ar = resolution.y / resolution.x;
	//highp vec2 z0 = (gl_FragCoord.xy / resolution.xy - vec2(0.5, 0.5)) * vec2(3.0 / ar, 3.0);
	
	vec2 center = vec2(0.5,0.5);
	
	//float scale = 2.1 + sin(time*0.5)*2.0;
	//float scale = 2.002 + sin(time*0.5)*2.0;
	float scale = 2.0/pow(time,2.0);
	highp vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5 + (mouse-0.5) / (scale*0.8);
	//highp vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5 + (mouse-0.5);
	

	highp vec2 z,c;
	
	c.x = 1.3333 * (position.x) * scale - center.x;
	c.y = (position.y) * scale - center.y;
	
	z = c;
	
	
	
	//highp vec2 z0 = pos;
	//highp vec2 z0 = vec2(0.251,0.575);
	//highp vec2 z = vec2(0.0);
	//highp vec2 z = vec2(0.5*time);
	
	float iter = 200.0;
	for (int i = 0; i < 200; i++)
	{
		
		if (dot(z, z) > 2.0*2.0)
		{
			iter = float(i);
			break;
		}
		
		//highp float xt = z.x*z.x - z.y*z.y + z0.x;
		highp float xt = z.x*z.x - z.y*z.y + c.x;
		//z.y = 2.0*z.x*z.y + z0.y;
		z.y = 2.0*z.x*z.y + c.y;
		z.x = xt;
	}
	
	col = vec3(iter) / (200.0);
	
	
	gl_FragColor = vec4(col, 1.0);
}