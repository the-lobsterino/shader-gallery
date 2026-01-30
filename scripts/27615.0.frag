#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//branching this off, since it's fun

#define LEVELS 8.
#define SOURCE_CHANNEL 3

float 	flow_lines(vec2 uv, float level);
vec3 	format_block(vec2 uv, vec2 scale);
vec2	format(vec2 uv);
float	line(vec2 p, vec2 a, vec2 b, float w);
float	hash(float v);
float	noise(vec2 uv);
float	fbm(vec2 uv);
mat2	rmat(float t);
float 	map(vec2 uv);


void main(void) 
{
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	
	
	vec3 flow			= vec3(0.);	
	for(int i = int(LEVELS); i > 1; i--)
	{
		flow 	+= flow_lines(uv,  pow(2., float(i)))/float(i*2);
	}
	
	flow = pow(flow, vec3(.5));
	
	float source			= map(uv);
	
	gl_FragColor			= vec4(flow, source);
}//sphinx


float map(vec2 uv)
{
	float noise			= fbm(uv * 4. + time * .125);	
	float mouse_distance		= length(format(uv) - format(mouse));

	return noise - mouse_distance;
}


float flow_lines(vec2 uv, float level) 
{
	
	vec4 result			= vec4(0.);
	vec2 aspect			= vec2(resolution.x/resolution.y, 1.);
	
	vec2 scale 			= level * aspect;
	
	vec3 block              	= format_block(uv, scale);
	
	vec4 sample[4];
	vec2 offset			= vec2(.5/scale);
	vec2 pole			= vec2(-1., 1.);

	vec2 uv_corner[4];
	uv_corner[0]			= block.xy + offset * pole.xx;
	uv_corner[1]			= block.xy + offset * pole.yx;
	uv_corner[2]			= block.xy + offset * pole.xy;
	uv_corner[3]			= block.xy + offset * pole.yy;
	
	vec4 corner_sample		= vec4(0.);
	corner_sample.x			= texture2D(renderbuffer, uv_corner[0])[SOURCE_CHANNEL];	
	corner_sample.y			= texture2D(renderbuffer, uv_corner[1])[SOURCE_CHANNEL];	
	corner_sample.z			= texture2D(renderbuffer, uv_corner[2])[SOURCE_CHANNEL];	
	corner_sample.w			= texture2D(renderbuffer, uv_corner[3])[SOURCE_CHANNEL];	
	
	float left			= corner_sample.x + corner_sample.z;
	float right			= corner_sample.y + corner_sample.w;
	float top			= corner_sample.z + corner_sample.w;
	float bottom			= corner_sample.x + corner_sample.y;
		
	vec2 normal			= vec2(left-right, bottom-top);
	normal				= normalize(normal);
	
	vec2 uv_biased			= block.xy - normal * offset;
	float biased_sample		= texture2D(renderbuffer, uv_biased)[SOURCE_CHANNEL];;		
	
	float flow			= line(uv-block.xy, vec2(0.), uv_biased-block.xy, .001);
	
	return flow;
}


vec2 format(vec2 uv)
{
	uv 	= uv * 2. - 1.;	
	uv.x 	*= resolution.x/resolution.y;
	return uv;
}


vec3 format_block(vec2 uv, vec2 scale)
{
	vec3 block 	= vec3(0.);
	block.xy 	= floor(uv*scale);
	block.xy	+= .5/resolution;
 	
	block.z		= scale.x + (block.y * scale.x) - mod(block.x, scale.x);
	block.z		= floor(block.z);
	
	block.xy	+= .5;
	block.xy	/= scale;
	
	return block;
}


float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
   	 vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return clamp(smoothstep(w, 0., l.x+l.y), 0., 1.);
}

mat2 rmat(float t)
{
    float c = cos(t);
    float s = sin(t);   
    return mat2(c,s,-s,c);
}

float hash(float v)
{
    return fract(fract(v*9876.5432)*(v+v)*12345.678);
}


float noise(vec2 uv)
{
	const vec2 f	= vec2(.124586549,.495601173);
	vec4 l          = vec4(floor(uv),fract(uv));
	float u         = l.x + l.y * 340.;
	vec4 v          = vec4(u,u+1.,u+340.,u+341.);
	v               = fract(abs(fract(v*f.x)*(f.x*v+f.y*v)-f.x));
	l.zw            = l.zw*l.zw*(3.-2.*l.zw);
	return mix(mix(v.x, v.y, l.z), mix(v.z, v.w, l.z), l.w);
}

float fbm(vec2 uv)
{
	float n = 0.;
	mat2 r  = rmat(2.23606797);
	float f = 2.;
	for(int i = 0; i < 4; i++)
	{
		n	+= noise(uv * f + f)/f;
		uv	*= r;
		f	*= 2.;
	}
	return n;
}