/*
 * Original shader from: https://www.shadertoy.com/view/Nst3DX
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
// raymarching based from https://www.shadertoy.com/view/wdGGz3
#define MAX_STEPS 64
#define MAX_DIST 6.
#define SURF_DIST .001
#define Rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
#define MATERIAL_SAND 0

#define ZERO 0


// IQ's 3D noise function. It's faster than the FBM and enough for me to design.
// The compile is also faster.
float noise3d( vec3 p )
{
	const vec3 s = vec3(27, 111, 57);
	vec3 ip = floor(p); p -= ip; 
    vec4 h = vec4(0., s.yz, s.y + s.z) + dot(ip, s);
    p = p*p*(3. - 2.*p); 
    //p *= p*p*(p*(p*6. - 15.) + 10.); // option
    h = mix(fract(sin(h) * 43758.545), fract(sin(h + s.x) * 43758.545), p.x);
    h.xy = mix(h.xz, h.yw, p.y);
    return mix(h.x, h.y, p.z); 
}

vec2 GetDist(vec3 p) {
    vec3 prevP = p;
    p.z += iTime*2.0;
    p+=noise3d(p*1000.0)*0.001;
    p.y+=noise3d(p*3.0)*0.15;
    
    return vec2(p.y,MATERIAL_SAND);
}

vec2 RayMarch(vec3 ro, vec3 rd, float side, int stepnum) {
    vec2 dO = vec2(0.0);

    for(int i=0; i<MAX_STEPS; i++) {
        if (i >= stepnum) break;
        vec3 p = ro + rd*dO.x;
        vec2 dS = GetDist(p);
        dO.x += dS.x*side;
        dO.y = dS.y;
                
        if(dO.x>MAX_DIST || abs(dS.x)<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p).x;
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy).x,
        GetDist(p-e.yxy).x,
        GetDist(p-e.yyx).x);
    
    return normalize(n);
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}

// https://www.shadertoy.com/view/3lsSzf
float calcOcclusion( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=ZERO; i<4; i++ )
    {
        float h = 0.01 + 0.15*float(i)/4.0;
        vec3 opos = pos + h*nor;
        float d = GetDist( opos ).x;
        occ += (h-d)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 2.0*occ, 0.0, 1.0 );
}

vec3 diffuseMaterial(vec3 n, vec3 rd, vec3 p, vec3 col) {
    float occ = calcOcclusion(p,n);
    vec3 diffCol = vec3(0.0);
    vec3 lightDir = normalize(vec3(1,2,-2));
    float diff = clamp(dot(n,lightDir),0.0,1.0);
    float shadow = step(RayMarch(p+n*0.3,lightDir,1.0, 15).x,0.9);
    float skyDiff = clamp(0.5+0.5*dot(n,vec3(0,1,0)),0.0,1.0);
    float bounceDiff = clamp(0.5+0.5*dot(n,vec3(0,-1,0)),0.0,1.0);
    diffCol = col*vec3(-0.5)*diff*shadow*occ;
    diffCol += col*vec3(1.0,1.0,0.9)*skyDiff*occ;
    diffCol += col*vec3(0.3,0.3,0.3)*bounceDiff*occ;
    diffCol += col*pow(max(dot(rd, reflect(lightDir, n)), 0.0), 20.)*occ; // spec
        
    return diffCol;
}

vec3 materials(int mat, vec3 n, vec3 rd, vec3 p, vec3 col){
    if(mat == MATERIAL_SAND){
        vec3 np = p;
        np.z += iTime*2.0;
         float nn = noise3d(np*100.0)*0.2;
        col = diffuseMaterial(n,rd,p,vec3(0.7,0.7,0.3)+nn);
    }
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    
    float handShakeY = noise3d(vec3(iTime*2.0,iTime*2.1,iTime*2.2))*0.15;
    float handShakeX = noise3d(vec3(iTime*2.1,iTime*2.2,iTime*2.1))*0.3;
    
    vec3 ro = vec3(handShakeX, handShakeY, 1.3);
    ro.yz *= Rot(radians(-5.0));
    ro.xz *= Rot(radians(iTime*5.0));
    
    vec3 rd = R(uv, ro, vec3(0,0.0,0), 1.0);
    vec2 d = RayMarch(ro, rd, 1.,MAX_STEPS);
    vec3 col = vec3(1.0);
    
    if(d.x<MAX_DIST) {
        vec3 p = ro + rd * d.x;
        vec3 n = GetNormal(p);
        int mat = int(d.y);
        col = materials(mat,n,rd,p,col);
        col *= exp( -0.0001*d.x*d.x*d.x*d.x );//fog
    } else {
        col = mix(vec3(0.75,0.9,0.9)*0.5,vec3(0.8,0.9,0.9)*0.9,-uv.y+1.0);   
    }
    
    // POST EFFECTS    
    rd.z+=iTime*2.0;
    
    // dust effect
    float c = noise3d(rd) * 0.5 + noise3d(rd * 5.0) * 0.25 + noise3d(rd * 10.0) * 0.1;    
    col+=vec3(0.8,0.8,0.5)*c*0.5;
    
    // gamma correction
    col = pow( col, vec3(0.9545) );    
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}