// Created by Stephane Cuillerdier - Aiekick/2015
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Tuned via XShade (http://www.funparadigm.com/xshade/)

/* 
	the cloudy famous tech come from the shader of duke : https://www.shadertoy.com/view/MljXDw
        Himself a Port of a demo by Las => http://www.pouet.net/topic.php?which=7920&page=29&x=14&y=9
*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec4 freqs;
float t;
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
#define uTex2D iChannel0
float pn( in vec3 p )
{
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
// must add computed noise !!!gtr // ok !!
vec2 path(float t, float k, float c)
{
	return vec2(cos(t/k), sin(t/k))*c;
}

float df(vec3 p)
{
	float pnNoise = pn(p*0.7)*1.7 + pn(p*0.8)*2.2 + pn(p*3.1)*0.6;
	p.z += pnNoise;
	p.xy += path(p.z, 5., 10.);
	float serpentA = length(p.xy) - 2.;
	p.xy += path(p.z, 1., 10.);
	float serpentB = length(p.xy/(freqs.xy+.1)) - 2.;
	return min(serpentA, serpentB);
}

vec3 cam(vec2 uv, vec3 ro, vec3 cu, vec3 cv, float fov)
{
	vec3 rov = normalize(cv-ro);
    vec3 u = normalize(cross(cu, rov));
    vec3 v = normalize(cross(rov, u));
    vec3 rd = normalize(rov + fov * u * uv.x + fov * v * uv.y);
    return rd;
}

vec3 nor( vec3 p, float prec )
{
    vec2 e = vec2( prec, 0. );
    vec3 n = vec3(
		df(p+e.xyy) - df(p-e.xyy),
		df(p+e.yxy) - df(p-e.yxy),
		df(p+e.yyx) - df(p-e.yyx)
		);
    return normalize(n);
}

vec3 march(vec3 f, vec3 ro, vec3 rd, float st)
{
	vec3 s = vec3(1), h = vec3(.16,.008,.032), w = vec3(0);
	float d=1.,dl=0., td=0.;
	vec3 p = ro;
	for(float i=0.;i<100.;i++)
	{      
		if(s.x<0.01||d>400.||td>.95) break;
        s = df(p) * .1 * i/vec3(107,160,72);
		w = (1.-td) * (h-s) * i/vec3(61,27,54)* freqs.yzw * 4. * step(s,h);
		f += w;
		td += w.x + .01;
		dl += 0.05;	
		s = max(s, st);
		d +=s.x; 
		p =  ro+rd*d;	
   	}
	dl += 0.5;
	f /= dl/15.;
	f = mix( f, vec3(0), 1. - exp( -.0002*d*d) ); // iq fog
	return f;
}

#define uTime time
#define uScreenSize resolution.xy
void main()
{
	
    // from CubeScape : https://www.shadertoy.com/view/Msl3Rr
       
    
	t = uTime*2.5;
	gl_FragColor = vec4(0,0.15,0.32,1);
       vec2 si = uScreenSize;
	vec2 q = uScreenSize.xy/si;
	float z = t * 5.;
    vec3 ro = vec3(path(z,5.,5.+(sin(t*.5)*.5+.5)*5.), z );
	 vec2 uv = (2.*gl_FragCoord.xy-uScreenSize)/uScreenSize.y;
	vec3 rd = cam(uv, ro, vec3(path(z,10.,10.),0), ro+vec3(0,0,1), 3.5);
	gl_FragColor.rgb = march(gl_FragColor.rgb, ro, rd, 0.2);
	uv*= uScreenSize * 10.;
	float k = fract( cos(uv.y * 0.01 + uv.x) * 500000.);
	gl_FragColor.rgb = mix(fract(gl_FragColor.rgb/sin(mod(time/2.0,4.0))), vec3(1), pow(k, 50.));
	gl_FragColor.rgb *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.25 ); // vignette
}
 