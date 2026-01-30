/*
 * Original shader from: https://www.shadertoy.com/view/wlfSWj
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.;
#define iResolution resolution

// Protect glslsandbox uniform names
#define time        stemu_time

// --------[ Original ShaderToy begins here ]---------- //
float PI = 3.14159265;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
mat2 genRotMat(float val){
	return mat2(cos(val),-sin(val),sin(val),cos(val));
}
vec2 randXZ(float i){
	return vec2(rand(vec2(0,i)) - 0.5,rand(vec2(i,0)) - 0.5);
}
float raindrop(vec3 p,vec2 pos,float sky,float ground,float t0){
	float deltaTime = (iTime - t0) * 9.0;
    float drop = max(length(p.xz - pos) - 0.01,abs(p.y - (sky - deltaTime)) - 0.2);
    float wave = max(abs(length(p.xz - pos) -(deltaTime - (sky - ground))*0.25  )- 0.00005,abs(p.y - ground) - 0.00005);
    return deltaTime > (sky - ground) ? wave : drop;
}
float time(){
	return iTime;
}
float map(vec3 p){
    p.xz *= genRotMat(iTime);
	float result = 1000000.0;
    float pivotTime = floor(iTime * 20.0) / 20.0;
    for(float i = 0.0; i < 10.0; i += 0.05){
    	float obj = raindrop(p,randXZ(pivotTime - i) * 2.0,3.0,-0.2,pivotTime - i);
        result = min(result,obj);
    }
    float trimmed = max(result,max(abs(p.x),abs(p.z)) - 1.5);
    float frame = max(abs(max(abs(p.x),abs(p.z))-1.5) - 0.01,abs(p.y + 0.2) - 0.01);
    float under = min(trimmed,frame);
	return under;
}

float trace (vec3 o, vec3 r){
	float t = 0.0;
    for(int i = 0; i < 48; ++i){
        vec3 p = o + r * t;
        float d = map(p);
        t += d * 0.5;
    }
    return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    float PI = 3.14159265;
    vec2 uv = fragCoord.xy /iResolution.xy;
	uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    vec3 r = normalize(vec3(uv,1.5));
    
    vec3 o = vec3(0,0.5,-3.0);
    float t = trace(o,r);
    float fog = 1.0 / (1.0 + t * t * 0.1);
    vec3 fc = vec3(fog);
    // Output to screen
    fragColor = vec4(fc,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef time

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}