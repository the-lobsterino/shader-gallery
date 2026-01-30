/*
 * Original shader from: https://www.shadertoy.com/view/WlKXRR
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// thanks to mla and Kali!
// They have super nice examples on inversion

// it's really simple, basically
// p /= dot(p,p);
// SDFs
// return distance*dot(p,p);


// and ofc Inigo quilez for pallete!


vec3 getRd(vec3 ro, vec3 lookAt, vec2 uv){
	vec3 dir = normalize(lookAt - ro);
    vec3 right = normalize(cross(vec3(0,1,0), dir));
    vec3 up = normalize(cross(dir, right));
    return normalize(dir + right*uv.x + up * uv.y);
}
#define pmod(p,x) mod(p,x) - 0.5*x
#define mx (iTime*0. + 20.*iMouse.x/iResolution.x)

#define pi acos(-1.)
#define tau (2.*pi)
#define T (iTime*0.125)
#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))
#define pal(a,b,c,d,e) (a + b*cos(tau*(c*d + e)))

vec3 pA = vec3(0);

vec2 map(vec3 p){
	vec2 d = vec2(10e6);
	
    float sc = 2.4;
    float dp = dot(p,p);
    p /= dp;
    p*= sc;
    
    float m = sin(2.*8.*T/tau)*tau;
    p=sin(p+vec3(T*tau,1.4 - 1.*T*tau,0. + m*0.));
    pA = p;
    float modD = 3.14/2.;
    
    d.x = min(d.x, length(p) - 3.6); // something arbitrarily big
    d.x = max(d.x,-length(p) + 1.4);
    
	return d*dp/sc;
}

vec3 glow = vec3(0);
vec2 trace(vec3 ro, vec3 rd,inout vec3 p,inout float t, inout bool hit){
	vec2 d = vec2(10e6);
	t = 0.; hit = false; p = ro;
    
    for(int i = 0; i < 100; i++){
    	d = map(p);
        glow += exp(-d.x*90.);
        if(d.x < 0.0001){
        	hit = true;
            break;
        }
        t += d.x;
        p = ro + rd*t;
    }
    
    
    return d;
}

vec3 getNormal(vec3 p){
    vec2 t = vec2(0.001,0);
	return normalize(map(p).x - vec3(
    	map(p - t.xyy).x,
    	map(p - t.yxy).x,
    	map(p - t.yyx).x
    ));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
    vec3 col = vec3(0);
    
    uv *= 1. + dot(uv,uv)*1.9;
    vec3 ro = vec3(0.,0.,1.)*0.9;

    ro.x += sin(mx)*0.;
    vec3 lookAt = vec3(0.);
    vec3 rd = getRd(ro, lookAt, uv);
    rd.xy *= rot(sin(iTime*0.5)*0.6);
    rd.xz *= rot(sin(iTime*0.75)*0.2);
    vec3 p = vec3(0.); float t = 0.; bool hit = false;
    vec2 d = trace(ro, rd, p, t, hit);
    
    if(hit){
        vec3 pAA = pA;
        float modD = 0.1;
        float id = floor(pA.x/modD);
        pA = pmod(pA, modD);
        col += pal(0.,vec3(1,0.7 + sin(id + iTime*0.25)*0.24,1.1)*1., vec3(5.,3.75 + cos(iTime + length(p))*0.04,1.1 ), 1.5, id*0.3 + pAA.z*0.5 + pAA.y*0.2 + iTime*0.12);
        col *= step(abs(sin(id*4.))*1., 0.7);
        col -= exp((abs(pA.x) - modD*0.5)*100.);

        col -= exp(-length(p)*20.)*10.;
        //col += smoothstep(0.01,0., length(pA.x) - modD*0.175);
    }
    
    col -= glow*0.016;
    col = clamp(col, 0., 1.);

    col *= 1.9;
    col = pow(col, vec3(0.45));
    col *= 1. - 1.*pow(abs(uv.x)*0.55,2.9)*0.5;
    col *= 1. - 1.*pow(abs(uv.y)*1.0,2.9)*0.5;
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}