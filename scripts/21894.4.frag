#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Dot shading thing

float dotsVertical = floor(resolution.y/8.0)+14.0; //number of vertical dots (may need adjustments to look good on some resolutions).
float dotSmooth = 0.2; //the smoothing amount on t a dot's edge.

vec3 dotColor = vec3(0.1367,0.3125,0.5078);
vec3 backColor = vec3(0.9,0.9,0.9);

vec3 Dots(vec2 uv, float size)
{
	vec2 dtp = mod(uv*dotsVertical, vec2(1.0));
	
	size *= 0.8;
	
	float dots = smoothstep(size+dotSmooth,size,length(dtp-0.5));
	
	return mix(backColor,dotColor,dots);
}

vec3 RotateAxis(vec3 vec,vec3 axis,float ang)
{
	axis = normalize(axis);
	return vec * cos(ang) + cross(axis,vec)*sin(ang) + axis*dot(axis,vec)*(1.0-cos(ang));
}

float Cube(vec3 pos,float size)
{
	return max(max(abs(pos.x),abs(pos.y)),abs(pos.z)) - size;
}

float Sphere(vec3 pos,float size)
{
	return length(pos) - size;
}

float Scene(vec3 pos)
{
	float scene = 100.0;
	
	vec3 cubeDomain = pos;
	cubeDomain = RotateAxis(cubeDomain,vec3(-1,1,1),time*0.5);
	cubeDomain = RotateAxis(cubeDomain,vec3(-1,-1,1),time*0.7);
	
	scene = Cube(cubeDomain,0.2);
	scene = max(scene,-Sphere(cubeDomain,0.25));
	scene = min(scene, -Sphere(pos,4.0));
	
	return scene;
}

vec3 Normal(vec3 pos)
{
	vec3 off = vec3(0.005,0,0);
	return normalize(vec3(Scene(pos+off.xyz)-Scene(pos-off.xyz),Scene(pos+off.zxy)-Scene(pos-off.zxy),Scene(pos+off.zyx)-Scene(pos-off.zyx)));
}

vec4 RayMarch(vec2 uv,vec2 res)
{
	vec3 rOrig = vec3(0,0,-1);
	vec3 rDir = normalize(vec3(uv,1.0));
	
	float dist = 0.0;
	
	for(int i = 0;i < 64;i++)
	{
		float objDist = Scene(rOrig + rDir * dist);
		dist += objDist;
		if(objDist < 0.001)
		{
			break;	
		}
		
	}
	
	vec3 pos = rOrig + rDir*dist;
	
	return vec4(Normal(pos),dist);
}

void main( void ) {

	vec2 res = vec2(resolution.x/resolution.y,1.0);
	
	vec2 uv = ( gl_FragCoord.xy / resolution.y ) - (res/2.0);

	vec3 color = vec3(0.0);
	
	vec4 result = RayMarch(uv,res);
	
	vec3 sunDir = normalize(vec3(1,1,0));
	
	float shade = max(0.0,dot(result.xyz,sunDir));
	
	shade = mix(shade,1.0,smoothstep(2.0,3.0,result.w)); //make the background a solid color.
	
	color = Dots(uv,shade); //apply the dot shading to the object based on the shading.
	
	
	gl_FragColor = vec4( color, 1.0 );

}