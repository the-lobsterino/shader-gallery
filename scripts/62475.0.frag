/*
 * Original shader from: https://www.shadertoy.com/view/WslyWS
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
#define pi acos(-1.)
#define tau (2.*pi)
#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))

// from https://necessarydisorder.wordpress.com/
float ease(float p, float g) {
    if(p < 0.){
        return 0.;
    } else if(p > 1.){
    	return 1.;
    } else {
        if (p < 0.5) 
            return 0.5 * pow(2.*p, g);
        else
            return 1. - 0.5 * pow(2.*(1. - p), g);
    }
}
 
float sdTri(  vec2 p, float s )
{
    //p.y -= s*0.75;
    const float k = sqrt(3.0);
    p.x = abs(p.x) - s;
    p.y = p.y + s/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

float scenes[2]; 

const float S = 0.3;
vec3 get(vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
    
    uv *= 2.;
    vec3 col = vec3(0);
    
    float d = 10e6;
    
    float triA;
    float triB;
    float triC;
    float triD;
    
    float t = iTime;
    
    t = mod(t, scenes[0] + scenes[1]  );
    
    if(t < scenes[0]){
        float env = ease(t, 2.);
        
	    triA = sdTri(uv*rot(pi*1.), S);

        triB = sdTri(uv, 0. + env*S*2.);
        d = min(d, triA) ;

        d = max(d, -triB);
        d = min(d, max(triB, -triA)) ;
    
    } else if (t < scenes[1] + scenes[0]) {
        t -= scenes[0];
        float env = ease(t, 2.)*4.;
        float envb = ease(t, 4.)*1.;
        
        float offs = 1.155;
            
        triC = sdTri(uv - vec2(S*1. + env,0. - S*offs/2.), S);
        triD = sdTri(uv - vec2(-S*1. - env,0. - S*offs/2.), S);
        
        
        uv -= vec2(0.,S*offs - S*offs*envb);
        uv *= rot(pi*envb);
        
        triB = sdTri(uv, S);
        
        d = min(d, triB);
        d = min(d, triC);
        d = min(d, triD);
    } 
    
    col += smoothstep(0.004,0.,d);
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    scenes[0] = 1.;
    scenes[1] = 1.2;

    vec3 col = vec3(0);
    
    const float aa = 5.;
    
    for(float i = 0.; i < (aa * aa); i++) {
    	col += get(fragCoord + vec2(mod(i,aa),floor(i/aa))/aa);
    }
    col /= aa*aa;
    
    
    col = max(col, 0.);
	col = pow(col, vec3(0.4545));
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}