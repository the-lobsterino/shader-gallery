// https://www.shadertoy.com/view/4tVfDR
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// raymarch anything #3 (nipple mix) - Del 14/11/2018

#define	TAU 6.28318
float objID = 0.0;
float svobjID = 0.0;

float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

float hash(vec2 p)  // replace this by something better
{
    p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
    return fract( p.x*p.y*(p.x+p.y) );
}

float sdSphere( vec3 p, float s )
{
    return length(p)-s;
}

float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}

float map(vec3 p)
{
    float _time = time;
    float modz = mod(_time*6.75, 44.0);
    float t2 = fract(_time*1.1) * TAU;
    float t3 = fract(_time*0.7) * TAU;
    float t4 = fract(_time*0.14)* TAU;

    p.xy *= rotate(p.z * 0.08 + t4);
    
    float m = 0.5+sin(t2+p.z*0.4)*0.5;
    m += 0.5+cos(p.z*0.4+t3+p.x*0.4)*0.5;
    
	p.z += modz;
    pMod1(p.z,44.0);
    
	float dist = 4.5 -abs(p.y)+m;
    
    vec3 p2 = p;
	float cz = pMod1(p2.z,4.0);
	float cx = pMod1(p2.x,4.0);

    float r = hash(vec2(cz+(cz*0.31),cx+(cx*0.61)));
    
    if (r>0.875)
    {
		float d2 = sdSphere(p2+vec3(0.0,4.0+m,0.0),0.4);
		float d3 = sdSphere(p2-vec3(0.0,4.0+m,0.0),0.4);
        dist = smin(dist,d2,1.1);
        dist = smin(dist,d3,1.1);
    }

    objID = abs(p.z)/44.0;
    return dist;
}


vec3 normal( in vec3 p )
{
    vec2 e = vec2(0.0025, -0.0025); 
    return normalize(
        e.xyy * map(p + e.xyy) + 
        e.yyx * map(p + e.yyx) + 
        e.yxy * map(p + e.yxy) + 
        e.xxx * map(p + e.xxx));
}
vec3 render(vec2 uv)
{
	vec3 ro = vec3(0.0, 0.0, 0.0);
	vec3 rd = normalize(vec3(uv, 1.95));
	vec3 p = vec3(0.0);
	float t = 0.;
	for (int i = 0; i < 80; i++)
    {
		p = ro + rd * t;
		float d = map(p);
		if (d < .001 || t > 100.) break;
		t += .5 * d;
	}
    
    svobjID = objID;
	vec3 l = ro+vec3(0.0,0.0,15.0);
	vec3 n = normal(p);
	vec3 lp = normalize(l - p);
	float diff = 1.2 * max(dot(lp, n), 0.);
    
    vec3 c1 = vec3(2.84,2.0,1.45);
    vec3 c2 = vec3(2.54,1.6,1.85);
	return vec3(0.1)+mix(c1,c2,svobjID) * diff / (1. + t * t * .01);
}

void main( void )
{
	vec2 q = gl_FragCoord.xy / resolution.xy;
	vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
	vec3 col = render(uv);
	// vignette
    col *= 0.4 + 0.6*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	gl_FragColor = vec4(col, 1.);
}

