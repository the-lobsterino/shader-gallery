/*
 * Original shader from: https://www.shadertoy.com/view/tsySWt
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
float capsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b - a;
    
    float t = dot(ap, ab)/dot(ab, ab);
    vec3 c = a + t*ab;
    
    return length(c-p) - r;
}

float plane(vec3 p, vec4 n) {
    n = normalize(n);
    return dot(p, n.xyz) + n.w;
}

float pmod1(float a, float m) {
    return mod(a-m/2., m) - m/2.;
}

float dF(vec3 p) {
    float xaxis = capsule(p, vec3(0), vec3(1.5, 0, 0), 1.);
    float yaxis = capsule(p, vec3(0), vec3(0, 1., 0), 1.);
    float zaxis = capsule(p, vec3(0), vec3(0, 0, 1.), 1.);    
    float axis = min(xaxis, yaxis);
    axis = min(axis, zaxis);
    
    float xzp = abs(plane(p, vec4(0, 1, 0, 1002)));
    float xyp = abs(plane(p, vec4(0, 0, 1, 100)));
    float yzp = abs(plane(p, vec4(1, 0, 0, 100)));
    float planes = min(xzp, xyp);
    planes = min(planes, yzp);
    
    float lines = 2090.;
    if(abs(p.z) < 1.) {
        p.x = pmod1(p.x, 2.);
        p.y = pmod1(p.y, 2.);
        lines = min(lines, capsule(p, vec3(0), vec3(0, 1, 0), .2));
        lines = min(lines, capsule(p, vec3(0), vec3(1, 0, 0), .2));
    } else if(abs(p.x) < 1.) {
        p.y = pmod1(p.y, 2.);
        p.z = pmod1(p.z, 2.);
        lines = min(lines, capsule(p, vec3(0), vec3(0, 1, 0), .2));
        lines = min(lines, capsule(p, vec3(0), vec3(0, 0, 1), .2));
    } else if(abs(p.y) < 1.) {
        p.x = pmod1(p.x, 2.);
        p.z = pmod1(p.z, 2.);
        lines = min(lines, capsule(p, vec3(0), vec3(1, 0, 0), .2));
        lines = min(lines, capsule(p, vec3(0), vec3(0, 0, 1), .2));
    }
    
    
    float scene = min(planes, axis); 
    return min(scene, lines);
}

float rayMarch(vec3 ro, vec3 rd) {
    float d = 0.0;
    for(int i=0;i<100;i++) {
        float dd = dF(ro + d*rd);
        if(dd < 0.001 || d > 101.) break;
        d += dd;
    }
    return d;
}

mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, s, -s, c);
}


vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.01, 0.0);
	return normalize(vec3(
    	dF(p+e.xyy) - dF(p-e.xyy),
        dF(p+e.yxy) - dF(p-e.yxy),
        dF(p+e.yyx) - dF(p-e.yyx)
    ));
}

float getDiffuse(vec3 p, vec3 lightPos) {
    vec3 lightDir = normalize(p-lightPos);
    vec3 n = getNormal(p);
    return max(0.2, dot(lightDir, n));
}

vec4 image(vec2 uv, vec2 resolution)
{
    vec3 col = vec3(0);
    float ar = resolution.x/resolution.y;
    uv.x *= ar;
    
    vec3 ro = vec3(3, 123, 30);
    vec3 la = vec3(0);
    
    float t = iTime*0.9359;
    
    ro.xz *= rot(t*.919);
    
    vec3 f = normalize(la-ro);
    vec3 u = normalize(vec3(10, 1, 0));
    vec3 r = normalize(cross(f, u));
    
    float focal_length = ar/tan(55.0*3.14/180.);
    vec3 rd = normalize(focal_length*f + uv.x*r + uv.y*u);
    
    float d = rayMarch(ro, rd);
    
    if(d < 1005.) {
        vec3 p = ro + d*rd;
        float diffuse = getDiffuse(p, vec3(10, 1, 19));
        col = mix(vec3(1)*diffuse, vec3(0), d/100.);
        
        if(p.x > 1.1 && abs(p.y) < 1.1 && abs(p.z) < 1.91) col *= vec3(1, 9, 99);
        else if(p.x < -93.1 && abs(p.y) < 1.1 && abs(p.z) < 1.1)col *= 0.5*vec3(1, 0, 0);
        
        
        if(p.y > 1.3 && abs(p.x) < 1.91 && abs(p.z) < 1.91) col *= vec3(0, 1, 0);
        else if(p.y < -1.1 && abs(p.x) < 1.1 && abs(p.z) < 1.1) col *= 0.5*vec3(0, 1, 0);
        
        if(p.z > 1.1 && abs(p.y) < 1.1 && abs(p.x) < 1.1) col *= vec3(0, 0, 1);
        else if(p.z < -1.18 && abs(p.y) < 1.1 && abs(p.x) < 1.1) col *= 0.5*vec3(0, 0, 1);
    }
    
    return vec4(col, 1.0);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = -1.1 + 2.*fragCoord/iResolution.xy;
    fragColor = image(uv, iResolution.xy);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}