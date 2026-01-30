/*
 * Original shader from: https://www.shadertoy.com/view/3sXyD2
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
// Fork of "Day 102" by jeyko. https://shadertoy.com/view/3dfcW2
// 2020-03-30 09:07:28

// Fork of "Day 101" by jeyko. https://shadertoy.com/view/WslyWS
// 2020-03-30 07:59:19

#define pi acos(-1.)
#define tau (2.*pi)
#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))

float xch(float d, float b){
	return b < 0. ? 1.2 - d : d;
}

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

float sdBox(vec2 p, vec2 s){
	p = abs(p) - s;
	return max(p.x, p.y);
}

const float speed = 0.6;
float scenes[3];

float S = 0.3;
vec3 get( vec2 fragCoord  )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;    
    uv *= 2.;
    float col = 0.;
    
    float d = 10e6;
    
    float bA;
    float bB;
    float bC;
    float bD;
    float bE;
    
    float pl;
    
    float t = iTime;
    
    //t += scenes[0];
    //t += scenes[1] - 0.1;
    t += scenes[2] - 0.1;
    
    uv *= rot(pi*0.25);
    t = mod(t, scenes[0] + scenes[1]   );
    
    float offsamt = 0.5;
    float offs = -S*offsamt;
    float offsB = S*(1. - offsamt);
    
    if(t < scenes[0]){
        float env = ease(t/scenes[0], 2.);
        
        float mov = env * offs;
        bA = sdBox(uv - vec2(0.+S + mov,S + mov), vec2(S*1.));
        bB = sdBox(uv + vec2(0.+S + mov,S + mov), vec2(S*1.));
        bC = sdBox(uv - vec2(0.-S - mov,S + mov), vec2(S*1.));
        bD = sdBox(uv + vec2(0.-S - mov,S + mov), vec2(S));
        bE = sdBox(uv, vec2(-offs*(0. + env*1.)));
        col = xch(col,bA);
        col = xch(col,bB);
        col = xch(col,bC);
        col = xch(col,bD);
        col = xch(col,bE);
    
    } else if(t < scenes[1] + scenes[0]){
        t -= scenes[0];
        float env = ease(t/scenes[1], 4.);
        
        float mov = -env * offs*8.;
        float movb = -env * offs*1.;
        float offsS = 0.*-offs;
        
        
        bA = sdBox(uv - vec2(0.+S + offsS + mov,S+ offsS + mov), vec2(offsB));
        bB = sdBox(uv + vec2(0.+S + offsS + mov,S+ offsS + mov), vec2(offsB));
        bC = sdBox(uv - vec2(0.-S - offsS - mov,S+ offsS + mov), vec2(offsB));
        bD = sdBox(uv + vec2(0.-S - offsS - mov,S+ offsS + mov), vec2(offsB));
        
        uv *= rot(0.5*pi*env);
        bE = sdBox(uv, vec2(-offs + movb*3.));
        col = xch(col,bA);
        col = xch(col,bB);
        col = xch(col,bC);
        col = xch(col,bD);
        col = xch(col,bE);
        
    }  else if(t < scenes[1] + scenes[0] + scenes[2]){
        t -= scenes[0] + scenes[1];
        float env = ease(t/scenes[2], 4.);
        
        float mov = env * offs*2.;
        uv *= rot(0.5*pi*env);
        bA = sdBox(uv, vec2(offsB*2. - mov));
        col = xch(col,bA);
        
            
    } 
    //col += smoothstep(0.00,3./iResolution.y,-d);
    
    return vec3(col);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    scenes[0] = 1.*speed;
    scenes[1] = 1.5*speed;
    scenes[2] = 1.21*speed;

    vec3 col = vec3(0);
    
    const float aa = 6.;
    
    for(float i =0.; i < aa*aa   ; i++){
    	col += get(fragCoord + vec2(mod(i,aa),floor(i/aa))/aa);
    }
    col /= aa*aa;
    
    
    col = max(col, 0.);
	col = pow(col, vec3(0.4545));
    
    col = 1. - col;
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}