#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D last;

#define DECIMAL_SCALE 100000.0
#define VIEW_SCALE 100.0
#define STEPS_PER_FRAME 100
#define TIME_STEP 0.002

//Lorenz Attractor

//Mouse over bottom left corner to reset.

//Initial conditions
const vec3 init = vec3(1.0, 2.0, 3.0);

//System Parameters
const float o = 10.0;
const float r = 28.0;
const float b =  2.6;

vec4 encode(float x)
{
	return floor(mod(vec4(x) / exp2(vec4(0, 8, 16, 24)), 256.0)) / 255.0;	
}

float decode(vec4 x)
{
	return dot(x * 255.0 * exp2(vec4(0, 8, 16, 24)), vec4(1));
}

void WriteVec3(vec3 v, vec2 addr)
{
	vec2 uv = floor(gl_FragCoord.xy);
	
	v =floor(v * DECIMAL_SCALE);
	v += exp2(23.0);
	
	if(uv == addr + vec2(0,0))
	{
		gl_FragColor = encode(v.x);
	}
	
	if(uv == addr + vec2(1,0))
	{
		gl_FragColor = encode(v.y);
	}
	
	if(uv == addr + vec2(2,0))
	{
		gl_FragColor = encode(v.z);
	}
}

vec3 ReadVec3(vec2 addr)
{
	vec3 v = vec3(0);
	v.x = decode(texture2D(last,(addr + vec2(0,0))/resolution));
	v.y = decode(texture2D(last,(addr + vec2(1,0))/resolution));
	v.z = decode(texture2D(last,(addr + vec2(2,0))/resolution));
	return (v - exp2(23.0))/DECIMAL_SCALE;
}

float dfLine(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1 - p0);
	uv = (uv - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(uv, clamp(uv, vec2(0), vec2(distance(p0, p1), 0)));   
}

vec3 Integrate(vec3 p,float dt)
{
	vec3 np = vec3(0);
	
	np.x = p.x + (o * (p.y - p.x)) * dt;
	np.y = p.y + (p.x*(r - p.z) - p.y) * dt;
	np.z = p.z + (p.x*p.y - b * p.z) * dt;
	
	return np;
}

void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y ) - aspect/2.0;
	vec2 mo = (mouse * aspect) - (aspect/2.0);

	vec3 color = texture2D(last, gl_FragCoord.xy / resolution.xy).rgb;
	color -= 0.003;
	
	vec3 cur = ReadVec3(vec2(0));
	
	for(int i = 0;i < STEPS_PER_FRAME;i++)
	{	
		vec3 next = Integrate(cur, TIME_STEP);
		
		float line = dfLine(cur.xy / VIEW_SCALE, next.xy / VIEW_SCALE, uv);
		
		color += smoothstep(0.002,0.00, line) * vec3(0.01,0.2,0.01);
		
		cur = next;
		
	}	
	
	gl_FragColor = vec4( vec3( color ), 1.0 );
	
	if(length(mouse) < 0.1 || time < 0.5)
	{
		gl_FragColor = vec4(0);
		WriteVec3(init, vec2(0));
	}
	else
	{
		WriteVec3(cur, vec2(0));
	}
}