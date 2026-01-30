/*
 * Original shader from: https://www.shadertoy.com/view/wsBfD3
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
/*	Motes
	2015-2020 stb (was BeyondTheStatic back then)
	Uses raycasting to step through cubic cells. Sprites are 2D and always exist inside a cell otherwise
	there would be clipping, or there would neighbors needing to be checked on (not always a bad thing).
	Traces forward from the camera and uses adaptive depth control for a speedup.
	For more info on adaptive depth control, see: http://povray.org/documentation/view/3.6.1/258/
*/

#define iGlobalTime iTime

const float ADC		= 0.03;	// adaptive depth control bailout	0.0 - 1.0
const float maxDist	= 20.;	// maximim draw distance			0.0 - ?.?

float rand(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 9.4821)))*43758.5453); }

vec3 rand3v(vec3 p) {
	mat3 m = mat3(15.2, 27.6, 35.7, 53.1, 75.8, 99.8, 153.2, 170.6, 233.7);
	return fract(sin(m * p) * 43648.23);
}

float s, c;
#define rotate(p, a) mat2(c=cos(a), s=-sin(a), -s, c) * p

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 res	= iResolution.xy;
    vec2 uv		= (fragCoord-.5*res) / res.y;
	vec2 mPos	= 3.5 * (iMouse.xy-.5*res) / res.y;
    
    mPos += vec2(.2*iTime, 5.+.073*iTime);
    
    vec3 camPos	= vec3(.0, .0, -15.);
    vec3 rayDir	= normalize(vec3(uv, .8));
    
    camPos.yz = rotate(camPos.yz, mPos.y);
    camPos.xz = rotate(camPos.xz, mPos.x);
    rayDir.yz = rotate(rayDir.yz, mPos.y);
    rayDir.xz = rotate(rayDir.xz, mPos.x);
    
    camPos.y += iGlobalTime;
    
    vec3 adj, xV, yV, zV, V_;
    vec3 po	= sign(rayDir);
    vec3 V	= camPos, LV;
    float dist;
    
    // light pos, background
    vec3 lPos	= normalize(vec3(.5, -1., .25));
    vec3 bg		= vec3(.1, .3, 1.) + .06*vec3(1.5, .875, .5)*pow(length(rayDir+lPos)/1., 4.);
    
    vec4 RGBA	= vec4(vec3(0.), 1.);
    
    // loop extents should accomodate maxDist
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
        if(rand(floor((V+LV)/2.))>.5){
            float pRad = .25*fract(3.141592*rand(floor((V+LV)/2.)));
            vec3 pOff = 10. * rand3v(floor((V+LV)/2.));
            pOff = -vec3(sin(iGlobalTime+pOff.x), cos(iGlobalTime+pOff.y), sin(iGlobalTime+pOff.z))*pRad;
            vec3 pVec = camPos + rayDir * length(floor((V+LV)/2.)+.5-camPos-pOff)+pOff;
            float circ = length( pVec-floor((V+LV)/2.)-.5 )+.5-pRad*1.25;
            float alph = float(clamp(smoothstep(0., 1., 2.-4.*circ), 0., 1.));
            
            // fake particle lighting
            //circ += length( pVec-floor((V+LV)/2.)-.5+.2*lPos )+.5-pRad*1.25; 
            circ += 2.*dot( pVec-floor((V+LV)/2.)-.5, lPos );
            
            vec3 vCol = (circ/1.+.3) * vec3(.8, 1., .6);
            RGBA.rgb +=
                	RGBA.a * alph
                	* mix(vCol, bg, dist/maxDist);
            RGBA.a *= 1.00001 - alph;
       	}
    }
    
    RGBA.rgb += bg * RGBA.a;
    
    
    fragColor = vec4(sqrt(RGBA.rgb), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
	iMouse = vec4(mouse * resolution, 1., 0.);
    	mainImage(gl_FragColor, gl_FragCoord.xy);
}