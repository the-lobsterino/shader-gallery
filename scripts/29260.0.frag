#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//expensive, just thinking
#define brown1 vec3( .5, .3, .1)
#define brown2 vec3( .4, .2, .0)
#define brown3 vec3( .5, .2, .0)
#define brown4 vec3( .3, .0, .0)

vec2 seg( vec2 a, vec2 b, vec2 p )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return vec2( length( pa - ba*h ), h );
}
    
vec2 hash2( vec2 p )
{
	vec2 o = fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
	return o;
}

vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2 i = floor( p + (p.x+p.y)*K1 );
	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;

    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

    return dot( n, vec3(70.0) );
	
}

float simplex( vec2 uv )
{	
	float f = 0.;
	uv *= 5.0;
        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
		f  = 0.5000*noise( uv ); uv = m*uv;
		f += 0.2500*noise( uv ); uv = m*uv;
		f += 0.1250*noise( uv ); uv = m*uv;
		f += 0.0625*noise( uv ); uv = m*uv;
	return 0.5 + 0.5*f;
}

vec3 colorMap( vec2 p )
{
	vec3 dirt1 = mix(brown1,brown2, simplex(p*.72) );
	vec3 dirt2 = mix(brown3,brown4, simplex(p*.27) );
	vec3 dirt3 =  mix(dirt2, dirt1, simplex(p*.1));
	float rough = (1.0 + noise(p * 100.) * .05);
    return dirt3 * rough;
}

float tex( vec2 p )
{
	float d1 = simplex( p * .25 );
	float d2 = noise(p * 75.);
	float d_mask = smoothstep(.25,.6,d1);
	d1 = smoothstep(.25,1.,d1);
	//return length(p);
	return mix(d2*.03,d1, d_mask)*.02;
}

vec3 grad( vec2 p ) 
{
	vec2 eps = vec2( .001, 0. );
	vec3 n = vec3( 
		tex( p + eps.xy ) - tex( p - eps.xy ),
		tex( p + eps.yx ) - tex( p - eps.yx ),
		eps.x );
	return normalize(n);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	vec2 m = mouse * 2. - 1.;
	m.x *= resolution.x/resolution.y;
	
	vec3 n = grad( p );
	vec3 light = normalize(vec3( -m,1.));
	float shade = dot(light, n);
    vec3 c = colorMap( p );
    
    float mouse_line = smoothstep(.003,.0, seg( vec2(0.), m, p ).x );
	
	gl_FragColor = vec4( c * shade + mouse_line, 1. );
}