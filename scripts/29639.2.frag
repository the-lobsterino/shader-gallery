#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

//rp - ray position sp - sphere position radius - radius
const float eps = 0.5;
float sphere(in vec3 rp, in vec3 sp, in float radius)
{	
	float r = length(rp - sp);
	return 1.0/r/r;
}

float getDistance(vec3 p)
{
	float s1 = sphere(p, vec3(0.0, 0.0, 0.0), 2.0);
	float s2 = sphere(p, vec3(-6.0+time/20.0, 6.0-time/20.0, 0.0), 2.0);
	
	return (s1+s2);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec3 rp = vec3(0.0, 5.0, 10.0); // ray position
	vec3 rd = normalize( vec3( -1.0 + 2.0*uv* vec2(resolution.x/resolution.y, 1.0), -1.0 ) ); // ray direction
	const int maxIter = 100; //max iterations
	
	float t = 0.0;
	
	bool hit = false;
	float dt  = 0.1;
	for(int i = 0; i < maxIter; i++)
	{
		float cD = getDistance(rp + rd * t);
		if(cD > 0.2)
		{
			hit = true;
			break;
		}
		t += dt;
	}
	
	if(hit == true)
	{
		gl_FragColor = vec4(rd+1.0, 1.0);
	}
	else	
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}