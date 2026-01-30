// from: https://www.shadertoy.com/view/Wt2cW3

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// shadertoy code
/*
	Semitransparent Voxels
	2020 stb (2015 BeyondTheStatic)

	The renderer will stop tracing if RGBA.a < ADC. Set ADC to 0.0 to disable it. This
	implementation is imperfect, but still effective.
	
	The mouse controls the camera. Play with the three consts!

	Changes:
		- fixed fog blending
		- updated volumetric fog (add this between lines 82-83):
            else {
                float f = clamp(map(LV-.5+7.*lPos)*1., 0., 1.);
                vec3 vCol = f * vec3(.7, .8, 1.) * clamp(map(LV-.5+2.7*lPos)/3.+.5, 0., 1.); 
                float alph = .025;
                RGBA.rgb += RGBA.a * alph * vCol;
                RGBA.a *= 1.00001 - alph;
            }
*/
const float ADC		= 0.1;	// 0.0-1.0
const float alpha	= .3;	// 0.0-1.0
const float maxDist	= 80.;	// 0.0-?.?

float s, c;
#define rotate(p, a) mat2(c=cos(a), s=-sin(a), -s, c) * p

float map(in vec3 p) {
    float f;
    p.x += 10.*(.5-float(mod(p.z-0., 40.)<20.)) - 5.;
    p.xz = mod(p.xz, 20.)-10.;
    f = length(p)-8.;
    f = min(f, p.y+7.);
    return f;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 res	= iResolution.xy;
    vec2 uv		= (fragCoord-.5*res) / res.y;
	
    vec3 camPos	= vec3(.0, .0, -15.);
    vec3 rayDir	= normalize(vec3(uv, .5));
    
    vec2 nav = vec2(cos(.1*iTime)-.4, -.337*iTime);
    camPos.yz = rotate(camPos.yz, nav.x);
    camPos.xz = rotate(camPos.xz, nav.y);
    rayDir.yz = rotate(rayDir.yz, nav.x);
    rayDir.xz = rotate(rayDir.xz, nav.y);
    
    vec3 adj, xV, yV, zV, V_;
    vec3 po	= sign(rayDir);
    vec3 V	= camPos, LV;
    float dist;
    
    // light pos, background
    vec3 lPos	= normalize(vec3(.5, 1., .25));
    vec3 bg		= vec3(.3, .5, 1.) + pow(length(rayDir+lPos)/2.5, 2.);
    
    vec4 RGBA	= vec4(vec3(0.), 1.);
    
    for(int i=0; i<150; i++) {
        dist = length(V-camPos);
        
        LV = V;
        
        adj = mix(floor(V+po), ceil(V+po), .5-.5*po) - V;
        
        xV = adj.x * vec3(1., rayDir.yz/rayDir.x);
        yV = adj.y * vec3(rayDir.xz/rayDir.y, 1.);
        zV = adj.z * vec3(rayDir.xy/rayDir.z, 1.);

        V_ = vec3(length(xV)<length(yV) ? xV : yV.xzy);
    	V_ = vec3(length(V_)<length(zV) ? V_ : zV);
        
        V += V_;
        if(dist>maxDist || RGBA.a<ADC) break;
        if(map(floor((V+LV)/2.))<0.){
            vec3 vCol = vec3(.1, 1., .1) * clamp(map(LV-.5+2.7*lPos)/3.+.5, 0., 1.);
            RGBA.rgb += RGBA.a * alpha * mix(vCol, bg, dist/maxDist);
            RGBA.a *= 1.00001 - alpha;
        }
    }
    
    RGBA.rgb += bg * RGBA.a;
    
    fragColor = vec4(RGBA.rgb, 1.0);
}
// end shadertoy code

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}