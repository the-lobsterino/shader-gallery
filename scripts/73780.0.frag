/*
 * Original shader from: https://www.shadertoy.com/view/NllXDn
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


// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}






vec3 glow(vec3 original, vec3 col, vec2 uv, vec2 pos, float radius){
    return original + col * ((1.0-length((uv - pos)/radius)));
}

vec3 rect(vec3 original, vec3 col, vec2 uv, vec2 pos, vec2 size){
    pos -= size * 0.5;
    vec2 r = vec2(step(pos.x, uv.x), step(pos.y, uv.y));
    r *= vec2(step(uv.x, pos.x + size.x), step(uv.y, pos.y + size.y));
    return original + col * (r.x * r.y);
}

vec3 fire(vec3 col, vec2 uv, float t){
    uv = (uv - vec2(0.5, 0.61)) * 8.0 + 0.5;
    uv.x += snoise(vec2(uv.y * 2.0, t)) * 0.08;
    uv.x = (uv.x - 0.5) * clamp(uv.y, 0.1, 1.0) * 18.0 + 0.5;
    t *= 2.0;
    float f = mix(0.6, 1.0, snoise(vec3(uv * 50.0 - vec2(0.0, t * 30.0), t * 5.0)));
    f *= mix(0.6, 1.0, snoise(vec3(uv * 10.0 - vec2(0.0, t * 5.0), t * 2.0)));
    f *= mix(0.6, 1.0, snoise(vec3(uv * 9.0 - vec2(0.0, t * 3.0), t * 1.5)));
    if(f < 0.2) f = 0.0; else f = 1.0;
    f *= clamp(1.0 - length((uv - vec2(0.5, 0.15)) * 3.0), 0.0, 1.0) * 5.0;
    f *= pow(clamp(1.0 - length((uv - 0.5) * vec2(5.0, 1.5)), 0.0, 1.0), 0.5);
    f *= clamp(0.3 - uv.y, 0.0, 1.0);
    return col * f;
}

vec3 smoke(vec3 col, vec2 uv, float iTime){
    return mix(col, rect(col, vec3(2.0), vec2(uv.x + snoise(vec2(uv.y * 10.0 - iTime, iTime)) * 0.005, uv.y), vec2(0.5, 1.02), vec2(0.005, 1.0)), clamp(uv.y - 0.61, 0.0, 1.0));
}


void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    uv.y = ((uv.y - 0.5) / iResolution.x * iResolution.y) + 0.5;
    
    float intensity = snoise(vec2(iTime * 1.0, 0.0));
    intensity += snoise(vec2(iTime * 5.0, 1.0)) * 0.2;
    
    vec3 col = glow(vec3(mix(0.0, 0.1, intensity)), vec3(0.3), uv, vec2(0.5, 0.5), 1.0);
    col = rect(col, vec3(0.5, 0.55, 0.4), vec2(uv.x + sin(uv.y * 50.0) * 0.001, uv.y + uv.x * 0.07), vec2(0.5, 0.04), vec2(0.06, 1.03));
    col = glow(col, vec3(2.0, 1.0, 0.5) * 0.6, uv, vec2(0.5, 0.55), mix(0.1, 0.11, intensity));
    col = rect(col, vec3(-0.3), vec2(uv.x + sin(iTime * -10.0 + uv.y * 100.0) * 0.0005, uv.y), vec2(0.5, 0.53), vec2(0.003, 0.03));
    
    col += fire(vec3(1.0, 0.4, 0.4), uv, iTime);
    col += fire(vec3(1.0, 1.0, 1.0), uv, iTime * 1.3);
    col = smoke(col, uv, iTime);
    col = smoke(col, uv, iTime + 1872.298);
    
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}