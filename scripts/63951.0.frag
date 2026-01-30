/*
 * Original shader from: https://www.shadertoy.com/view/MscyDj
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
vec2 rotate(vec2 pos, float angle){
    float s = sin(angle);
    float c = cos(angle);
    
    return mat2(c, -s, s, c) * pos;
}

float plane(vec3 pos){
    return pos.y+sin(pos.z*.25+iTime)*cos(pos.x*.25+iTime*2.)*2.;
}

float sphere(vec3 pos, float radius){
    return length(pos) - radius;
}

float box(vec3 pos, vec3 size){
    return length(max(abs(pos)-size, .0));
}

float roundedBox(vec3 pos, vec3 size, float radius){
    //pos.x += sin(iTime)*4.;
    return length(max(abs(pos)-size, .0)) - radius;
}

float map(vec3 pos){
    float planeDist = plane(pos);
    
    pos.xy = rotate(pos.xy, sin(iTime)*pos.z*0.02);
    //pos.yz = rotate(pos.yz, sin(iTime)*pos.x*0.01);
    //pos.x = abs(pos.x);
    pos = mod(pos + 10., 20.) - 10.;
    
    pos.xy = rotate(pos.xy, iTime);
    pos.xz = rotate(pos.xz, iTime*0.7);
    
    return min(planeDist, roundedBox(pos, vec3(2.), 3.));    
}

vec3 computeNormal(vec3 pos){
    vec2 eps = vec2(.01, .0);
    return normalize(vec3(
        map(pos + eps.xyy) - map(pos - eps.xyy),
        map(pos + eps.yxy) - map(pos - eps.yxy),
        map(pos + eps.yyx) - map(pos - eps.yyx)
        ));
}

vec3 albedo(vec3 pos){
    pos += .5;
    
    //return fract(pos.x) * fract(pos.y) * vec3(1.);
    
    float f = smoothstep(.34, .35, fract((pos.x*.3)+sin(pos.z)*.4))*fract((pos.z*.8)+cos(pos.x*.3)*.5);
    
    return f * vec3(1.);
}

vec3 lightDirection = normalize(vec3(1.,.6,-1.));

float diffuse(vec3 normal){
    return max(dot(normal, lightDirection), .0);
}

float specular(vec3 normal, vec3 dir){
    vec3 h = normalize(normal - dir);
    return pow(max(dot(h, normal), .0), 100.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv = uv*2.-1.;
    uv.x *= iResolution.x/iResolution.y;
    
    float time = iTime;
    vec3 camAnim = vec3(sin(time*.5)*2., cos(time*.4)*1.+4.,2.);
    vec3 pos = vec3(.0, 5., -31.);
    pos += camAnim;
    
    vec3 dir = normalize(vec3(uv, 1.));
    //dir.xz *= mat2(cos(time), -sin(time), sin(time), cos(time));
    
    vec3 col = vec3(.0);
    
    for(int i=0; i<32; ++i){
        float d = map(pos);
        if (d<.01){
            
            vec3 norm = computeNormal(pos);
            float diff = diffuse(norm);
            float spec = specular(norm, dir);
            
            float lightDist = sphere(pos, 20.);
            vec3 lightCol = vec3(.2,.4,.9);
            
            col = (diff+spec) * 20./(lightDist*lightDist)*lightCol*albedo(pos);
            //col = (diff+spec) * lightCol*albedo(pos);
        }
        pos += d*dir;
        
    }
    
    //vec3 norm = computeNormal(pos);
    //fragColor = vec4(norm,1.0);
    //float c = diffuse(computeNormal(pos));
    //float c = specular(computeNormal(pos), dir);
    
    float fogFactor = exp(-pos.z * .03);
    col = mix(vec3(0.8,0.9,1.0), col, fogFactor);
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}