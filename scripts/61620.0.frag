/*
 * Original shader from: https://www.shadertoy.com/view/4ll3D8
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
/**
'Alien Grass' by Kleber Garcia (c) 2015
**/

vec3 FIN_EXTENDS1 = vec3(0.07, 1.9, 0.001);
vec3 FIN_EXTENDS2 = vec3(0.04, 1.7, 0.001);
vec3 FIN_EXTENDS3 = vec3(0.07, 1.6, 0.001);

vec3 REP_B_BP1 = vec3(0.1216, 0.14, 14.27);
vec3 REP_B_BP2 = vec3(0.116, 0.04, 10.27);
vec3 REP_B_BP3 = vec3(0.126, 0.04, 8.27);

vec2 C_CO1 = vec2(1.2, 0.00);
vec2 C_CO2 = vec2(1.4, 0.03);
vec2 C_CO3 = vec2(0.7, 0.03);



vec2 sincos(float t)
{
    return vec2(sin(t), cos(t));
}

vec3 fin(in vec3 p, in vec3 offset, vec3 FIN_EXTENDS, vec3 REP_B_BP,vec2 C_CO)
{
    float REP = REP_B_BP.x;
    float FIN_BEND = REP_B_BP.y;
    float FIN_BEND_POW = REP_B_BP.z;
    vec3 FIN_O =  vec3(0.0,0.0,0.0);  
    float FIN_CURVATURE = C_CO.x;
    float FIN_CURVE_OFFSET =  C_CO.y;
    vec2 ids = mod(floor(p / REP).xz, 220.0)/220.0;
    vec3 mp = mod(p, REP) - 0.5*REP;
    p = vec3(mp.x,p.y,mp.z) + offset * sin(350.0*ids.x*ids.y);
    
    vec3 finOrigin = FIN_O;
    vec2 sc = sincos(300.0*ids.x + 550.0*ids.y);
    
    p -= finOrigin;
    p = vec3(p.x*sc.x + p.z*sc.y,p.y,p.x*sc.y - p.z*sc.x);
    p += finOrigin;

    
    vec3 pRel = p - finOrigin;
    vec3 finWarped = FIN_EXTENDS;
	float t = clamp(0.5*((clamp(pRel.y, -FIN_EXTENDS.y+FIN_CURVE_OFFSET, FIN_EXTENDS.y+FIN_CURVE_OFFSET) / FIN_EXTENDS.y) + 1.0),0.0,1.0);
   	finWarped.x = finWarped.x - FIN_EXTENDS.x * pow(t,FIN_CURVATURE);
    pRel = (p) - finOrigin + vec3(0.0,0.0,0.0+pow(t,FIN_BEND_POW)*FIN_BEND);
    vec3 distVec = max(abs(pRel) - finWarped, 0.0);
    float j = (abs(pRel.x) / finWarped.x);
    return vec3(length(distVec), 1.0, j*clamp(t-0.5,0.0,1.0));
}

vec3 minOp(in vec3 val1, in vec3 val2)
{
    return val1.x < val2.x ? val1 : val2;
}

vec3 ground(in vec3 p)
{
    return vec3(p.y,1.0,0.01);
}

vec3 bump(in vec3 p)
{
    return vec3(0,0.6*sin(p.x)*cos(p.z) + 0.4*cos(0.7*p.z), 0.0);
}

vec3 scene(in vec3 p)
{
    return minOp(
        	minOp(
                minOp(
                    fin(p, vec3(0,0,0),FIN_EXTENDS1,REP_B_BP1,C_CO1), 
                    fin(p, vec3(0.215,0.0,0.2),FIN_EXTENDS2,REP_B_BP2,C_CO2)), 
                	fin(p, vec3(0.03,0.0,0.2),FIN_EXTENDS3,REP_B_BP3,C_CO3)),
        		ground(p));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec3 p = vec3(2.0 * uv - 1.0, 0.0) ;
	vec3 po = vec3(0,0,1.0);
    p.x *= iResolution.y/iResolution.x;
    
    vec3 pd = normalize(p - po);
    
    vec2 sc = sincos(0.9);   
    //pd = vec3(pd.x*sc.x + pd.z*sc.y,p.y,pd.x*sc.y - pd.z*sc.x);
    pd = vec3(pd.x,pd.y*sc.x + pd.z*sc.y,pd.z*sc.x - pd.y*sc.y);
    
 
	po += vec3(0.1*iTime,2.9,-0.3*iTime);
    
    float t = 0.0;
    vec3 dm = vec3(0,0,0);
    for (int i = 0; i < 120; ++i)
    {
        vec3 np = po + t * pd;
        vec3 s = scene(np + bump(np));
       	if (s.x < 0.001)
        {
            dm = s;
        }
       	t += s.x;
    }
    vec3 col = vec3(0,0,0);
    if (dm.y == 1.0)
    {
        col = dm.zzz;
    }
    col += pow(-(t*pd).z/10.0, 1.7); //quick fog to hide aliasing
    col = clamp(col, 0.0, 1.0);
    
    
	fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}