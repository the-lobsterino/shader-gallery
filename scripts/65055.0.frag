/*
 * Original shader from: https://www.shadertoy.com/view/td2cDW
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

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_STEPS 1280
#define MAX_DIST 1280.
#define E 0.01
#define PI 3.141592
#define MYTIME iTime * 1.

// Turn to 1 to activate displacement mapping
#define DISPLACEMENT_MAPPING 1

vec3 rotX(vec3 v, float a)
{
    return vec3(v.x, v.y * cos(a) - v.z * sin(a), v.y * sin(a) + v.z * cos(a));
}

vec3 rotY(vec3 v, float a)
{
    return vec3(v.x * cos(a) + v.z * sin(a), v.y, v.z * cos(a) - v.x * sin(a));
}

vec3 rotZ(vec3 v, float a)
{
    return vec3(v.x * cos(a) - v.y * sin(a), v.x * sin(a) + v.y * cos(a), v.z);
}

vec3 modSDF(vec3 p, vec3 c)
{
    return mod(p + 0.5 * c, c) - 0.5 * c;
}

vec3 modSDFlim( in vec3 p, in float c, in vec3 l)
{
    return p-c*clamp(round(p/c),-l,l);
}

vec3 twistSDF(in vec3 p, float k )
{
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return q;
}

float sdfBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

// blackbody by aiekick : https://www.shadertoy.com/view/lttXDn

// -------------blackbody----------------- //

// return color from temperature 
//http://www.physics.sfasu.edu/astro/color/blackbody.html
//http://www.vendian.org/mncharity/dir3/blackbody/
//http://www.vendian.org/mncharity/dir3/blackbody/UnstableURLs/bbr_color.html

vec3 blackbody(float Temp)
{
	vec3 col = vec3(255.);
    col.x = 56100000. * pow(Temp,(-3. / 2.)) + 148.;
   	col.y = 100.04 * log(Temp) - 623.6;
   	if (Temp > 6500.) col.y = 35200000. * pow(Temp,(-3. / 2.)) + 184.;
   	col.z = 194.18 * log(Temp) - 1448.6;
   	col = clamp(col, 0., 255.)/255.;
    if (Temp < 1000.) col *= Temp/1000.;
   	return col;
}

// -------------blackbody----------------- //


float scene(vec3 p)
{
    float d = 10000.;
    float bd1 = sdfBox(
        twistSDF(
            modSDFlim(
                twistSDF(p - vec3(0., 12., 0.), smoothstep(0.30, 0.20, abs(sin(MYTIME))) * 0.02),
                12., vec3(1. + smoothstep(0.45, 0.55, abs(sin(MYTIME))) * floor(abs(mod(MYTIME / (PI), 16.) - 8.)), 1. + smoothstep(0.45, 0.55, abs(sin(MYTIME))) * floor(abs(mod(MYTIME / (PI), 16.) - 8.)), 1. + smoothstep(0.45, 0.55, abs(sin(MYTIME))))), smoothstep(0.70, 0.80, abs(sin(MYTIME))) * -0.1),
                       vec3(4. + smoothstep(0.25, 0.75, abs(sin(MYTIME * 2.))),4. + smoothstep(0.25, 0.75, abs(sin(MYTIME * 2.))),4. + smoothstep(0.25, 0.75, abs(sin(MYTIME * 2.)))));
    if (DISPLACEMENT_MAPPING == 1)
    	bd1 += sin(p.x / 2. * abs(mod(iTime, 6.) - 3.)) * 1. * sin(p.y / 2. * abs(mod(iTime, 6.) - 3.)) * 1. * sin(p.z / 2. * abs(mod(iTime, 6.) - 3.)) * 1.;
    float bd2 = sdfBox(modSDF(p - vec3(0., -24., 0.), vec3(10., 0., 10.)), vec3(4.5,4.5,4.5)) * 1.;
    d = min(bd1, d);
    d = min(bd2, d);
    return d;
}


vec2 march(vec3 ro, vec3 rd)
{
    float dO = 0.;
    float mind = 10000.;
    for (int steps = 0; steps < MAX_STEPS; steps++)
    {
        vec3 p = ro + rd * dO;
        float dS = scene(p);
        if (steps == 3)
            mind = dS;
        dO += dS;
        if (dS < E || dO > MAX_DIST)
            break;
    }
    return vec2(dO, mind);
}

vec3 normal(vec3 p)
{
    float d = scene(p);
    vec2 e = vec2(0.001, 0);
    
    vec3 n = d - vec3(
        		scene(p - e.xyy),
                scene(p - e.yxy),
                scene(p - e.yyx));
    return (normalize(n));
}

float light(vec3 p, vec3 n)
{
    vec3 lightPos = vec3(-250. * sin(MYTIME), 75., -250. * cos(MYTIME));
    vec3 l = normalize(lightPos - p);
    
    float dif = clamp(dot(l, n), 0., 1.);
    vec2 d = march(p+n*E * 30., l);
    if (d.x < length(lightPos - p))
        	dif *= 0.1;
    
    return (dif*0.3);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = ((fragCoord - .5 * iResolution.xy) / iResolution.y);
    
    vec3 ro = vec3(-235. * sin(iTime / 2.), 15. + sin(iTime / 2.) * 15., -235. * cos(iTime / 2.));
    vec3 rd = normalize(vec3(uv.x, uv.y, 1.));
    //rd = rotX(rd, PI / 8.);
    rd = rotY(rd, iTime / 2.);
    
    vec2 d = march(ro, rd);
    
    vec3 p = ro + rd * d.x;
    vec3 n = normal(p);
    p += n * E * 10.;
    float dif = light(p, n);
	vec3 col = vec3(0);
    if (d.x < MAX_DIST * 0.9)
    {
    	col = blackbody(d.y* (p.y + 19.2) * 2. * (50. - abs(mod(p.y + MYTIME * 50., 100.) - 50.)));
        col.xyz = col.zyx;
        col.xy *= 0.5;
        col.x *= uv.x;
        col.y *= uv.y;
        if (col.z > 0.001)
        {
        	col = 0.5 * (1. - col);
            col = vec3(col.z, col.z, (col.x + col.y) / 2.);
      	    col.x = col.x / 2. + col.z * uv.x;
      	    col.y = col.y / 2. + col.z * uv.y;
        }
        col /= 2.;
    }
    col +=  vec3(dif / 2.,dif / 2., dif / 2.);
    vec3 rr = rd - (2. * n * (dot(rd, n)));
    vec2 d2 = march(p, rr);
    vec3 p2 = p + rr * d2.x;
    vec3 n2 = normal(p2);
    dif = light(p2, n2);
    if (d.x < MAX_DIST * 0.9)
    {
    	vec3 col2 = blackbody(d2.y* (p.y + 19.2) * 2. * (50. - abs(mod(p.x * p.z / 30. + 25. + MYTIME * 50., 100.) - 50.)));
        col2 /= 1.2;
        col += col2;
    }
    col += vec3(dif / 2., dif / 2., dif / 2.);
    //col = pow(col, vec3(0.454545));
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}