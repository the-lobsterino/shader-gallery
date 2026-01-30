#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// do an experimenta by 834144373

//i don'n know how "spere" work.i add the specular to find something

//Could you give me some theory and tutorials?
float spere(vec3 ray_start, vec3 ray_dir, vec3 center, float radius) 
{
	vec3 oc = ray_start - center;
	float B = dot(ray_dir, oc);
	//float C = dot(oc, oc) - radius * radius;
	float f = B * B + radius*radius - dot(oc,oc);
	if(f < 0.)
	{
		return 0.0;
	}
	else
	{
		float d = min(-B + sqrt(f), -B - sqrt(f));
		if(d < 0.0)
		{
			return 0.0;
		}
		else
		{
			return d;
		}
	}
}

// -------------------------------------------------------------------------------------------------------------------------
void main( void )
{
	
	vec2 position = (gl_FragCoord.xy / resolution.xy - .5) * 2.0;
	float a = resolution.x / resolution.y;
	position.x *= a;
	
	// view
	vec3 ray_start = vec3(0.0, .0, -3.0)+vec3(sin(time),0.,cos(time));
	vec3 ray_at = normalize(vec3(position, 1.0));
	
	// sphere
	vec3 center = vec3(0.0, 0.0, 0.0);
	float radius = 1.0;
	float d = spere(ray_start, ray_at, center, radius);
	vec3 n = normalize((ray_start + ray_at * d) - center);
	
	if(d > 0.0)
	{
	
		vec3 lDir = normalize(vec3(1.0, 1.0, -1.5));
		float diff = max(dot(n, lDir), .0);
		
		vec3 rDir = reflect(-lDir,n);
		vec3 vDir = normalize(vec3(position,0.)-ray_at);
		float specular = diff * pow(max(0.,dot(rDir,vDir)),5.);
		vec3 color = vec3(0.4,0.4,0.35)*diff+specular*vec3(0.4,0.7,0.6);
		color *=1.;
		gl_FragColor = vec4(color, 1.0);
	}
	else{}
		
	
	
	
	
}