#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


precision highp float;

const int size = 3;

vec4 getCircle(int nr)
{
	vec4 to_return;
	if(nr==0)
		to_return = vec4(resolution.xy/4.0,20.0*sin(time)+100.0,resolution.x*resolution.x*0.01);
	else if(nr==1)
		to_return = vec4(2.0*resolution.xy/4.0,40,resolution.x*resolution.x*0.02);
	else
	{
		to_return = vec4(3.0*resolution.xy/4.0,90,resolution.x*resolution.x*0.01);
		to_return.xyz += vec3(cos(time), sin(time), cos(time))*resolution.x*0.02;
	}
		
	return to_return;	
}
	

vec3 getCircleColor(int nr)
{
	if(nr==0)
		return vec3(0,0,1);
	else if(nr==1)
		return vec3(0,1,0);
	else
		return vec3(1,0,0);
}

vec3 light = vec3(1.0,1.0, 0.7);
float basicstep = resolution.x*0.02;
vec3 sidewallcolor = vec3(0.4,0.4,0.4);
float mixing = 0.5;


float closest(vec3 pos)
{
	float min = 1000000.0;
	if(abs(pos.x-resolution.x)<min)//right
		min = abs(pos.x-resolution.x)+1.0;
	if(abs(pos.x)<min)//left
		min = abs(pos.x)+1.0;	
	if(abs(pos.y)<min)//bottom
		min = abs(pos.y)+1.0;
	if(abs(pos.z-200.0)<min)//back
		min = abs(pos.z-200.0)+1.0;
	if(abs(pos.y-resolution.y)<min)//top
		min = abs(pos.y-resolution.y)+1.0;
	
	
	for(int o = 0;o<size;o++)
	{
		vec4 tmp = getCircle(o);
		vec3 dist = tmp.xyz-pos.xyz;
		float distsqr = dist.x*dist.x+dist.y*dist.y+dist.z*dist.z;
		if(distsqr<min)
			min = distsqr;

	}
	return sqrt(min);
}

vec3 image(vec2 position)
{
	float goback = 50.0;
	vec3 pos = vec3(position, -goback);
	vec3 center = vec3(resolution/2.0 + (mouse-vec2(0.5))*resolution.xy, -resolution.x-goback);
	vec3 move = pos-center;
	
	
	move /= length(move);
	
	vec3 color = vec3(1.0);
	float count = 0.0;
	
	
	for(float i = 0.0;i<50.0;i++)
	{
		if(pos.x>resolution.x)//right
		{
			vec3 normal = vec3(-1.0,0,0);
			move = reflect(move, normal)+normal*basicstep*1.001;
			color = mix(color, sidewallcolor, mixing);count++;
		}
		if(pos.x<0.0)//left
		{
			vec3 normal = vec3(1.0,0,0);
			move = reflect(move, normal)+normal*basicstep*1.001;
			color = mix(color, sidewallcolor, mixing);count++;
		}
			
		if(pos.y<0.0)//bottom
		{
			vec3 normal = vec3(0.0,1.0,0);
			move = reflect(move, normal)+normal*basicstep*1.001;
			color = mix(color, sidewallcolor, mixing);count++;
		}
		
		if(pos.z>200.0)//back
		{
			vec3 normal = vec3(0.0,0.0,-1.0);
			move = reflect(move, normal)+normal*basicstep*1.001;
			color = mix(color, sidewallcolor, mixing);count++;
		}
			
		if(pos.y>resolution.y)//top
		{
			vec3 normmove = normalize(move);
			float value = max(dot(light, normmove), 0.0);
			return color/count+color*(value*0.15);
		}
			
			
		
		for(int o = 0;o<size;o++)
		{
			vec4 tmp = getCircle(o);
			vec3 dist = tmp.xyz-pos.xyz;
			if(dist.x*dist.x+dist.y*dist.y+dist.z*dist.z<=tmp[3])
			{
				vec3 normal = normalize(pos-tmp.xyz);
				
				float value = 0.0;
				move = reflect(move, normal)+normal*basicstep*1.0001;
				color = mix(color, getCircleColor(o), mixing);count++;
			}
		}
		pos += move*closest(pos);
	}
	
	
	
	return vec3(0.0);
}



void main( void ) {

	vec2 position = gl_FragCoord.xy;


	gl_FragColor = vec4(image(position),1);

}