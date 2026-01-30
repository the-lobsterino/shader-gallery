#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time time*1e-2
varying vec2 surfacePosition;


// OH MY GOD, IT'S FULL OF STARS!!! 

// thank you internet for this random function
vec2 rand22(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

// i just faked the vec3 version frin the one above by adding random numbers, no idea if it's "correct"
vec3 rand33(in vec3 p)
{
	return fract(vec3(sin(p.x * 591.32 + p.y * 154.077 + p.z * 712.223 ), cos(p.x * 391.32 + p.y * 49.077 + p.z * 401.326), sin (p.x * 591.32 + p.y * 237.311 + p.z* 49.077)));
}

float dst(vec3 r) {
	//return max(abs(r.x), abs(r.y));
	//return length(r);
	r.x = abs(r.x);
	r.y = abs(r.y);
	return (sqrt(r.x)+sqrt(r.y)+sqrt(r.z))*(2.+0.5*sin(time*1e2+sin(r.x-time*2e1+length(surfacePosition))/length(r)));
}

vec3 voronoi(in vec3 x)
	{
	vec3 n = floor(x); // grid cell id
	vec3 f = fract(x); // grid internal position
	vec3 mg; // shortest distance...
	vec3 mr; // ..and second shortest distance
	float md = 5.0, md2 = 1.0;
	for(int j = -1; j <= 1; j ++)
		{
		for(int i = -1; i <= 1; i ++)
			{
				for(int k = -1; k <= 1; k ++)
				{	
					vec3 g = vec3(float(i), float(j), float(k)); // cell id
					vec3 o = rand33(n + g); // offset to edge point
					vec3 r = g + o - f;
					
					float d = dst(r); // distance to the edge
					
					if(d < md)
						{
						md2 = md; md = d; mr = r; mg = g;
						}
					else if(d < md2)
						{
						md2 = d;
						}
				}
			}
		}
	return vec3((n + mg).xy, md);
	}
void main( void ) {

	vec2 position = surfacePosition;//( gl_FragCoord.xy / resolution.xx );
	
	gl_FragColor = 1.-vec4( .65 * vec3(voronoi(vec3(position*20.,time*.1)).z), 1.0 );

}