/*
 * Original shader from: https://www.shadertoy.com/view/WtsSzj
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
#define pow(a,b) pow(abs(a),(b))

const int ALIASING_STEPS = 1;

const int NB_PASSES = 5;
const int MARCHING_STEPS = 150;
const float MIN_DIST = 0.;
const float MAX_DIST = 40.;
const float EPSILON = 1e-3;

mat2 rot(float a) {
	return mat2(cos(a), sin(a), -sin(a), cos(a));
}

float sdSphere(vec3 p, float radius) {
	return length(p) - radius;
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
	return length(max(d, 0.)) + min(max(d.x, max(d.y, d.z)), 0.);
}

float sdPlane(vec3 p, vec4 n) {
  return dot(p,n.xyz) + n.w;
}

float sdRoundedCylinder(vec3 p, float ra, float rb, float h) {
    vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

vec2 vUnion(vec2 a, vec2 b) {
    return a.x < b.x ? a : b;
}

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

vec2 map(vec3 p) {
    vec2 d = vec2(sdPlane(p, vec4(0, 1, 0, 1.)), .1);
    
    //d = vUnion(d, vec2(sdSphere(p - vec3(4, 0., 1), 1.3), 2.27));
    float dist = sdSphere(p - vec3(-3, 2, 0), 2.);
    dist = opSmoothUnion(dist, sdSphere(p - vec3(3, 2, 0), 2.), 1.);
    dist = opSmoothUnion(dist, sdCapsule(p, vec3(2, 2, 0), vec3(-2, 2, 0), 1.), 1.);
    d = vUnion(d, vec2(dist, 2.27));
    
    //d = vUnion(d, vec2(sdRoundedCylinder(p - vec3(0, 1.1, 0), 1., .3, 1.7), 2.85));

	return d;
}

vec3 mapGradient(vec3 p) {
    vec2 e = vec2(EPSILON, 0.);
	return normalize(vec3(
		map(p + e.xyy).x - map(p - e.xyy).x,
		map(p + e.yxy).x - map(p - e.yxy).x,
        map(p + e.yyx).x - map(p - e.yyx).x
	));
}

vec2 rayProcess(vec3 camPos, vec3 rayDir, float start, float end) {
	float depth = start;
   	vec2 e = vec2(end, 0.);
	for(int i = 0; i < MARCHING_STEPS; ++i) {
		vec2 dist = map(camPos + depth * rayDir);
		if(abs(dist.x) < EPSILON) return vec2(depth, dist.y);
		depth += abs(dist.x);
		if(dist.x >= end) return e;
	}
	return e;
}

vec3 rayDirection(float camAngle, vec2 coord) {
	vec2 uv = (coord - .5) * iResolution.xy;
	float focalDist = iResolution.y / 2. / tan(radians(camAngle) / 2.);
	return normalize(vec3(uv, -focalDist));
}


float checkerboard(in vec3 p) {
    vec3 q = floor(p);
    return mod(q.x + q.z, 2.);              
}

// http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
    // bounding volume
    const float maxHei = 2.;
    float tp = (maxHei-ro.y)/rd.y; 
    if( tp>0.0 ) tmax = min( tmax, tp );

    float res = 1.0;
    float t = mint;
    for( int i=0; i<30; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( res<0.005 || t>tmax ) break;
    }
    return clamp( res + .4, 0.0, 1.0 );
}

vec3 palette(float t) {
	return vec3(.6, .5, .5) 
		+ .5 * cos(6.283185 * (-vec3(1., 1., .5) * t + vec3(.2, .15, -.1) - .2));
}

vec3 applyLight(vec3 p, vec3 rd, vec3 nor, float id) {
    vec3 col = vec3(0.);

    // material        
    vec3 mate = .7 * palette(fract(id));
    if(id < 1.) {
        float f = checkerboard(p);
        mate = 0.2 + f*vec3(0.08);
    }

    // key light
    vec3  lig = normalize(vec3(-8., 8., 5.));
    vec3  hal = normalize( lig-rd );
    float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
    float spe = pow(dot( nor, hal ), 100.0);
    dif *= calcSoftshadow(p, lig, .1, 3.);

    col = mate * 3.*dif*vec3(.80,0.70,0.6);
    col +=      .6*spe*vec3(1.00,0.70,0.5);

    // ambient light
    float amb = .6;
    col += mate*amb;
    
	return col;
}

vec3 refract2(vec3 i, vec3 n, float eta) {
    if(dot(i, n) < 0.) eta = 1. / eta;
    else n = -n;
    return refract(i, n, eta);
}


vec3 shadingReflection(vec3 ro, vec3 rd, int nStep) {
    vec3 p = ro + rd * 1e-2;
    float alpha = 1.;
    vec2 d = rayProcess(p, rd, MIN_DIST, MAX_DIST);
    p += d.x * rd;
    vec3 nor = mapGradient(p);

    vec3 col = applyLight(p, rd, nor, d.y);
    col *= pow(smoothstep(MAX_DIST, 10., d.x), 2.); // fog

    if(d.y < 1.) {
        float kr = pow(1. - abs(dot(nor,-rd)), 5.) + .03;
        col = col * alpha * (1. - kr);
    }
    
	return col;
}


vec3 shading(vec3 ro, vec3 rd) {
    vec3 resCol = vec3(0);
    vec3 p = ro;
    float alpha = 1.;
    for(int i = NB_PASSES; i > 0; --i) {
        vec2 d = rayProcess(p, rd, MIN_DIST, MAX_DIST);
    	p += d.x * rd;
    	vec3 nor = mapGradient(p);
        
    	vec3 col = applyLight(p, rd, nor, d.y);
        col *= pow(smoothstep(MAX_DIST, 10., d.x), 2.); // fog
        
        if(d.y < 2.) {
       		float kr = pow(1. - abs(dot(nor,-rd)), 5.) + .03;
        	resCol += col * alpha * (1. - kr);
       		alpha *= kr;
            break;
        }
        else {
       		float kr = .1 + pow(1. - abs(dot(nor,-rd)), 5.);
            resCol += shadingReflection(p, reflect(rd, nor), i-1) * alpha * kr;
            
            rd = refract2(rd, nor, 1.15);
        	p += rd * 1e-2; // small incr to avoid null dist
            
            // ############ transparency formula ###############
            float depth = rayProcess(p, rd, MIN_DIST, MAX_DIST).x;
            float transparency = 1. - exp(-5e-2 * pow(depth, 2.));
            resCol += col * alpha * transparency;
            
           	alpha *= (1. - kr) * (1. - transparency);
        }
        
    }
    
	return resCol;
}




void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 tot = vec3(0.);
    
    for(int i = 0; i < ALIASING_STEPS; ++i) {
        for(int j = 0; j < ALIASING_STEPS; ++j) {
            vec2 offset = vec2(i, j) / 2. - .5;
            vec3 camPos = vec3(0., 6., 10.);
            vec3 rd = rayDirection(50., (fragCoord + offset) / iResolution.xy);
            
            float yaw = .5 * iTime;
            float pitch = .2 + .3 *sin(.3 * iTime);
            
            if(iMouse.z > 0.) {
                vec2 ang = iMouse.xy / iResolution.xy;
                yaw = 7. * ang.x;
                pitch = 1.5 * ang.y - .5;
            }
            
            
            camPos.yz *= rot(pitch);
            camPos.zx *= rot(yaw);
            rd.yz *= rot(.5 + pitch);
            rd.zx *= rot(yaw);
            //rd.yz *= rot(pitch);

            vec3 col = vec3(0.);
            col = shading(camPos, rd);
            
            // gamma
            tot += pow(col, vec3(1. / 1.7));
        }
    }
    
    tot /= float(ALIASING_STEPS * ALIASING_STEPS);
    
#if 0
	vec2 uv = fragCoord/iResolution.yy;
    float x = fragCoord.x / iResolution.x;
	tot = mix(tot, palette(x), step(abs(uv.y - .03), .02));
#endif
	fragColor = vec4(tot, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}