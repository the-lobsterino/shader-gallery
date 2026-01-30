/*
 * Original shader from: https://www.shadertoy.com/view/llSBzz
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
#define saturate(x) clamp(x, 0.0, 1.0)

#define RIBBON_MATERIAL 2.0
#define BOX_MATERIAL 3.0
#define GOLD_MATERIAL 4.0
#define GROUND_MATERIAL 5.0
#define METAL_MATERIAL 6.0

// ---------------------------------------------------------

// hg
void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// hg
float vmax(vec3 v) {
	return max(max(v.x, v.y), v.z);
}

// hg
float fBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
} 

// hg
float vmax(vec2 v) {
	return max(v.x, v.y);
}

// hg
float fBox2Cheap(vec2 p, vec2 b) {
	return vmax(abs(p)-b);
}

float fBox2(vec2 p, vec2 b) {
	vec2 d = abs(p) - b;
	return length(max(d, vec2(0))) + vmax(min(d, vec2(0)));
}

// hg
float fCapsule(vec3 p, float r, float c) {
	return mix(length(p.xz) - r, length(vec3(p.x, abs(p.y) - c, p.z)) - r, step(c, abs(p.y)));
}

// iq
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d)
{
    return saturate(a + b * cos(6.28318 * (c * t + d)));
}

// iq
float length2( vec2 p )
{
	return sqrt( p.x*p.x + p.y*p.y );
}

// iq
float length6( vec2 p )
{
	p = p*p*p; p = p*p;
	return pow( p.x + p.y, 1.0/6.0 );
}

// iq
float length8( vec2 p )
{
	p = p*p; p = p*p; p = p*p;
	return pow( p.x + p.y, 1.0/8.0 );
}

// iq
float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.yz)-t.x,p.x);
  return length(q)-t.y;
}

// iq
float sdTorus82( vec3 p, vec2 t )
{
  vec2 q = vec2(length2(p.yz)-t.x,p.x);
  return length8(q)-t.y;
}

// iq
vec2 opU(vec2 d1, vec2 d2 )
{
    return d1.x < d2.x ? d1 : d2;
}

// iq
vec3 rotateY( in vec3 p, float t )
{
    float co = cos(t);
    float si = sin(t);
    p.xz = mat2(co,-si,si,co)*p.xz;
    return p;
}

// iq
vec3 rotateX( in vec3 p, float t )
{
    float co = cos(t);
    float si = sin(t);
    p.yz = mat2(co,-si,si,co)*p.yz;
    return p;
}

// iq
vec3 rotateZ( in vec3 p, float t )
{
    float co = cos(t);
    float si = sin(t);
    p.xy = mat2(co,-si,si,co)*p.xy;
    return p;
}

float impulse( float k, float x )
{
    float h = k*x;
    return h*exp(1.0-h);
}

float longTailImpulse(float k, float x)
{
    float c = .3;
    return mix(impulse(k, x), impulse(k, (x+1.0/k) * c), step(1.0/k, x));
}
// ---------------------------------------------------------


float animationTime()
{
	return mod(iTime, 10.0);
}

float mechTime()
{
    float t = smoothstep(2.0, 4.0, animationTime() + sin(iTime * 24.0) * .025);
    
    // ugly ugly
    t *= smoothstep(4.5, 4.0, animationTime());    
    return t;
}

float cameraIntroTime()
{
    float t = smoothstep(2.0, 4.0, animationTime() + sin(iTime * 24.0) * .025);
    t *= smoothstep(4.5, 4.0, animationTime());
    return t;
}

float explosionTime()
{
    return max(0.0, animationTime() - 3.5) / (10.0 - 3.5);
}

float glowTime()
{
    return max(0.0, animationTime() - 3.35) / 7.65;
}

vec3 debug(float factor)
{
	vec3 a = vec3(0.5);
	vec3 b = vec3(0.35);
	vec3 c = vec3(1.25, 1.0, .5);
	vec3 d = vec3(0.75, .99, .35);

	return palette(factor, a, b, c, d);
}

vec3 bend(vec3 p, float a)
{    
    float c = cos(p.y * a);
    float s = sin(p.y * a);
    mat2  m = mat2(c,-s,s,c);
    
    return vec3(m * p.xy, p.z);
}

float ribbon(vec3 p)
{   
    vec3 op = p;
    float e = exp(-p.z * p.z * .8);
    
    p.y += .1;
    p.y *= mix(1.1, 10.0, e);

    p.y *= mix(6.0, 1.6, smoothstep(-.1, .1, p.y));
    
    p.y += .2;

    p.z *= mix(1.0, 1.35, saturate(p.x * p.x * .5));
    p.x *= mix(.3, .2, smoothstep(.5, 2.5, abs(p.z)));
        
    float d = sdTorus82(p, vec2(3.0, .01)) * .1 - .005;
    
    // sdf fix for ao/shadows
    d = max(d, fBox(op, vec3(1.0, 1.3, 3.5)) * 1.5);
        
    return d;
}

float centerRibbon(vec3 p)
{    
    vec3 op = p;
    p.y += .1;
    p.y *= mix(1.5, 1.0, smoothstep(.0, .1, p.y));
    p.x *= .5;
    p.y *= 2.3;
    float r = saturate(p.x * p.x);    
    float d = sdTorus82(p, vec2(mix(.75, 1.9, r), .16)) * .1;
    
    // sdf fix for ao/shadows
    d = max(d, fBox(op, vec3(.5, .5, 1.2)) * 1.5);
    
    return d;
}

float strap(vec3 p)
{
    p.x -= 1.9;
    p.y += .35;
    
    float x = p.x - .75;
    vec3 rp = p - vec3(0.0, -.5, 0.0);
    p = mix(p, rotateZ(rp, -1.57), saturate(x * .35));
    
    p.x -= abs(p.z) * .4;
    
 	return fBox(p, vec3(1.5, .075, .5)) * .5;   
}

float boxLid(vec3 p)
{
    p.y += 1.3;
    p.xz *= mix(1.0, 1.1, saturate((p.y - .375) * 2.5));
        
    float r = 1.0 - (smoothstep(.6, .75, abs(p.z)) + smoothstep(.6, .75, abs(p.x)));
    
    float d = fBox(p, vec3(2.6, .6, 2.6) - r * .1);
    
    vec3 rp = rotateY(p, .787);
    d = max(d, fBox(rp, vec3(3.7)));
    
    return d * .5;
}

float lidStraps(vec3 p)
{
    p.zx = mix(p.zx, p.xz, step(.65, abs(p.z)));
    
    p.y += 1.3;
    p.xz *= mix(1.0, 1.1, saturate((p.y - .375) * 2.5));        
    float r = 1.0 - (smoothstep(.6, .75, abs(p.z)) + smoothstep(.6, .75, abs(p.x)));    
    float d = fBox(p, vec3(2.8, .75, .6));        
    return d * .5;
}

float mainBox(vec3 p)
{
    p.y += 3.2;
    
    float r = 1.0 - (smoothstep(.6, .75, abs(p.z)) + smoothstep(.6, .75, abs(p.x)));    
    float d = fBox(p, vec3(2.45, 2.25, 2.45) - r * .1);
    
    vec3 rp = rotateY(p, .787);
    d = max(d, fBox(rp, vec3(3.45)));
    
    return d;
}

float mechGold(vec3 p)
{
    p.zx = mix(p.zx, p.xz, step(.8, abs(p.z)));
    p.x = abs(p.x) - 2.4;
    
    p.y += 2.45 + mechTime() * 1.;
    
    return fBox(p, vec3(.3, .2, .6));
}

float mechInner(vec3 p)
{
    p.zx = mix(p.zx, p.xz, step(1.5, abs(p.z)));
    p.x = abs(p.x);
    
    p.x -= 2.275;
    p.y += 5.0;
    
    p -= vec3(0., 2.0, 0.0);    
    
    float d = fBox(p, vec3(.2, 1.7, .6)) * .5;
    
    p.x -=.1;
    
    p.y = mod(p.y * 3.0, 1.0) * .33;
    d = max(d, -fCapsule(p.yzx, .2, .3));
    
    return d;
}

float mech(vec3 p)
{
    p.zx = mix(p.zx, p.xz, step(1.5, abs(p.z)));
    p.x = abs(p.x);
    
    p.x -= 2.5;
    p.y += 5.0;
        
    float d = fBox(p, vec3(.15, .5, .6));
    
    p -= vec3(-.1, 2.0, 0.0);
        
    float t = mechTime();
    p.y += 1.0 + mechTime() * 1.;
    
    float e = p.y - .4 - t * .5;
    p.x -= exp(- e * e * (4.0 + t * 16.0) ) * t * .3;
    
    d = min(d, fBox(p, vec3(.15, 1.7, .55)) * .5);
    
    return d;
}

vec3 lidAnimation(vec3 p)
{
    float buildup = mechTime();
    
    p.y += sin(buildup * 123.0) * buildup * buildup * .2;
    
    p = rotateX(p, sin(buildup * 36.0) * buildup * buildup * .055);
    p = rotateZ(p, sin(buildup * 25.0 + 2.1) * buildup * buildup * .045);
    p = rotateY(p, sin(buildup * 55.0 + 1.1) * buildup * buildup * .035);
    
    return p;
}

vec2 sdf(vec3 p)
{
    vec2 d = vec2(50.0, 0.0);
    
    float bounds = length(p + vec3(0.0, 3.0, 0.0)) - 5.0;
    
    if(bounds < .5)
    {
        vec3 lidP = lidAnimation(p);
            
    	d = opU(d, vec2(ribbon(lidP), RIBBON_MATERIAL));
        d = opU(d, vec2(ribbon(rotateY(lidP, .5)), RIBBON_MATERIAL));        
		
        d = opU(d, vec2(centerRibbon(rotateY(lidP, 1.87)), RIBBON_MATERIAL));
        
        d = opU(d, vec2(strap(rotateY(lidP, -.3)), RIBBON_MATERIAL));
        d = opU(d, vec2(strap(rotateY(lidP, 1.23)), RIBBON_MATERIAL));
        
    	d = opU(d, vec2(mech(p), RIBBON_MATERIAL));
        d = opU(d, vec2(mechGold(p), GOLD_MATERIAL));
        d = opU(d, vec2(mechInner(p), METAL_MATERIAL));      

        d = opU(d, vec2(mainBox(p), BOX_MATERIAL));
        d = opU(d, vec2(boxLid(lidP), BOX_MATERIAL));
        
        d = opU(d, vec2(lidStraps(lidP), RIBBON_MATERIAL));
        
    }
    else
    {
        d.x = min(d.x, bounds);
    }
    
    d = opU(d, vec2(p.y + 5.7, GROUND_MATERIAL));

	return d;
}

// No materials
float sdf_simple(vec3 p)
{
    float d = 50.0;
    
    vec3 lidP = lidAnimation(p);
            
    d = min(d, ribbon(lidP));
    d = min(d, ribbon(rotateY(lidP, .5))); 

    d = min(d, centerRibbon(rotateY(lidP, 1.87)));

    d = min(d, strap(rotateY(lidP, -.3)));
    d = min(d, strap(rotateY(lidP, 1.23)));

    d = min(d, mech(p));
    d = min(d, mechGold(p));
    d = min(d, mechInner(p));

    d = min(d, mainBox(p));
    d = min(d, boxLid(lidP));

    d = min(d, lidStraps(lidP));
    d = min(d, p.y + 5.7);

	return d;
}

float sdfDensity(vec3 p)
{
    p.y += 3.75;    
    p.xz *= mix(1.0, 1.25, saturate(p.y * .6));
    float d = fBox(p, vec3(2.65, 1., 2.65));    
    float tx = (sin((p.x+ iTime) * 4.0) * .5 + .5) + (sin((p.z+ iTime*3.0) * 4.0) * .5 + .5);
    
    float density = saturate(1.0 - d * .9);    
    density *= tx * pow(length(p.xz) * .3, 12.0) * smoothstep(0.0, 1.0, p.y);
    
    return density + max(0.0, 5.0 - length(p.xz)) * .0025;
}

vec3 sdfNormal(vec3 p, float epsilon)
{
    vec3 eps = vec3(epsilon, -epsilon, 0.0);
    
	float dX = sdf_simple(p + eps.xzz) - sdf_simple(p + eps.yzz);
	float dY = sdf_simple(p + eps.zxz) - sdf_simple(p + eps.zyz);
	float dZ = sdf_simple(p + eps.zzx) - sdf_simple(p + eps.zzy); 

	return normalize(vec3(dX,dY,dZ));
}

// https://www.shadertoy.com/view/Xts3WM
float curv(in vec3 p, in float w)
{
    vec2 e = vec2(-1., 1.) * w;   
    
    float t1 = sdf_simple(p + e.yxx), t2 = sdf_simple(p + e.xxy);
    float t3 = sdf_simple(p + e.xyx), t4 = sdf_simple(p + e.yyy);
    
    return .25/e.y*(t1 + t2 + t3 + t4 - 4.0*sdf_simple(p));
}

float evaluateShadows(vec3 origin, vec3 toLight)
{
    float res = 1.0;

    float t = .05;
    for(int i = 0; i < 100; ++i)
    {
        if (t >= 2.0) break;
        float h = sdf_simple(origin + toLight*t);
        if( h < 0.001 )
            return 0.0;
        
        res = min( res, 12.0*h/t );
        t += h * .5 + .001;
    }
    return res;
}

const int aoIter = 10;
const float aoDist = 0.01;
const float aoPower = 2.0;

// https://www.shadertoy.com/view/XlXyD4
float evaluateAmbientOcclusion(vec3 p, vec3 n) 
{
    float dist = aoDist;
    float occ = 1.0;
    
    for (int i = 0; i < aoIter; ++i) {
        occ = min(occ, sdf_simple(p + dist * n) / dist);
        dist *= aoPower;
    }
    occ = max(occ, 0.0);
    return occ;
}

vec3 triplanar(vec3 P, vec3 N)
{    
    vec3 Nb = abs(N);
    
    float b = (Nb.x + Nb.y + Nb.z);
    Nb /= vec3(b);	
    
    vec3 c0 = texture(iChannel1, P.xy).rgb * Nb.z;
    vec3 c1 = texture(iChannel1, P.yz).rgb * Nb.x;
    vec3 c2 = texture(iChannel1, P.xz).rgb * Nb.y;
    
    return c0 + c1 + c2;
}

vec3 lighting(vec3 rayO, vec3 rayD, float t, vec2 d, float density)
{
    float m = d.y;
    
    if(m < .5)
        return vec3(0.0);
    
    
    vec3 lPos = vec3(4.0, 3.0, 4.0);
    vec3 p = rayO + rayD * t;
    vec3 normal = sdfNormal(p, .05);
    float spotLight = smoothstep(12.0, 0.0, length(p.xz));
    
    if(m > GROUND_MATERIAL - .5 && m < GROUND_MATERIAL + .5)
    {
        normal = mix(normal, normalize(normal + texture(iChannel1, p.xz * .4).xyz * .2), spotLight);
        
        vec3 noise = texture(iChannel3, p.xz * .3).xyz;
        normal = mix(normal, normalize(normal + (noise * 2.0 - vec3(1.0)) * .5), spotLight * smoothstep(.2, .3, noise.y * noise.x * noise.z));
    }
    
    vec3 R = reflect(-rayD, normal);
    
    vec3 toLight = normalize(lPos - p);
    vec3 H = normalize(toLight - rayD);
    
    float curvW = texture(iChannel0, p.xz + p.yy).r;
    float curvature = curv(p, mix(.05, .2, curvW)) * 1.1; // :D
    
    float rim = pow(max(1.0 - dot(normal, -rayD), 0.0), 4.0) * .5;    
   	float diffuse = dot(normal, toLight);
    float bounce = saturate(-diffuse); 
    diffuse = max(0.0, diffuse);
    
    
    vec3 refl = pow(texture(iChannel2, R).rgb, vec3(2.2));
    float tx = smoothstep(.2, .5, triplanar(p * .35, normal).x);
    float specular = pow(saturate(dot(normal, H)), 8.0 + tx * 3.0);
    
    vec3 color = vec3(diffuse);    
    vec3 lightColor = vec3(1.5, 1.5, 1.75);
    vec3 specularColor = vec3(.9, .95, 1.0) * .45 * lightColor;
    
    float ao = evaluateAmbientOcclusion(p, normal);
    ao = smoothstep(.0, .5, ao);
    
    float shadowStrength = .95;
    float shadow = evaluateShadows(p, toLight);
    shadow = mix(shadow, 1.0, 1.0 - shadowStrength);
    
    float r = 2.0 - (smoothstep(.4, .5, abs(p.z)) + smoothstep(.4, .5, abs(p.x)));
    
	float lightTime = mechTime();
    vec3 glowColor = pow(vec3(.4, .75, .15), vec3(2.2)) * lightTime;
        
    if(m < RIBBON_MATERIAL + .5)
    {
        color = vec3(.5, 0.1, 0.075) * (1.0 + curvature * 1.5);
        
        color += color * abs(sdf_simple(p - normal * .3) / .25);
        specular *= specular * specular;
        specularColor *= .25;
        rim *= .25;
    }
    else if(m < BOX_MATERIAL + .5)
    {
        float pattern = smoothstep(-.15, .15, sin((p.x - p.y + p.z) * 2.3 - 1.1));
        color = mix(vec3(.15, .4, .1), vec3(.2, .9, .2), pattern);
        color += vec3(.5, 1.0, .5) * curvature * curvature * 4.0;
        rim *= .2;
        
        color = mix(color, vec3(1.2, 1.0, .5) * 7.0, r);
    }
    else if(m < GOLD_MATERIAL + .5)
    {
		color = (vec3(1.2, .9, .3) + refl * refl) * 1.5;
        specularColor = refl * 2.0;
    }
    else if(m < GROUND_MATERIAL + .5)
    {
		color = vec3(.2, .25, .275) * (1.4 + spotLight * diffuse) * 1.45;
        
        color += glowColor * .5 * saturate(1.0 - max(-fBox2(p.xz, vec2(4.0)), length(p.xz) - 5.25));
        
        specular *= .1;
        rim = 0.0;
        
        normal = normalize(normal + texture(iChannel1, p.xz * .1).xyz); 
    }
    else if(m < METAL_MATERIAL + .5)
    {
		color = (vec3(.6) + refl * refl) * 1.5;
        specularColor = refl * 2.0;
    }
    
    color = pow(color, vec3(2.2)) * spotLight;
    
    vec3 ambientLight = vec3(.65, .5, 1.0);
    
    vec3 outColor = color * diffuse + specularColor * specular + ambientLight * rim;
    outColor *= shadow;
    outColor = mix(outColor * .1 * ambientLight, outColor, ao);
    outColor += vec3(.3, .1, .1) * bounce * bounce * color;
    
    outColor += glowColor * density * .03;
    
    return pow(outColor * lightColor, vec3(.454));
}

vec4 trace(vec3 rayO, vec3 rayD)
{    
    float maxDistance = 35.0;
    float t = 18.25;
    vec2 d = vec2(0.0);
    float density = 0.0;
    
	for(int j = 0; j < 200; j++)
	{
        vec3 p = rayO + rayD * t;
		d.x = sdf_simple(p);
        density += sdfDensity(p);

		if(d.x < .01)
            break;

		t += d.x;
        
        if(t > maxDistance)
            break;
	}
    
    d = sdf(rayO + rayD * t);
    
    return vec4(t, d, density);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (-iResolution.xy + (fragCoord*2.0)) / iResolution.y;
    
    float vignette = 1.0 - pow(length(uv) / 2., 3.0);
    
    float time = .65 + iTime * .0;
    vec3 target = vec3(0.0, -2.9, 0.0);
    float dist = 22.0;
    
    float cT = cameraIntroTime();
    
    vec3 p = vec3(0.0, 3.5, 0.0) + vec3(cos(time), sin(cT * 6.28 * 2.0) * .02, sin(time)) * dist;
    
    vec3 offset = vec3(cos(cT * 83.0), -sin(cT * 55.0 + .4), sin(cT * 72.0)) * .1 * cT;    
    offset.y += longTailImpulse(35.0, explosionTime()) * 15.0;
    offset.y -= impulse(8.0, max(0.0, cameraIntroTime() - .8)) * 3.0;
        
    // Impulse doesn't get to 0 on time
    target += offset * smoothstep(9.5, 8.5, animationTime());
    
    vec3 forward = normalize(target - p);
    vec3 left = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(forward, left));    
    
    float zoom = mix(.25, .2, cT);
    vec3 rayOrigin = p;
    vec3 rayDirection = normalize(forward + left * uv.x * zoom - up * uv.y * zoom);
    
    vec2 screenUV = fragCoord / iResolution.xy;
    
    vec4 data = trace(rayOrigin, rayDirection);
    
    vec3 color = lighting(rayOrigin, rayDirection, data.x, data.yz, data.w);
    
    float gT = impulse(70.0, glowTime());
    uv *= mix(1.0, .3, gT);
 	vec3 glowColor = vec3(.3, .75, .15);
    vec3 fx = glowColor * pow(saturate(1.0 - length(uv)), 2.0);
    fx += glowColor * pow(saturate(1.0 - length(uv * vec2(.25, 1.0))), 2.0);
    fx += glowColor * pow(saturate(1.0 - length(uv * vec2(.1, 7.0))), 2.0);
    
    color += fx * gT;
	fragColor = vec4(mix(color * color * vec3(1.0, .2, .9), color, vignette), 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}