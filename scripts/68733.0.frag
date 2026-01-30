#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 iResolution;
uniform float iTime;
uniform float rColor;
uniform float gColor;
uniform float bColor;
uniform float noise1;
uniform float noise2;
uniform float light;
uniform float num;
uniform vec2 iMouse;


float rand(float n){return fract(cos(n) * 43758.5453123);}
float rand(vec2 n){return fract(cos(dot(n, vec2(10., 4.1414))) * 43758.5453 );}
float noise(float p){
	float fl = floor(p+noise2);
	float fc = fract(p+noise2);
	return mix(rand(fl), rand(fl + 1.), fc);
}

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
vec4 K = vec4(rColor, gColor, bColor, 3.);
vec3 p = abs(fract(c.xxx + K.xyz) * 5. - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, .0, 1.0), c.y);
}

float manh_distance(vec2 a, vec2 b) {
    vec2 c = abs(a - b);
    return c.x + c.y;
}

float pyramids(vec2 p)
{
    vec2 n = floor(p);
    vec2 f = fract(p);
    float mind = 2.;
    for (int i=-1;i<2;i++)
    for (int j=-1;j<2;j++)
    {
        vec2 off = vec2(i,j);
        vec2 top = vec2( rand(n+off), rand(n+off+234.1) );
        float dist = manh_distance(f,top+off);
        if (dist < mind) {
            mind = dist;
        }
    }
    return (2.0 - mind) / 2.0;
}

#define SQ3 1.7320508076

mat2 rot2d(float a) { return mat2(cos(a),-sin(a),sin(a),cos(a)); }

vec2 p6mmmap(vec2 uv, float repeats) {
    // clamp to a repeating box width 6x height 2x*sqrt(3)
    uv.x /= SQ3 ;
    uv = fract(uv * repeats - 0.5) - 0.5;
    uv.x *= SQ3 ;

    uv = abs(uv);

    vec2 st = uv;

    vec2 uv330 = rot2d(radians(330.)) * uv;
    if (uv330.x < 0.0){
        st.y = (st.y - 0.5) * -1.0;
        st.x *= SQ3;
        return st * 2.0;
    }
    else if (uv330.x > 0.5){
        st.x = (st.x - 0.5 * SQ3) * -1.0 * SQ3;
        return st * 2.0;
    }

    vec2 uv30 = rot2d(radians(30.)) * uv ;
    if (uv30.y < 0.0 && uv30.x >= 0.5) st = vec2(1.0,1.0);
    else if (uv30.y >= 0.0 && uv30.x >= 0.5) st = vec2(-1.0,1.0);
    else if (uv30.y < 0.0 && uv30.x < 0.5) st = vec2(1.0,-1.0);
    else st = vec2(-1.0,-1.0);

    uv30.x = uv30.x - .5;
    uv = rot2d(radians(270.))* uv30;
    st = uv * st;
    st.x *= SQ3;
    return st * 2.0;
}

float uc(float a) { return clamp(a,0.,light); }
float ns(float a, float t) { return noise(a+t); }

vec3 square_noise(vec2 uv, float t) {
    // 3 octaves of manhattan distance worley noise
    float p1 = ns(pyramids(uv)*15.,t);
    float p2 = ns(pyramids(uv+noise1)*31.,t);
    float p3 = ns(pyramids(uv+noise1)*63.,t);

    float v = uc((p1*p2*p3-0.09)*10.);

    vec3 res = hsv2rgb(vec3(uc(uc(p3)-0.2),uc(uc(p2)-0.2),v));

	return res;
}

vec4 animate_noise(vec2 uv, float t) {
	return vec4(square_noise((rot2d(radians(t))*(uv-0.25)+0.25)+t*0.06,t*.2),1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // scale fragCoord to 0 centered, resolution independent square coords
    vec2 uv = fragCoord / iResolution.xy - 0.5;
    uv.x *= iResolution.x /iResolution.y;
    uv *= iResolution.x / num;

    uv = p6mmmap(uv,2.) * .65;

    float t = floor(iMouse.x/10.)*4.+4.*iResolution.x/10.*floor(iMouse.y/10.)-100000.;
    fragColor = animate_noise(uv,iTime);
}

void main (){
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
