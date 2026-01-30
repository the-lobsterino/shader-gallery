/*
 * Original shader from: https://www.shadertoy.com/view/MdGyWd
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define SPEED 5.0
float c_0 = 31599.0;
float c_1 = 9362.0;
float c_2 = 29671.0;
float c_3 = 29391.0;
float c_4 = 23497.0;
float c_5 = 31183.0;
float c_6 = 31215.0;
float c_7 = 29257.0;
float c_8 = 31727.0;
float c_9 = 31695.0;

// this code is from GLSL sandbox
//returns 0/1 based on the state of the given bit in the given number
float getBit(float num,float bit)
{
    num = floor(num);
    bit = floor(bit);

    return float(mod(floor(num/pow(2.,bit)),2.) == 1.0);
}

float Sprite3x5(float sprite,vec2 p)
{
    float bounds = float(all(lessThan(p,vec2(3,5))) && all(greaterThanEqual(p,vec2(0,0))));

    return getBit(sprite,(2.0 - p.x) + 3.0 * p.y) * bounds;
}

float Digit(float num,vec2 p)
{
    num = mod(floor(num),10.0);

    if(num == 0.0) return Sprite3x5(c_0,p);
    if(num == 1.0) return Sprite3x5(c_1,p);
    if(num == 2.0) return Sprite3x5(c_2,p);
    if(num == 3.0) return Sprite3x5(c_3,p);
    if(num == 4.0) return Sprite3x5(c_4,p);
    if(num == 5.0) return Sprite3x5(c_5,p);
    if(num == 6.0) return Sprite3x5(c_6,p);
    if(num == 7.0) return Sprite3x5(c_7,p);
    if(num == 8.0) return Sprite3x5(c_8,p);
    if(num == 9.0) return Sprite3x5(c_9,p);

    return 0.0;
}

vec4 combine(vec4 val1, vec4 val2 ){
    if ( val1.w < val2.w ) return val1;
    return val2;
}


float dBox2d(vec2 p, vec2 b) {
	return max(abs(p.x) - b.x, abs(p.y) - b.y);
}

vec4 drawGuage(vec2 p) {
	p *= 6.0;
	
    float startX = 3.5;
    float ypos = -5.0;
    vec2 size = vec2(0.3,0.6);
    float padX = 0.8;
 
    vec3 cb0 = vec3(1.0,0.0,0.0);
    vec3 cb1 = vec3(1.0,0.0,0.0);
    vec3 cb2 = vec3(1.0,0.0,0.0);
    vec3 cb3 = vec3(1.0,0.0,0.0);
    vec3 cb4 = vec3(1.0,0.0,0.0);
    vec3 cb5 = vec3(1.0,0.0,0.0);
    vec3 cb6 = vec3(1.0,0.0,0.0);
    vec3 cb7 = vec3(1.0,0.0,0.0);
    vec3 cb8 = vec3(1.0,0.0,0.0);
    vec3 cb9 = vec3(1.0,0.0,0.0);
    
    float t = mod(iTime,10.0);
    if(t<1.0){
        cb0 = vec3(0.0,1.0,0.0);
    } else if(t>=1.0 && t<2.0){
        cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
	} else if(t>=2.0 && t<3.0){
        cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
	} else if(t>=3.0 && t<4.0){
        cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
	} else if(t>=4.0 && t<5.0){
		cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
    	cb4 = vec3(0.0,1.0,0.0);
	} else if(t>=5.0 && t<6.0){
		cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
    	cb4 = vec3(0.0,1.0,0.0);
    	cb5 = vec3(0.0,1.0,0.0);
	} else if(t>=6.0 && t<7.0){
		cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
    	cb4 = vec3(0.0,1.0,0.0);
    	cb5 = vec3(0.0,1.0,0.0);
    	cb6 = vec3(0.0,1.0,0.0);
	} else if(t>=7.0 && t<8.0){
		cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
    	cb4 = vec3(0.0,1.0,0.0);
    	cb5 = vec3(0.0,1.0,0.0);
    	cb6 = vec3(0.0,1.0,0.0);
    	cb7 = vec3(0.0,1.0,0.0);
	} else if(t>=8.0 && t<9.0){
		cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
    	cb4 = vec3(0.0,1.0,0.0);
    	cb5 = vec3(0.0,1.0,0.0);
    	cb6 = vec3(0.0,1.0,0.0);
    	cb7 = vec3(0.0,1.0,0.0);
    	cb8 = vec3(0.0,1.0,0.0);
	} else if(t>=9.0 && t<10.0){
		cb0 = vec3(0.0,1.0,0.0);
    	cb1 = vec3(0.0,1.0,0.0);
        cb2 = vec3(0.0,1.0,0.0);
        cb3 = vec3(0.0,1.0,0.0);
    	cb4 = vec3(0.0,1.0,0.0);
    	cb5 = vec3(0.0,1.0,0.0);
    	cb6 = vec3(0.0,1.0,0.0);
    	cb7 = vec3(0.0,1.0,0.0);
    	cb8 = vec3(0.0,1.0,0.0);
        cb9 = vec3(0.0,1.0,0.0);
    }
    
	vec4 b0 = vec4(cb0, dBox2d(p+vec2(startX,ypos),size));
	vec4 b1 = vec4(cb1, dBox2d(p+vec2(startX-padX,ypos),size));
	vec4 b2 = vec4(cb2, dBox2d(p+vec2(startX-(padX*2.0),ypos),size));
	vec4 b3 = vec4(cb3, dBox2d(p+vec2(startX-(padX*3.0),ypos),size));
	vec4 b4 = vec4(cb4, dBox2d(p+vec2(startX-(padX*4.0),ypos),size));
	vec4 b5 = vec4(cb5, dBox2d(p+vec2(startX-(padX*5.0),ypos),size));
	vec4 b6 = vec4(cb6, dBox2d(p+vec2(startX-(padX*6.0),ypos),size));
	vec4 b7 = vec4(cb7, dBox2d(p+vec2(startX-(padX*7.0),ypos),size));
    vec4 b8 = vec4(cb8, dBox2d(p+vec2(startX-(padX*8.0),ypos),size));
    vec4 b9 = vec4(cb9, dBox2d(p+vec2(startX-(padX*9.0),ypos),size));
	
	vec4 res1 = combine(b0, b1);
	vec4 res2 = combine(b2, b3);
	vec4 res3= combine(b4, b5);
	vec4 res4= combine(b6, b7);
    vec4 res5= combine(b8, b9);
	vec4 res6 = combine(res1, res2);
	vec4 res7 = combine(res3, res4);
	vec4 res8 = combine(res5, res6);
    vec4 res9 = combine(res7, res8);
	
	return res9;
}

float box(vec2 st, float size)
{
    size = 0.5 + size * 0.5;
    st = step(st, vec2(size)) * step(vec2(1.0 - st.x,1.0 - st.y),  vec2(size));
    return st.x * st.y;
}

vec3 buildingTex(vec2 uv)
{
    float n = 10.0;
    vec2 st = fract(uv * n);
    return vec3(box(st, 0.5));
}

float noise(float x) {
    return fract(sin(dot(vec2(x), vec2(12.9898, 78.233)))* 43758.5453);
}

float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

// Tunnel pattern studied from shane & shau
// i.e. https://www.shadertoy.com/view/4tKXzV
vec2 path(float t) {
    float a = sin(t*.2 + 1.5), b = sin(t*.2);
    return vec2(a*2., a*b);
}

vec3 camera(vec3 ro, vec2 uv, vec3 ta) {
    vec3 fwd = normalize(ta - ro);
    vec3 left = cross(vec3(0, 1, 0), fwd);
    vec3 up = cross(fwd, left);
    return normalize(fwd + uv.x*left + up*uv.y);
}

float sdSphere (vec3 p, float r) {
    return length(p)-r; 
}

vec4 map(vec3 p, vec3 p2) {
    vec3 lTex = buildingTex(p.xy);
    
    p.xy -= path(p.z)*0.1;
    float t = 100.0;
    float w = 0.0;

    float n = floor(p.z/0.5);

    vec3 oldp = p;
    p.z = mod(p.z, 1.0)-0.5;

    w = sdBox(p-vec3(0.4,-1.2,0.0),vec3(0.02, 0.01, 0.3));
    t = min(t, w);

    w = 0.1 + dot(oldp, vec3(0, 0.0, 0.0));
    t = min(t, w);


    vec4 temp1 = vec4(0.0,0.0,0.0, t);
    vec4 temp2 = vec4(0.0,0.0,0.0, sdBox(p-vec3(-0.4,-1.2,0.0),vec3(0.02, 0.01, 0.3)));
    vec4 temp3 = vec4(0.8,0.8,0.1, sdBox(p-vec3(0.0,-1.21,0.0),vec3(0.4, 0.01, 1.0)));
    
    p.y += noise(n)*1.0+sin(2.0)*0.1;
    p.x += noise(n)*0.3-0.15;
    
   
    vec4 temp4 = vec4(lTex, sdBox(p+vec3(0.8,0.0,0.0),vec3(0.2, 1.0, 0.3)));
    vec4 temp5 = vec4(lTex, sdBox(p+vec3(-0.8,0.0,0.0),vec3(0.2, 1.0, 0.3)));
    
    vec4 carbody = vec4(0.8,0.4,0.4, sdBox(p2-vec3(0.0,-1.0,0.8),vec3(0.05, 0.05, 0.1)));
    vec4 frontTire = vec4(0.2,0.1,0.1, sdBox(p2-vec3(0.0,-1.0,0.88),vec3(0.08, 0.03, 0.01)));
    vec4 backTire = vec4(0.2,0.1,0.1, sdBox(p2-vec3(0.0,-1.0,0.72),vec3(0.08, 0.03, 0.01)));
    
    float xCarPos = sin(iTime)*0.12;
    float zCarPos = 0.6;
    vec4 carbody2 = vec4(0.4,0.4,0.8, sdBox(p2-vec3(xCarPos,-1.0,0.8+zCarPos),vec3(0.05, 0.05, 0.1)));
    vec4 frontTire2 = vec4(0.1,0.1,0.2, sdBox(p2-vec3(xCarPos,-1.0,0.88+zCarPos),vec3(0.08, 0.03, 0.01)));
    vec4 backTire2 = vec4(0.1,0.1,0.2, sdBox(p2-vec3(xCarPos,-1.0,0.72+zCarPos),vec3(0.08, 0.03, 0.01)));
    
    
    vec4 res1 = combine(temp1,temp2);
    vec4 res2 = combine(temp3,temp4);
    vec4 res3 = combine(temp5,carbody);
    vec4 res4 = combine(frontTire,backTire);
    vec4 res5 = combine(carbody2,frontTire2);
    vec4 res6 = combine(backTire2,res1);
    
    vec4 res7 = combine(res2,res3);
    vec4 res8 = combine(res4,res5);
    vec4 res9 = combine(res6,res7);
    vec4 res10 = combine(res8,res9);
    
    return res10;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = ( fragCoord.xy / iResolution.xy ) * 2.0 - 1.0;
    vec3  dir;

    vec3 pos = vec3(0.0, 0.0, iTime*SPEED);

    float dt = iTime * 6.;
    vec3 ro = vec3(0, 0, -4. + dt);
    vec3 ta = vec3(0, -2, dt);
    vec3 rd;

    ro.xy += path(ro.z);
    ta.xy += path(ta.z);

    dir = camera(ro, uv, ta);

    float t = 0.0;
    vec3 modelCl;
    for(int i = 0 ; i < 50; i++) {
        vec4 temp = map(t * dir + pos, t * dir);
        modelCl = temp.xyz;
        if(temp.w < 0.01) break;
        t += temp.w * 1.0;
    }

    vec3 ip = pos + dir * t;
    vec4 cl = vec4(t * 0.01) * map(ip - 0.02, ip - 0.02) + t * 0.3;

    // UI
    uv = ( fragCoord.xy /iResolution.xy ) * vec2(80,40);
    
    vec2 cpos = vec2(37,28);
    float dc = Digit(mod(iTime,60.0),floor(uv-cpos));
    cpos.x += 3.5;
    dc += Digit(mod(iTime*10.0,10.0),floor(uv-cpos));

    vec3 cl2 = vec3(dc)*vec3(1,1,1);
    
    uv = ( fragCoord.xy * 2.0 - iResolution.xy ) / min( iResolution.x, iResolution.y );
    vec4 res = drawGuage(uv);
	vec3 resColor = res.xyz;

    if(res.w>0.0){
        fragColor = (cl+vec4(modelCl,1.0))-vec4(cl2,1.0);
    } else {
        fragColor = vec4( vec3(resColor), 1.0 );
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}