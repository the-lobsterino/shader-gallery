/*
 * Original shader from: https://www.shadertoy.com/view/ftc3z8
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
// various parts ripped from various IQ projects
// and articles, such as: https://www.iquilezles.org/www/articles/warp/warp.htm

float lerp(float a, float b, float t){return a+((b-a)*t);}
vec2 lerp(vec2 a, vec2 b, float t){return a+((b-a)*t);}
vec2 lerp(vec2 a, vec2 b, vec2 t){return a+((b-a)*t);}
vec3 lerp(vec3 a, vec3 b, float t){return a+((b-a)*t);}
vec3 lerp(vec3 a, vec3 b, vec3 t){return a+((b-a)*t);}

float fmod(float a, float b){return a - (b * floor(a/b));}

float hash( float p ) // replace this by something better
{
	vec2 p2 = vec2( dot(vec2(p),vec2(127.1,311.7)), dot(vec2(p),vec2(269.5,183.3)) );
    p2 = fract(sin(p2)*43758.5453123);
	return (p2.x+p2.y)/2.;
}
float hash2 (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

vec2 hash( vec2 p ) // replace this by something better
{
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = hash2(i);
    float b = hash2(i + vec2(1.0, 0.0));
    float c = hash2(i + vec2(0.0, 1.0));
    float d = hash2(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

const int numOctaves = 42;
float fbm(in vec2 pos, in float H){
    float total_noise = 0.;
    float f, a;
    for (int i=0; i<numOctaves; ++i) {
        f=pow(2., float(i));
        a=pow(f, -H);
        total_noise+=a*noise(f*pos);
    }
    
    return total_noise;
}
float fbm(in vec2 pos){return fbm(pos, 0.58);}

const vec2 center = vec2( 0.);
vec3 pattern( in vec2 p, in vec2 fragCoord, vec3 col1, vec3 col2, vec2 morph )
{
    vec2 q = vec2( fbm(morph+ p + vec2(0.0,0.0) * cos(iTime/7.) ),
                   fbm(morph+ p + vec2(0.27,0.37) + sin(iTime/8.)/8. ) );
                   
    vec2 r = vec2(cos(p.x*q.x*1.28), sin(p.y*q.y*3.14));
    
    vec2 p2 = vec2(p.x, p.y);
    vec2 d = center-p2;
    
    float pw = max(1.-pow(length(d*(q/3.))*2.,4.), 0.);
    
    r = r - pw*normalize(d)*(1.+sin(iTime/8.768)*2.);
    
    float blackness = pow(length(d*q)*(3.+sin(iTime/8.768)),2.5+cos(iTime/8.)*2.);
    blackness = min(max(blackness, 0.),1.5);
    pw = fbm( morph+p + 4.0*r) * blackness;
    
    return lerp(lerp(col2, col2+hash2(p), max(1.-blackness, 0.)), col1, pw);
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.y;
    uv = uv + vec2(0.135);
    
    // coloring
    vec3 col = vec3(uv.x/1.8, 8.2,uv.y);
    vec3 col2 = vec3(1.9);
    col.x *= (sin(iTime/3.)+1.)/4. + 0.5;
    col.z *= (cos(iTime/4.)+1.)/6. + (2./3.);
    col.y = (col.x*col.z + col.z*col.x)/1.8;
    col /= 1.3;
    col2 = pow(col, vec3(2.2));
    
    // shaping
    vec2 pos = fragCoord/iResolution.y;// + (fragCoord/8.*rand1(iTime));
    pos = pos-vec2(0.5*iResolution.x/iResolution.y, 0.5);
    
    col = pattern(pos, fragCoord, col, col2,vec2(sin(iTime/16.), cos(iTime/16.)) );
    col.y *= (sin(iTime/4.)/2.+1.1);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}