/*
 * Original shader from: https://www.shadertoy.com/view/wdfyD7
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

// Emulate a texture
#define texture(s, uv) vec4(0.5)

// --------[ Original ShaderToy begins here ]---------- //
// 2020 Passion
// Timothy Michael Walsh

#define NUM_STEPS 48

mat2 r2(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(s,-c,c,s);
}

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float hash31(vec3 p){
    p = fract(p*vec3(123.34, 456.21, 768.78));
    p += dot(p, p+45.32);
    return fract(p.x * p.y * p.z);
}

float udRoundBox(vec3 p, vec3 b, float r){
  return length(max(abs(p)-b,0.0))-r;
}

vec3 color = vec3(0.0);

float map(vec3 p){
    vec3 id = floor(p);
    float r = hash31(id.xzx);
    
    float sn = sin(noise(vec2(iTime))+1.5);
    float spacing = clamp(sn, .5, 1.725);//+.1;
    id = floor(p*spacing);
    float rrr = hash31(id);
    float fastSlow = (rrr<.49) ? 1.0 : 3.0;

    p = mod(clamp(p, -2.0/spacing, 2.0/spacing),1.0/spacing)-.5/spacing;
    
    float circle =  0.0; 
    float d = circle;

    float rr = hash31(id);//*(spacing*.0025);
    p.xy *= r2( spacing*rr*fastSlow*13.0 ); //(rr*iTime*4.0*fastSlow)*(spacing*.0725));
    p.zx *= r2( spacing*rr*fastSlow*14.0 ); //(fract(rr*34.45)*iTime*3.5*fastSlow)*(spacing*.0725));
    
    circle = udRoundBox(p, vec3(.2), .02);
    float n1x = hash31(id.yzy);
    float n1y = hash31(id.xzx);
    float n1z = hash31(id.yxy);
    color = clamp(vec3(n1x,n1y,n1z),.5,.95)*1.5;
    
    return circle;
}

float trace(vec3 o, vec3 r){
    float t = 0.0;
    for(int i = 0; i < NUM_STEPS; i++){
        float d = map(o+r*t);
        if(abs(d) < 0.01 || t > 15.) break;
        t += d*0.75; 
    }
    return t;
}

vec3 getNormal(vec3 p){
    vec2 e = vec2(0.0, 0.01);
    return normalize((vec3(map(p+e.yxx),map(p+e.xyx),map(p+e.xxy))-map(p))/e.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (2.0*fragCoord/iResolution.xy)-1.0;
    //uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    float t = iTime*.5;
    vec3 r = normalize(vec3(uv, 1.0 - dot(uv,uv)*.325));
    //float spacing = clamp((sin(iTime)+1.0), .5, 1.25);
    vec3 o = vec3(0.0, 0.0, -3.5);   //+iTime
    o.zy *= r2(t*1.5);
    
    r.zy *= r2(t*1.5);
    o.xz *= r2(-t*.75);
    r.xz *= r2(-t*.75);
    float ht = trace(o, r);
    vec3 sp = o+r*ht;
    float d = map(sp);
    vec3 l = normalize(vec3(0.2,0.8,0.1));
	vec3 n = getNormal(sp);
    
    vec3 viewDir = normalize(r);

    // this is blinn phong
    vec3 halfDir = normalize(l - viewDir);
    float specAngle = max(dot(halfDir, n), 0.0);
    float specular = pow(specAngle, 80.0);
    
    float ss = texture(iChannel1, vec2(0.0,0.75)).r;
    
    vec4 bg = mix(vec4(0.94)*r.y, vec4(0.0), smoothstep(.071,0.83,sin(ss+r.y*29.)));
    float fog = smoothstep(0.63, 0.01, ht*.03);
    vec3 rf = reflect(r,n);
    vec4 tx = texture(iChannel0, rf)+.5;

    fragColor = (abs(d) < 0.01) ? mix(bg, tx*vec4(color, 1.0)*clamp(dot(n,l),0.2,1.0)+specular, fog) : vec4(bg);
 
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}