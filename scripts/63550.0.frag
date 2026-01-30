/*
 * Original shader from: https://www.shadertoy.com/view/4dBcRd
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.14159265359

#define Scale vec3(.8, .8, .8)
#define K 19.19


vec3 hash(vec3 p3)
{
	p3 = fract(p3 * Scale);
    p3 += dot(p3, p3.yxz+19.19);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}

vec3 noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(p+vec3(0,0,0)), 
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)), 
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)), 
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)), 
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );
vec3 fbm(in vec3 q)
{
            vec3 f  = 0.5000*noise( q ); q = m*q*2.01;
            f += 0.2500*noise( q ); q = m*q*2.02;
            f += 0.1250*noise( q ); q = m*q*2.03;
            f += 0.0625*noise( q ); q = m*q*2.01; 
            f += 0.03125*noise( q ); q = m*q*2.01; 
    return vec3(f);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float udBox( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

vec3 repeatDomain(in vec3 p, in vec3 m)
{
    return p = mod(p, m) - 0.5*m;
}

float map(in vec3 p)
{
    vec3 q = repeatDomain(p, vec3(12.0, 0.5, 0.5));
    
    float s = sdSphere(q, 0.35);
    float b = udBox(q, vec3(0.3, 1000, 100));
    
    q = repeatDomain(p, vec3(0.01, 8.5, 8.5));
    float s2 = sdSphere(q, 0.8);
    
    
    return smin(max(-s, b), s2, 2.5);
}

float intersect(in vec3 ro, in vec3 rd)
{
    const int MAXITERATIONS = 80;
    float maxD = 30.0;
    float minD = 0.001;
    float t = 0.0;
    float h = 1.0;
    for(int i = 0 ; i < MAXITERATIONS; ++i)
    {
        if(h < minD || t > maxD)
            break;
        h = map(ro+rd*t);
        t += h;
    }
    if( t>maxD ) t=-1.0;
    return t;
}

vec3 calcNormal( in vec3 pos )
{
    vec3 eps = vec3(0.002,0.0,0.0);

	return normalize( vec3(
           map(pos+eps.xyy) - map(pos-eps.xyy),
           map(pos+eps.yxy) - map(pos-eps.yxy),
           map(pos+eps.yyx) - map(pos-eps.yyx) ) );
}

vec3 lighting(vec3 p, vec3 ro, vec3 rd)
{
    vec3 n = normalize(calcNormal(p));
    vec3 l = -normalize(ro + vec3(0.,0., -5.0) - p );
    float d = max(dot(-l, n), 0.0);
    
    float s = pow(max(dot(reflect(-l, n), rd), 0.0), 16.0);
    
    float a = 1.0 / length(ro - p);
    
    return vec3(s+d) * a * 4.0;
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.25*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x/iResolution.y;
    
    vec3 ro = vec3(sin(iTime*0.1)*50.0,cos(iTime*0.1)*50.0, -sin(iTime*0.8));
    vec3 rd = normalize(vec3(uv, -1.0));
    
    float d = intersect(ro, rd);
    vec3 p = ro+rd*d;
    
    vec3 fg = rd+ro;
    
    vec3 fgc = mix(vec3(2.0), vec3(0.5), smoothstep(0.0, 1.0, length(uv-vec2(0.0, 1.0))));
    
    vec3 color = vec3(fbm(vec3(vec2(fg.x+iTime*0.1, fg.y)*0.1, 1.0)*2.0).rrg) * fgc;
    
    vec3 s = vec3(fbm(p.bbb*2.0).r);

    
    if(d > 0.0)
    {
    	vec3 l = lighting(p, ro, rd);     
        vec3 n = calcNormal(p);
    
    	vec3 t = texture(iChannel0, normalize(normalize(reflect(normalize(n), normalize(rd))))).rgb;
        
        color = mix(vec3(t*l*s), color, smoothstep(0.3, 1.0, d/20.0));
    }
    
	fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}