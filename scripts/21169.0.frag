#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//2D nearest root finding test using Newton's method.

//Stop after this many steps if a root isn't found
#define MAX_STEPS 128

//Max +- error 
#define MAX_ERROR 0.001

//sacrifices accuracy for a slight speed up 
#define SPEED_MULTIPLIER 1.0

//#define SHOW_ROOT_DISTANCE

float pi = atan(1.0)*4.0;
vec2 res = vec2(resolution.x/resolution.y,1.0);
	
float f(vec2 p)
{	
	float sine = p.y - abs(fract(p.x * 3. - fract(p.x * 17. / fract(p.x)))-.5) * .05;
	
	return sine;	
}

vec2 df(vec2 p)
{
	float eps = 0.001;
	vec2 off = vec2(eps,0);
	return vec2(f(p+off.xy)*8.0 - f(p-off.xy)*8.0, f(p+off.yx)*8.0 - f(p-off.yx)*8.0)/(eps*2.0);
}

vec2 findroot(vec2 p)
{
	vec2 dir = normalize(df(p)); 
	
	vec2 pos = p;
	
	float x = 0.0;
	
	for(int i = 0;i < MAX_STEPS;i++)
	{	
		float fx = f(pos);
		
		float dfx = length(df(pos));
		
		pos -= dir * (fx/dfx) * SPEED_MULTIPLIER;
		
		if(abs(fx) < MAX_ERROR)
		{
			break;
		}
		
		dir = normalize(df(pos));
	}
	
	return pos;
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

	float distToRoot = distance(p,findroot(p));
	
	vec2 mouseRoot = findroot(m);
	
	float lineSize = 1./resolution.x;
	
	vec3 col = vec3( smoothstep(lineSize+0.003,lineSize, distToRoot)*2.0 );
	
	#ifdef SHOW_ROOT_DISTANCE
	col = vec3(distToRoot);
	#endif
	
	col = mix(col, vec3(1,0,0), point(mouseRoot,p));
	
	gl_FragColor = vec4( col, 1.0 );
}