// new pants

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy globals
float iTime = 0.0;
vec3  iResolution = vec3(0.0);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define saturate(x) clamp(x, 0.0, 1.0)

vec3 Debug(float t)
{
    vec3 c = vec3(0.478, 0.500, 0.500);
    c += .5 * cos(6.28318 * (vec3(0.688, 0.748, 0.748) * t + vec3(0.318, 0.588, 0.908)));
    return clamp(c, vec3(0.0), vec3(1.0));
}

struct Intersection
{
    float totalDistance;
    float sdf;
    int materialID;
};

struct Ray
{
	vec3 origin;
    vec3 direction;
};

Ray GetCamera(vec2 uv, float zoom, float time)
{
    vec3 target = vec3(0.0, 1.5, 0.0);
    vec3 p = vec3(-5.0, 2.0, 25.0) + vec3(cos(time), 0.0, sin(time)) * 1.9;
        
    vec3 forward = normalize(target - p);
    vec3 left = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(forward, left));

    Ray ray;   
    ray.origin = p;
    ray.direction = normalize(forward - left * uv.x * zoom - up * uv.y * zoom);        
    return ray;
}

// A minion shader.
// This was my first raymarched scene for a proc class I took some time ago.
// I never had the time to finish it, so here it is... clunky, unoptimized, etc. 
// No time for fanciness, I wanted to take it out of my system. Also removed the environment.

#define MAX_STEPS 140
#define MAX_STEPS_F float(MAX_STEPS)

#define MAX_DISTANCE 35.0
#define MIN_DISTANCE 10.0
#define EPSILON .01
#define EPSILON_NORMAL .01

#define MATERIAL_MINION 	1
#define MATERIAL_PANTS 		2
#define MATERIAL_PLASTIC 	3
#define MATERIAL_EYE		4
#define MATERIAL_METAL		5

// https://github.com/stackgl/glsl-smooth-min
float smin(float a, float b, float k) 
{
  float res = exp(-k * a) + exp(-k * b);
  return -log(res) / k;
}

// All sdf functions from iq
vec2 opU(vec2 d1, vec2 d2 )
{
    return d1.x < d2.x ? d1 : d2;
}

float sdSphere( vec3 p, float r )
{
	return length(p) - r;
}

float udBox(vec3 p, vec3 b)
{
	return length(max(abs(p) - b, 0.0));
}

float sdPlane( vec3 p)
{
	return p.y;
}

float sdCappedCylinder( vec3 p, vec2 h)
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float pow8(float x)
{
	x *= x; // xˆ9
	x *= x; // xˆ4
	return x * x;
}

float length8(vec2 v)
{
	return pow(pow8(v.x) + pow8(v.y), .125);
}

float sdTorus82( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length8(q)-t.y;
}

float sdTorus( vec3 p)
{
  vec2 q = vec2(length(p.xz)-1.0,p.y);
  return length(q) - .2;
}

float sdHexPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

float udRoundBox( vec3 p, vec3 b, float r )
{
	return length(max(abs(p) - b, 0.0)) - r;
}

float sdCappedCone( in vec3 p)
{
	p.y -= .25;
    vec2 q = vec2( length(p.xz), p.y );
    vec2 v = vec2(0.5773502691896258, -0.5773502691896258);
    vec2 w = v - q;
    vec2 vv = vec2( dot(v,v), v.x*v.x );
    vec2 qv = vec2( dot(v,w), v.x*w.x );
    vec2 d = max(qv,0.0) * qv / vv;
    return sqrt(max(dot(w,w) - max(d.x,d.y), .000000001) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float opUnion( float d1, float d2 )
{
    return min(d1, d2);
}

vec3 opCheapBend( vec3 p, float magnitude)
{
    float c = cos(magnitude * p.y);
    float s = sin(magnitude * p.y);
    mat2  m = mat2(c, -s, s, c);
    vec3 q = vec3( m * p.xy, p.z);
    return q;
}

float Pants(vec3 point)
{
	
    // Mirror
    point.x = abs(point.x);
    vec3 blendOffset = vec3(0.0, 1.5, 0.0);
	vec3 bendedPoint = opCheapBend(point - blendOffset, .15) + blendOffset;
	
    float radius = 1.25;    
	float base = sdCapsule(point, vec3(0.0, .5, .0), vec3(0.0, 2.8, 0.0), radius);
	float hand1 = sdCapsule(bendedPoint, vec3(1.15, 1.25, 0.0), vec3(1.8, .65, 0.0), .135);	
    
    float handBase = sdSphere(point - vec3(1., 0.1, 0.35), .3);
    handBase = min(handBase, sdSphere(point - vec3(.85, 0.1, 0.5), .35));
    
    // Important for straps
    base = smin(base, hand1, 5.0);	
    base = smin(base, handBase, 10.0);
    
    float baseLow = max(base, sdPlane(point - vec3(.0, .2 + abs(point.x*point.x) * -.2, .0)));
    float baseHigh = max(base, udBox(point - vec3(0., 0.3, 0.0), vec3(.8, .4, 2.0)));
    
	float foot = sdCapsule(point, vec3(0.45, -1.0, 0.0), vec3(0.35, 0.5, 0.0), .2);  
    float dist = min(baseHigh, baseLow);
    
    // Smooth with itself
    dist = smin(dist, dist, 30.0);
    
    // Smooth with feet
    dist = smin(dist, foot, 10.0);
    
    vec3 strapOffset = vec3(1.5, .0, 0.0);
    float strap = sdSphere(point - strapOffset, 1.55);
    strap = max(strap, -sdSphere(point - strapOffset, 1.35));
    strap = max(strap, base);
    strap = max(strap, -baseHigh);
    
    return min(dist, strap);
}

float Glass(vec3 point)
{
   vec3 glassPoint = point - vec3(0.0, 2.5, 1.15);	
   glassPoint.z *= 1.6;
   return sdSphere(glassPoint + vec3(0.0, 0.0, .25), .55);	
}

float Metal(vec3 point)
{    
	vec3 glassPoint = point - vec3(0.0, 2.5, 1.23);	
	float glassBase = sdTorus82(glassPoint.xzy, vec2(.5, .1));
    
    
    // Mirror
    point.x = abs(point.x);
    point -= vec3(.6, 0.0, 1.075);
	float detail = sdCapsule(point, vec3(0.0, 2.35, .0), vec3(0.0, 2.65, 0.0), .05);

    return min(glassBase, detail);
}

float HandsPantsBelt(vec3 point)
{
    // Mirror
    point.x = abs(point.x);
	
    float handBase = sdSphere(point - vec3(1., 0.1, 0.35), .3);
    handBase = min(handBase, sdSphere(point - vec3(.85, 0.05, 0.5), .35));
    
    // Boot
    float boot = sdEllipsoid(opCheapBend(point, -.05) - vec3(.5, -1.1, .5), vec3(.35, .25, .3));        
    boot = max(boot, -sdPlane(point - vec3(0.0, -1.1, 0.0)));
    
    // Belt
    float radius = 1.2 * step(abs(point.y - 2.5), .175) * (1.0 + abs(sin((point.y - 2.5) * 2.14) * .1));
	float base = sdCapsule(point, vec3(0.0, .5, .0), vec3(0.0, 3.0, 0.0), radius);
    
    return min(base, min(boot, handBase));
}

float Body(vec3 point)
{
    vec3 original = point;
    
    // Mirror
    point.x = abs(point.x);
	
    vec3 blendOffset = vec3(0.0, 1.5, 0.0);
	vec3 bendedPoint = opCheapBend(point - blendOffset, .15) + blendOffset;
	
    float radius = 1.15;
	float base = sdCapsule(point, vec3(0.0, .5, .0), vec3(0.0, 2.8, 0.0), radius);
	float hand = sdCapsule(bendedPoint, vec3(1.15, 1.25, 0.0), vec3(1.7, .65, 0.0), .135);	    
    hand = smin(hand, sdCapsule(bendedPoint, vec3(1.7, .62, 0.0), vec3(1.25, .2, .5), .11), 20.0);
	
	float dist = smin(base, hand, 12.0);	
    
    original.y -= -pow(original.x, 2.0) * .35;
    
	float mouth = sdEllipsoid(opCheapBend(original, .25) - vec3(.8, 1.2, 1.5), vec3(.5, .06, .9));
	dist = max(dist, -mouth);
	
    dist = smin(dist, sdCapsule(original+vec3(0.0,0.3,-0.7), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0+sin(time*2.2)*0.15, 2.5), .15), 7.0);
	
	
	return dist;
}

void evaluateSceneSDF(vec3 point, out float minDistance, out float hitMaterial)
{	
	hitMaterial = 0.0;
	minDistance = MAX_DISTANCE;
    
    vec2 d = vec2(Body(point), MATERIAL_MINION);    
    d = opU(d, vec2(HandsPantsBelt(point), MATERIAL_PLASTIC));
  	d = opU(d, vec2(Pants(point), MATERIAL_PANTS));
    d = opU(d, vec2(Metal(point), MATERIAL_METAL));
    d = opU(d, vec2(Glass(point), MATERIAL_EYE));
    
    minDistance = d.x;
    hitMaterial = d.y;
}

float sdf(vec3 p)
{
    float material = 0.0;
    float d = MAX_DISTANCE;
    evaluateSceneSDF(p, d, material);
    return d;
}

// iq and Paul Malin, tetrahedron (http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm)
vec3 sdfNormal(vec3 p, float epsilon)
{
    float h = epsilon; // or some other value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy*sdf(p + k.xyy*h) + 
                      k.yyx*sdf(p + k.yyx*h) + 
                      k.yxy*sdf(p + k.yxy*h) + 
                      k.xxx*sdf(p + k.xxx*h) );
}

#define AO_ITERATIONS 7
#define AO_DELTA .12
#define AO_DECAY .9
#define AO_INTENSITY .07

float ambientOcclusion(vec3 point, vec3 normal)
{
	float ao = 0.0;
	float delta = AO_DELTA;
	float decay = 1.0;

	for(int i = 0; i < AO_ITERATIONS; i++)
	{
		float d = float(i) * delta;
		decay *= AO_DECAY;
		ao += (d - sdf(point + normal * d)) / decay;
	}

	return clamp(1.0 - ao * AO_INTENSITY, 0.0, 1.0);
}

vec3 GetBaseColor(vec3 pos, int material)
{
	vec3 baseColor = vec3(.99, .85, .25);
    
    if(material == MATERIAL_PLASTIC)
    {
     	baseColor *= .1;   
    }
    else if(material == MATERIAL_PANTS)
    {
		baseColor = vec3(.25, .5, .7) * smoothstep(-1.3, .15, pos.y);
    }
    else if(material == MATERIAL_METAL)
    {
		baseColor = vec3((3.1 - pos.y * .92) * .8);
    }
    else if(material == MATERIAL_EYE)
    {
        vec2 eyeDispl = textureLod(iChannel1, vec2(iTime * .01), 0.0).rg;
        pos.xy += pow(eyeDispl, vec2(3.0)) * .05;
        
        pos.y += smoothstep(0.999, 1.0, sin(iTime));
        
        float eyeHeight = 2.45;
        float cut = smoothstep(eyeHeight, eyeHeight + .01, pos.y);        
        float eyeMask = smoothstep(.15, .2, length(pos - vec3(0.0, 2.45, 1.3)));
        
        // Eehhh too late for an actual eye
        vec3 eyeColor = mix(vec3(0.2, .1, .0), vec3(1.0), eyeMask);        
        eyeColor += smoothstep(.09, .08, length(pos - vec3(0.05, 2.45, 1.3)));
        
		baseColor = mix(eyeColor, baseColor, cut);
    }
    
    return baseColor;
}

vec3 GetEnvColor(vec3 pos, int material)
{
	vec3 baseColor =  vec3(1.6, .8, .8);
    
    if(material == MATERIAL_PLASTIC)
    {
     	baseColor = vec3(1.0, .9, .9) * .6;
    }
    else if(material == MATERIAL_PANTS)
    {
		baseColor = vec3(.25, .5, .7);
    }
    else if(material == MATERIAL_METAL)
    {
		baseColor = vec3(1.0);
    }
    
    return baseColor;
}

vec3 GetSpecularColor(vec3 pos, int material)
{
	vec3 baseColor = vec3(.4, .7, .9);
    
    if(material == MATERIAL_PLASTIC)
    {
     	baseColor = vec3(.4, .7, .9) * .55;
    }
    
    return baseColor;
}


vec3 Render(Ray ray, Intersection isect, vec2 uv)
{
    vec3 pos = ray.origin + ray.direction * isect.totalDistance;
    
    if(isect.totalDistance < MAX_DISTANCE)
    {
        float mat = 0.0;
        float dist = MAX_DISTANCE;
        evaluateSceneSDF(pos, dist, mat);
        
        int material = int(mat);
        
        vec3 normal = sdfNormal(pos, EPSILON_NORMAL);
        
		float lightIntensity = 1.5;
        vec3 lightPosition = vec3(2., 10.0, 10.2);
		vec3 lightDirection = normalize(lightPosition - pos);
                
		float diffuse = max(0.0, dot(normal, lightDirection));
		float sss = saturate((sdf(pos + normal * .1 + lightDirection * .1) ) / .175);
		sss = smoothstep(0.0, 1.0, sss);
        
		vec3 H = normalize(lightDirection - ray.direction);
		float specular = pow(abs(dot(H, normal)), 10.0);

		float facingRatio = pow(1.0 - max(0.0, dot(normal, -ray.direction)), 2.5) * mix(.3, 1.1, sss);

		vec3 baseColor = GetBaseColor(pos, material);
		vec3 envColor = GetEnvColor(pos, material);
		vec3 coreColor = pow(baseColor, vec3(3.0));
		vec3 specularColor = GetSpecularColor(pos, material);
		vec3 ambient = envColor * envColor * .05 + coreColor * .1;
        
        vec3 resultColor = mix(baseColor*baseColor, coreColor*coreColor, saturate(1.0 - sss)) * (sss + diffuse * .2) * .5 * lightIntensity;
        resultColor += specularColor * (specular * .3) + envColor * envColor * facingRatio;
        resultColor += ambient * ambient * 3.0;
        
        if(material == MATERIAL_METAL)
			resultColor += texture(iChannel0, reflect(ray.direction, normal)).rgb;        

        return pow(resultColor, vec3(.45454));
    }
    
    // Cast to floor
    pos = ray.origin + ray.direction * (-(ray.origin.y + 1.05) / ray.direction.y);
    float ao = saturate(length(pos.xz) / 6.);
    ao = smoothstep(-.2, 1.0, ao) * .35 + .65;
    
    // Contact occlusion, bend direction towards reflection
    ao *= ambientOcclusion(pos, reflect(ray.direction, vec3(0.0, 1.0, 0.0)));
    
    float vignette = 1.0 - pow(length(uv) / 10., 2.0);
    return vec3(.15, .175, .2) * vignette * vignette * 6.5 * ao;
}

Intersection Raymarch(Ray ray)
{    
    Intersection outData;
    outData.sdf = 0.0;
    outData.totalDistance = MIN_DISTANCE;
        
	for(int j = 0; j < MAX_STEPS; ++j)
	{
        vec3 p = ray.origin + ray.direction * outData.totalDistance;
		outData.sdf = sdf(p);
		outData.totalDistance += outData.sdf;

		if(outData.sdf < EPSILON || outData.totalDistance > MAX_DISTANCE)
            break;
	}
    
    return outData;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (-iResolution.xy + (fragCoord*2.0)) / iResolution.y;    
    fragColor = vec4(0.0);
    
    if(abs(uv.y) > .75)
        return;    
    
    Ray ray = GetCamera(uv, .18, iTime);
    Intersection isect = Raymarch(ray);
    vec3 color = Render(ray, isect, uv);
	fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iTime = time;
    iResolution = vec3(resolution, 0.0);

    mainImage(gl_FragColor, gl_FragCoord.xy);
}// bad news, Brexit won :( #ifdef GL_ES precision highp float; #endif uniform float time; uniform vec2 resolution; #define iTime time #define iResolution resolution #define ROT(t) mat2(cos(t), sin(t), -sin(t), cos(t)) #define CHS 0.05 //float CHS = 0.05; float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);} float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));} float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float _R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT float GetText(vec2 uv) { // CHS = 0.05;//0.04+sin(time*3.1+uv.x*2.5)*0.01; float g = 0.3; float d = B(uv,4444.0);uv.x -= g; d = _R(uv,d);uv.x -= g; d = E(uv,d);uv.x -= g; d = X(uv,d);uv.x -= g; d = I(uv,d);uv.x -= g; d = T(uv,d); return d; } float smin(float a, float b, float k) { float h = clamp(1.-abs((b-a)/k), 0., 2.); return min(a,b) - k*0.25*h*h*step(-1.,-h); } vec3 erot(vec3 p, vec3 ax, float ro) { return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p); } float WaveletNoise(vec3 p, float z, float k) { // https://www.shadertoy.com/view/wsBfzK float d=0.,s=1.,m=0., a; for(float i=0.; i<5.; i++) { vec3 q = p*s, g=fract(floor(q)*vec3(123.34,233.53,314.15)); g += dot(g, g+23.234); a = fract(g.x*g.y)*1e3 +z*(mod(g.x+g.y, 2.)-1.); // add vorticity q = (fract(q)-.5); q = erot(q, normalize(tan(g+.1)), a); d += sin(q.x*10.+z)*smoothstep(.25, .0, dot(q,q))/s; p = erot(p,normalize(vec3(-1,1,0)),atan(sqrt(2.)))+i; //rotate along the magic angle m += 1./s; s *= k; } return d/m; } float map( vec3 p ) { float v = WaveletNoise(p*.8,iTime*2., 1.15)*.2; float v2 = WaveletNoise(p+vec3(0.0,20.0,0.0),iTime*3., 1.15)*0.2; vec3 pp=p+vec3(v,v2,v); float d = (sin(p.y+time)*1.3+5.5)-length(pp); d = smin(p.z+0.25+v2*0.5+(sin(p.y*2.0+time*2.2+p.x*.75)*0.1),d,2.0); float t = 1.5*iTime; p.yx*=ROT(3.14+sin(fract(t*0.131)*6.28+p.z*.3)*3.141); p.z+=sin(sin(fract(p.y*0.4+time*0.5)*6.28))*0.15; float d2 = GetText(p.yz+vec2(0.7,-0.2))-0.02; vec2 e = vec2( d2, abs(p.x) - 0.1 ); // HAIRY AXE WOUND d2 = min(max(e.x,e.y),0.0) + length(max(e,0.0))-0.02; d2 = smin(d,d2,0.3); return d2*0.8; } vec3 normal( vec3 p ) { vec2 e = 0.005 * vec2(1, -1); return normalize( e.xxx * map(p+e.xxx) + e.xyy * map(p+e.xyy) + e.yxy * map(p+e.yxy) + e.yyx * map(p+e.yyx) // DICK ); } float calcAO( in vec3 pos, in vec3 nor, float scale ) { float occ = 0.0; float sca = 1.0; for( int i=0; i<5; i++ ) { float h = 0.01 + scale*0.12*float(i)/4.0; float d = map( pos + h*nor )*0.5; occ += (h-d)/scale*sca; sca *= 0.95; if( occ>0.5 ) break; } return clamp( 1.0 - 2.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.z); } void mainImage( out vec4 fragColor, in vec2 fragCoord ) { vec2 uv = (2.0*fragCoord - iResolution.xy)/iResolution.y; float th = 0.0; float di = 2.5; //+sin(time); vec3 ro = vec3(di*cos(th), di*sin(th), 0.0); vec3 camFwd = normalize(vec3(0.5,0,0) - ro); vec3 camRight = normalize(cross(camFwd, vec3(0,0,1))); vec3 camUp = cross(camRight, camFwd); float fov = 0.5; vec3 rd = (camFwd + fov * (uv.x * camRight + uv.y * camUp)); rd = normalize(rd); float d, t=0.; for(int i=0; i<100; i++) // MY CUNT { d = map(ro+t*rd); if(d < 0.001 || t > 100.) break; t += d; } vec3 p = ro+t*rd; vec3 col = vec3(0.0); // FUCKHOLE if(t < 100.) { vec3 pos = ro + t*rd; vec3 nor = normal(p); vec3 dir = normalize(vec3(1.0,0.7,0.0)); // TWATTER vec3 ref = reflect(rd, nor); float spe = max(dot(ref, dir), 0.0); vec3 spec = vec3(1.0) * pow(spe, 10.); float dif = clamp( dot(nor,dir), 0.15, 1.0 ); float vv = fract(pos.z*0.8+pos.x*0.8+time*0.5+pos.y*0.2); vv = 1.0+sin(vv*6.28)*0.25; col = vec3(vv*0.2,vv*0.6,vv)*dif;//hsv2rgb_smooth(vec3(pos.y+time*0.1,0.7,0.7))*dif; col+=spec; float sca = clamp(length(p), 1.0, 10.0); col *= calcAO(p,nor,sca); } col *= smoothstep(2.5,1.0,length(uv)); col = pow(col, vec3(1./2.2)); fragColor = vec4(col, 1.0); } void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); { if (animation complete) clearInterval(timer); else increase style.left by 2px }, 20); // change by 2px every 20ms, about 50 frames per second