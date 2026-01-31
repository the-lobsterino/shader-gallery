#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*

    Roaming inversion

    https://www.shadertoy.com/view/clyyRw
    
    2023 stb
    
    License: restricted to free use.

*/

const float Bright    = .05;            // brightness
const float Fog       = .03;            // fog thickness
const float	StepSize  = .3;             // size of ray marching steps
const float	RaySteps  = 24. / StepSize; // # of ray steps

#define res resolution.xy
#define m 4. * (mouse.xy-.5*res) / res.y

float s, c;
#define rotate(p, a) mat2(c=cos(a), s=-sin(a), -s, c) * p

float map(in vec3 p) {

    vec2 rot = vec2(cos(.1*time), sin(.0357*time));
    p.yz = rotate(p.yz, rot.y);
    p.xz = rotate(p.xz, rot.x);

    float k = length(p) < 1. ? dot(p, p) : 1.;
    
    p /= k * .77;
    
    p = mod(p+time*vec3(.3, .5, .85), 2.) - 1.;
    
    return
        min(
            min(
                length(p.xy),
                length(p.xz)
            ),
            length(p.yz)
        ) * k;
}

vec3 march(vec3 ray, vec3 dir) {
	float dist;
	vec3 col = vec3(.1, 0., .7); // initial color = sky
    float alph = 1.; // initial alpha value
    for(float i=0.; i<RaySteps; i++) {	
    
        // distance estimate at ray position
		dist = map(ray) * StepSize;
        
        // advance ray
        ray += dist * dir;
        
        // mix glowing lines with col
        col = mix(vec3(3., 2.5, 1.), col, alph);
        
        // substract from alpha
        alph = max(0., alph-Bright / (dist+Fog) / pow(RaySteps, 2.));
        
        // escape when alpha falls below a certain value
        if(alph<.9) break;
	}
    
    return col;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy-.5*res) / res.y;
    
    vec3 rayBeg	= vec3(0., 0., -4.);
    vec3 rayDir	= normalize(vec3(uv, 1.*2.));
    
    gl_FragColor = vec4(march(rayBeg, rayDir), 1.);
}