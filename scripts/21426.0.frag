#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//2D nearest root finding test using Newton's method.

//Stop after this many steps if a root isn't found
#define MAX_STEPS 32

//Max +- error 
#define MAX_ERROR 0.001

//sacrifices accuracy for a slight speed up 
#define SPEED_MULTIPLIER 1.0

//#define SHOW_ROOT_DISTANCE

float pi = atan(1.0)*4.0;
vec2 res = vec2(resolution.x/resolution.y,1.0);

float line(vec2 p, vec2 a, vec2 b, float w)
{
    if(a==b)return(0.);
    float d = distance(a, b);
    vec2  n = normalize(b - a);
    vec2  l = vec2(0.);
    l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
    l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
    return smoothstep(w, - .01, l.x + l.y);
}


float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

float f(vec2 p)
{	
	return length(p)-0.25-noise(32.0*p.xyy)*0.05;
}

vec2 df(vec2 p)
{
	float eps = 0.001;
	vec2 off = vec2(eps,0);
	return vec2(f(p+off.xy) - f(p-off.xy), f(p+off.yx) - f(p-off.yx))/(eps*2.0);
}

vec3 findroot(vec2 p)
{
	vec2 dir = normalize(df(p)); 
	float path = 0.;
	vec2 pos = p;
	vec2 last_pos = pos;
	float x = 0.0;
	
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	uv -= res/2.0;
	
	for(int i = 0;i < MAX_STEPS;i++)
	{	
		float fx = f(pos);
		
		float dfx = length(df(pos));
		path = max(path, line(uv, pos, last_pos, .0025));
		last_pos = pos;
		
		pos -= dir * (fx/dfx) * SPEED_MULTIPLIER;
		
		if(abs(fx) < MAX_ERROR)
		{
			break;
		}
		
		dir = normalize(df(pos));
		
	}
	
	return vec3(pos, path);
}

float point(vec2 pos,vec2 p)
{
	float pointSize = 1./resolution.x;
	return smoothstep(pointSize+0.01,pointSize+0.008,length(p-pos));
}


void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.y );
	p -= res/2.0;
	
	vec2 m = mouse*res - res/2.0;

	float distToRoot = distance(p,findroot(p).xy);
	
	vec3 mouseRoot = findroot(m);
	
	float lineSize = 1./resolution.x;
	
	vec3 col = vec3( smoothstep(lineSize+0.003,lineSize, distToRoot)*2.0 );
	
	#ifdef SHOW_ROOT_DISTANCE
	col = vec3(distToRoot);
	#endif
	
	col = mix(col, vec3(1,0,0), point(mouseRoot.xy, p)) + 8. * vec3(mouseRoot.z, line(p, m, mouseRoot.xy, .0025), 0.);
	
	gl_FragColor = vec4( col, 1.0 );
}