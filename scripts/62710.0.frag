/*
 * Original shader from: https://www.shadertoy.com/view/3sSczR
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //

const float EPSILON = 0.001;
const float PI = 3.141592;
const float MAX_DIST = 256.0;
const int MAX_STEPS = 256;
const int it = 10;

vec3 makeRay(vec2 origin)
{
    float x = origin.x - iResolution.x * 0.5;
    x = x * (iResolution.x / iResolution.y) / iResolution.x;
    float y = origin.y - iResolution.y * 0.5;
    y = y / iResolution.y;
    
    return normalize(vec3(x, y, 1));
}

mat2 rot(float ang)
{
    float s = sin(ang);
    float c = cos(ang);
    return mat2(c, -s, s, c);
}

vec3 rotVec(vec3 p, vec3 r)
{
    p.yz *= rot(r.x);
    p.xz *= rot(r.y);
    p.xy *= rot(r.z);
    return p;
}

float mandelBulb(vec3 p, vec3 fp, float power, vec3 ang)
{
    p -= fp;
    p = rotVec(p, ang);
    
	vec3 z = p;
	float r, theta, phi;
	float dr = 1.0;
	
	for(int i = 0; i < it; ++i)
    {
		r = length(z);
        
		if(r > 2.0)
            continue;
        
		theta = atan(z.y / z.x);
        phi = asin(z.z / r) + 0.1*iTime;
		
		dr = pow(r, power - 1.0) * dr * power + 1.0;
		r = pow(r, power);
        
		theta = theta * power;
		phi = phi * power;
		
		z = r * vec3(cos(theta) * cos(phi),
                     sin(theta) * cos(phi), 
                     sin(phi)) + p;
	}
    
	return 0.1 * log(r*1.3) * r / dr;
}

float getDist(vec3 origin)
{
    vec3 fp = vec3(0);
    vec3 fr = vec3(0, PI + PI / 4.0, 0);
    float power = 8.0;
    
    return mandelBulb(origin, fp, power, fr);
}

vec2 rayMarch(vec3 origin, vec3 direct)
{
    float res = 0.0;
    
    for (int i = 0; i < MAX_STEPS; i++)
    {
        vec3 tmp = origin + direct * res;
        float d = getDist(tmp);
        res += d;
        
        if (res >= MAX_DIST || abs(d) < EPSILON)
        	return vec2(res, float(i));
    }

    return vec2(res, float(MAX_STEPS));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 origin = vec3(0, 0, -3);
    vec3 dir = makeRay(fragCoord);
    
    vec2 res = rayMarch(origin, dir);
    float d = res.x;
    vec3 col = vec3(0);
    
    if (d < MAX_DIST)
    {
    	vec3 p = origin + d * dir;
        float delta = length(p) / 2.0;
        
        vec3 startCol = vec3(cos(iTime*0.1) * 0.25 + 0.75, 0, 0);
        vec3 finCol = vec3(0, 0, sin(iTime*0.1) * 0.25 + 0.75);
        
        col = mix(startCol, finCol, delta);
        col *= res.y / float(MAX_STEPS) * 5.0;
    }
    
    fragColor = vec4(col, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}