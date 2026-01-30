/*
 * Original shader from: https://www.shadertoy.com/view/ts3yzB
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

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// SylvainLC 2020 
//
// I measure the difference between an hobbyist (me) and a CG professional like Shadertoy's top contributors.
// But the more important is to learn and have fun isn't it ?
// So thanks to IQ, Bigwings, Shane, Fabrice and you all guys ! 
// You are so good at teaching modeling, colors, lighing, all these technics ... 
// many thanks for your great tutorials and demos !
//

// I found no mention of this "roundabout" symetry in the IQ page below.
// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
// I spent so much time trying to visualize and code it that I put it here hoping this can be usefull. 
// You can recognize Bigwings raymaching template below. (RayMarching starting point) 
// Added some dirty glow to allow to visualize sectors.


vec3 test = vec3(0.);

#define TAU 6.283185
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001

#define S smoothstep
#define T iTime

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}


// This is the function , this one returns also an id

vec4 opRepRoundaboutWithID(vec3 p,float radius,float sectors) {
    float angle = TAU/sectors;
    // below we add half of angle and use after "floor" instead of "round"
    // This is because when there is an even number of sectors
    // there is a split of the sector at the opposite side because of the atan function
    // I also add TAU to have sector IDs from 0 to sectors-1
    float at=atan(p.z,p.x)+.5*angle; 
    at = at > 0. ? at : at+TAU;
    float sector = floor((at)/angle); // thanks to IQ video https://youtu.be/sl9x19EnKng?t=1745
    p.xz *= Rot(-angle*sector);
    p.x -= radius;
    return vec4(p,sector);
}

// simple function if you have all objets identical (no need to manage an ID)
vec3 opRepRoundabout(vec3 p,float radius,float sectors) {
    float angle = TAU/sectors;
    float sector = round(atan(p.z,p.x)/angle); // thanks to IQ video https://youtu.be/sl9x19EnKng?t=1745
    p.xz *= Rot(-angle*sector);
    p.x -= radius;
    return p;
}


float Hash21(vec2 p) {
    p = fract(p*vec2(123.34,233.53));
    p += dot(p, p+23.234);
    return fract(p.x*p.y);
}

float sdBox(vec3 p, vec3 s) {
    p = abs(p)-s;
	return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}



float sdRepBox(vec3 p) {
    float clones = 1.+9.*2.*abs(fract(.025*iTime)-.5);
    float clones2 = floor(clones);
    clones2 += smoothstep(.45,.55,fract(clones));
    vec4 r=opRepRoundaboutWithID(p,1.5,clones2);
    vec3 q=r.xyz;
    float id=r.w;
    // this only for coloring
    test.x+=.02*step(2.,mod(id+2.,3.));
    test.y+=.02*step(2.,mod(id+1.,3.));
    test.z+=.02*step(2.,mod(id,3.));
	// test+=vec3(id*.002);
    return sdBox(q, vec3(.3));
}

float GetDist(vec3 p) {
        
    float d = sdRepBox(p);
   	
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
    
    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	vec2 m = iMouse.xy/iResolution.xy;
    
    vec3 col = vec3(0);
    
    vec3 ro = vec3(0, 3, -3);
    ro.yz *= Rot(-m.y*3.14+1.);
    ro.xz *= Rot(-m.x*6.2831+iTime*.5);
    
    vec3 rd = GetRayDir(uv, ro, vec3(0), 1.);

    float d = RayMarch(ro, rd);
    
    if(d<MAX_DIST) {
    	vec3 p = ro + rd * d;
    	vec3 n = GetNormal(p);
        
    	float dif = dot(n, normalize(vec3(1,2,3)))*.5+.5;
    	col += dif;  
    }
    
    col = pow(col, vec3(.4545));	// gamma correction
    col += test;
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}