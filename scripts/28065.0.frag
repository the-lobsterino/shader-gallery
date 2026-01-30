#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

	
vec3 center = vec3(0.0,0.0,10.0);
const float r = 10.0;	

//distance function sphere
float dSphere(vec3 p,vec3 center,float r)
{
	float a = 1.5 + sin(time * 2.0) * 0.07;
	return pow(length(p - center)  , a ) / a - r;
}

//distance function
float dFunc(vec3 p)
{
	return dSphere(p,center,r);
}
void main( void ) 
{
	//vec2 uv = ( ( gl_FragCoord.xy  ) * 2.0 - resolution.xy) / min(resolution.x,resolution.y);
	
	//vec3 rayDir = vec3(uv.x,uv.y,1.0); // ray direction

    	vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    	vec3 camPos = vec3(-0.5,0.0,3.0);
    	vec3 camDir = normalize(vec3(vec2(mouse.x - 0.5,-mouse.y + 0.5), 1.0));
    	//camPos -=  vec3(0.0,0.0,time*3.0);
    	vec3 camUp  = normalize(vec3(0.5, 1.0, 0.0));
    	vec3 camSide = cross(camDir, camUp);
    	float focus = 1.8;

    	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);	 
	
	vec3 rayPos = vec3(0.0); // ray position
	
	float col = 0.0; //color
	
	for(int i=0;i<16;i++) //ray marching
	{
		float dist = dFunc(rayPos);
		//rayPos += rayDir * dist;

		rayPos += rayDir * dist;
			
		if(dist < 0.1)
		{
			vec3 norm = normalize(rayPos - center);
			col += dot(rayDir,norm) * ( 1.0 + dist * 1.0);
			//break;
		}
	}
	
	gl_FragColor = vec4( vec3(col), 1.0 );
}