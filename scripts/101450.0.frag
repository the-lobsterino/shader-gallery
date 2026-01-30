/*
 * Original shader from: https://www.shadertoy.com/view/wtB3zt
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Emulate a texture
#define texture(s, uv) vec4(0.4)

// --------[ Original ShaderToy begins here ]---------- //
float maxDist = 500.;
vec3 camRot = vec3(0, 0, 0);
vec3 lightDir = vec3(1,.5,.2);
vec3 lightColor = vec3(1.2,.9,.5);
vec3 ambientLight = vec3(0.3);

float noise(vec2 p)
{
    return fract(sin(p.x*2.+p.y*2463.)*8732.);
}

float smoothNoise(vec2 p)
{
    vec2 id = floor(p*10.);
    vec2 ld = fract(p*10.);
    
    ld = ld*ld*(3.-2.*ld);
    
    float bl = noise(id);
    float br = noise(id+vec2(1., 0.));
    float b = mix(bl, br, ld.x);
    
    float tl = noise(id+vec2(0., 1.));
    float tr = noise(id+vec2(1., 1.));
    float t = mix(tl, tr, ld.x);
    
    float bt = mix(b, t, ld.y);
    
    return abs(bt);
}

float ridged(float x)
{
    return abs(1.-abs(x));
}

vec2 map(vec3 p)
{
    float a = p.y/10.;
    p += vec3(sin(a), 1, cos(a))*10.;
    float height = 40.;
    float base = 90.-length(p.xz)/5.;
    base-=ridged(smoothNoise(p.xz/500.))*height;
    base+=.5*ridged(smoothNoise(p.xz/250.))*height;
    base-=.1*ridged(smoothNoise(p.xz/100.))*height;
    base-=.01*ridged(smoothNoise(p.xz/40.))*height;
    base+=.008*ridged(smoothNoise(p.xz/15.))*height;
    return vec2(base-p.y, 0);
}

float plaIntersect( in vec3 ro, in vec3 rd)
{
    return -(dot(ro,vec3(0, 1., 0))-5.)/dot(rd,vec3(0, 1., 0));
}

vec3 ray(vec3 ro, vec3 rd, float minD, float maxD, float stepSize) // x channel - distance to hit, y channel - material
{
    float t = minD;
    float ut = 0.;
    float lastVal = 0.; 
    
    for(int i=0; i<500; ++i)
    {
        if (t >= maxD) break;
        vec2 mapSample = map(ro+rd*t);
        
        if((ro+rd*t).y <= 5.)
            ut = t-plaIntersect(ro, rd);
		
        if(mapSample.x > 0.)
            return vec3(t-(abs(mapSample.x)/(abs(mapSample.x)+abs(lastVal)))*stepSize, mapSample.y, ut);
        t+=stepSize;
        stepSize*=1.01;
        lastVal = mapSample.x;
    }
    
    return vec3(maxD, 0, maxD-plaIntersect(ro, rd));
}

vec3 normal(vec3 p)
{
	float delta = 0.01;
    vec3 x = vec3 (delta, 0.00, 0.00);
	vec3 y = vec3 (0.00, delta, 0.00);
	vec3 z = vec3 (0.00, 0.00, delta);
    
    float val = map(p).x;
    vec3 grad = vec3(val - map(p - x).x, val - map(p - y).x, val - map(p - z).x);
    return -normalize(grad);
}


vec3 lighting(vec3 n)
{
    return  max(pow(dot(normalize(lightDir), n), 2.), 0.0) * lightColor +ambientLight;
}

vec3 doFog(vec3 rgb, float dist, float maxD, vec3 rd, vec3 p)
{
    lightDir = normalize(lightDir);
    vec3 fogColor = vec3(.5, .5, .7);
    fogColor += .5*vec3(.7, .1, 0)*pow(abs(1.-abs(rd.y)), 6.);
    fogColor += .3*lightColor*pow(clamp(dot(rd, lightDir), 0., 1.), 3.);
    if(dist == maxD)
    {
    	fogColor += vec3(.5, .4, .5)*smoothNoise(vec2(p.x, p.z)/rd.y/3000.)*smoothNoise(vec2(p.x, p.z)/5./rd.y/3000.)*pow(abs(rd.y), .5);
        fogColor += .4*lightColor*pow(clamp(dot(rd, lightDir), 0., 1.), 50.); 
    }
    return mix(rgb, fogColor, pow(abs(dist/maxD), 1.));
}

vec3 terrainColor(vec3 p)
{
    vec3 n = normal(p);
    float yAlpha = pow(abs(n.y), 6.);
    float xAlpha = pow(abs(n.x), 6.);
    float zAlpha = pow(abs(n.z), 6.);
    vec3 terrainColor = vec3(0);
    vec3 heightColor = vec3(1);
    
    heightColor = mix(vec3(3), vec3(1), clamp(abs(p.y-6.)/3., 0., 1.));
    heightColor = mix(vec3(.7, .8, 0.), heightColor, clamp(abs(p.y-30.)/20., 0., 1.));
    
    terrainColor += texture(iChannel0, vec2(p.z, p.y)/15.).xyz*xAlpha*.5;
    terrainColor += .3*texture(iChannel1, vec2(p.x, p.z)/10.).xyz*yAlpha*heightColor;
    terrainColor += .2*texture(iChannel1, vec2(p.x, p.z)/3.).xyz*yAlpha*heightColor;
    terrainColor += texture(iChannel0, vec2(p.x, p.y)/15.).xyz*zAlpha*.5;
    terrainColor += vec3(smoothNoise((p.xz+p.y)/100.), .5, .5)/15.;
    return terrainColor*lighting(n);
}

vec3 water(vec3 rgb, vec3 p, float ut, float dist, vec3 rd)
{
    vec3 surfacePoint = p-rd*ut;
    float waterBump = smoothNoise(surfacePoint.xz/5.+iTime/10.)/20.;
    vec3 waterNormal = normalize(vec3(waterBump, 1.-waterBump, waterBump));
    vec3 reflectedRd = reflect(rd, waterNormal);
    vec3 rayResult = ray(surfacePoint, reflectedRd, .5, maxDist, 1.);
    vec3 reflection = doFog(terrainColor(surfacePoint+rayResult.x*reflectedRd), rayResult.x, maxDist, reflectedRd, p);
    vec3 underwaterColor = rgb*mix(vec3(.6, 1.2, 1.5), vec3(.1, .1, .2), clamp(abs(p.y-5.)/10., 0., 1.));
    vec3 result = mix(underwaterColor, reflection, 1.-abs(rd.y));
    result += vec3(.6)*pow(clamp(p.y-3.8, 0., 1.), 10.)*texture(iChannel0, vec2(surfacePoint.xz+iTime/10.)/3.).x;
    return result;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord -  iResolution.xy*.5)/iResolution.y;

    // Time varying pixel color
    //vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    float lastXInput = 0.;
    float lastYInput = 0.;
    float deltaXInput = iMouse.x-lastXInput;
    float deltaYInput = iMouse.y-lastYInput;
    	camRot+=vec3(deltaYInput/100., deltaXInput/100., 0);
    
    vec3 camP = vec3(cos(iTime/20.+68.)*350., 16., sin(iTime/20.+68.)*350.);
    vec3 camDir = normalize(vec3(sin(camRot.y), sin(camRot.x), cos(camRot.y)));
    vec3 camRight = cross(camDir, vec3(0, 1., 0));
    vec3 rd = normalize(camDir + camRight*1.*uv.x + vec3(0,1.,0)*1.*uv.y);
    vec3 rayResult = ray(camP, rd, .3, maxDist, 0.1);
    vec3 p = camP+rd*rayResult.x;
	vec3 col = vec3(0);
	
    if(p.y > 5.)
    	col = doFog(terrainColor(p), rayResult.x, maxDist, rd, p);
    else
    	col = doFog(water(terrainColor(p), p, rayResult.z, rayResult.x, rd), rayResult.x-rayResult.z, maxDist, rd, p);
    
    // Output to screen
    fragColor = vec4(col,1.0);
    lastXInput = iMouse.x;
    lastYInput = iMouse.y;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}