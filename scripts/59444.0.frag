// BREXIT

#ifdef GL_ES
precision highp float;
#endif

// glslsandstorm uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define texture(s, uv) vec4(0.)

// --------[ Original ShaderToy begins here ]---------- //
const float pi = 3.14159;

mat3 xrot(float t)
{
    return mat3(1.0, 0.0, 0.0,
                0.0, cos(t), -sin(t),
                0.0, sin(t), cos(t));
}

mat3 yrot(float t)
{
    return mat3(cos(t), 0.0, -sin(t),
                0.0, 1.0, 0.0,
                sin(t), 0.0, cos(t));
}

mat3 zrot(float t)
{
    return mat3(cos(t), -sin(t), 0.0,
                sin(t), cos(t), 0.0,
                0.0, 0.0, 1.0);
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float map(vec3 pos, float q)
{
    float so = q;
    float sr = atan(pos.z,pos.x);
    so += pos.y * 0.5;
    so += sin(pos.y*75.0+sr-iTime) * 0.005;
    so += sin(pos.y*125.0+sr-iTime*10.0) * 0.004;
    float ro = pos.y*10.0-iTime;
    pos.xz += vec2(cos(ro), sin(ro)) * 0.07;
	float d = sdCappedCylinder(pos, vec2(so, 10.0));
    float k = pos.y;
    return smin(d,k,10.0);
}

vec3 surfaceNormal(vec3 pos)
{
 	vec3 delta = vec3(0.01, 0.0, 0.0);
    vec3 normal;
    normal.x = map(pos + delta.xyz,0.0) - map(pos - delta.xyz,0.0);
    normal.y = map(pos + delta.yxz,0.0) - map(pos - delta.yxz,0.0);
    normal.z = map(pos + delta.zyx,0.0) - map(pos - delta.zyx,0.0);
    return normalize(normal);
}

float trace(vec3 o, vec3 r, float q)
{
	float t = 0.0;
    float ta = 0.0;
    for (int i = 0; i < 8; ++i) {
        float d = map(o + r * t, q);
        t += d * 1.0;
    }
    return t;
}

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	uv.y -= 0.4;
	uv.x += 2.75;
	float d = I(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.55*CHS);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 r = normalize(vec3(uv, 1.0));
    float tn = texture(iChannel0,vec2(iTime*0.1,0.0)).x;
    tn = tn * 2.0 - 1.0;
    r *= zrot(sin(tn)*0.2) * xrot(-pi*0.05+sin(tn)*0.1);
    
    vec3 o = vec3(0.0, 0.15, -0.5);
    
    float t = trace(o, r, 0.0);
    vec3 world = o + r * t;
    vec3 sn = surfaceNormal(world);
    
    vec3 vol = vec3(0.0);
    
    for (int i = 0; i < 3; ++i)
    {
        float rad = 0.2+float(1+i)/3.0;
        float tt = trace(o,r,rad);
        vec3 wa = o + r * tt;
        float atlu = atan(wa.x,wa.z) - tt * 4.0 + iTime;
        float atlv = acos(wa.y/length(wa)) + tt * 4.0;
        vec3 at = texture(iChannel0, vec2(atlu,atlv)).xxx;
        vol += at / 3.0;
    }
    
    float prod = max(dot(sn, -r), 0.0);
    
    float fd = map(world, 0.0);
    float fog = 1.0 / (1.0 + t * t * 0.1 + fd * 10.0);
    
    vec3 sky = vec3(148.0,123.0,120.0) / 255.0;
    
    vec3 fgf = vec3(210.0,180.0,140.0) / 255.0;
    vec3 fgb = vec3(139.0,69.0,19.0) / 255.0;
    vec3 fg = mix(fgb, fgf, prod);
    
    vec3 back = mix(fg, sky, 1.0-fog);
    vec3 mmb = mix(vol, back, 0.8);
    
    vec3 fc = mmb * vec3(1.0);
    
    
	uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y += abs(sin(time+uv.x)*0.2);
	float dd= GetText(uv*2.0);
	fc = mix(fc+vec3(.5,0.5,.9), fc,dd);
	fragColor = vec4(fc, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}