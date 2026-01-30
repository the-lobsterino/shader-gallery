#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

// extended from from "hypersapience", stb
// https://www.shadertoy.com/view/fdjyWK

#define iTime time
#define iResolution resolution


#define PI 3.14159

#define rotate(p, a) vec2(p.x*cos(a) - p.y*sin(a), p.x*sin(a) + p.y*cos(a))

vec2 c_inv(vec2 p, vec2 o, float r) {
    return (p-o) * r * r / dot(p-o, p-o) + o;
}

// hash without sine
// https://www.shadertoy.com/view/4djSRW
#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float grid(in vec2 p){ p = abs(fract(p+.5)-.5); return 2. * min(p.x, p.y); }

//void mainImage( out vec4 fo, in vec2 fc ) {
void main( void ) {
	vec2 res = iResolution.xy;
	vec2 fc = gl_FragCoord.xy;
	vec2 p = (fc-res/2.) / res.y;
	float f;
    
	// zoom
    p *= 1.7;
    
    float T = .35*iTime;
    
    // building face shape from summed-up circle inversions
    vec2 p_grp1, p_grp2, p_grp3 = vec2(0.);
    // upper lip
    const float I = 19.;
    for(float i=0.; i<I; i++)
        p_grp1 += c_inv(p, vec2(.35*(i-I/2.+.5)/I, -.4+.02*cos(4.*i/(I+1.)-PI/2.)), 8.*(.0625+.2*sin(8.*i/I+.3*T)));
    // lower lip
    const float I2 = 14.;
    for(float i=0.; i<I2; i++)
        p_grp2 += c_inv(p, vec2(.15*(i-I2/2.+.5)/I2, -.45-.01*cos(4.*i/(I2)-PI/2.)), .75);
    // sides, various
    const float I3 = 32.;
    for(float i=0.; i<I3; i++) {
        // sides
        float py_scale = .75+.125*cos(3.*i/I);
        p_grp3 -= c_inv(p, vec2(.53-.11*cos(8.*i/(I3)-2.52), -.275+py_scale*1.7*(i-I3/2.+.5)/I)+.021*cos(i+2.*T), 1.75-.007*pow(i-I3/2., 2.));
        p_grp3 -= c_inv(p, vec2(-.53+.11*cos(8.*i/(I3)-2.52), -.275+py_scale*1.7*(i-I3/2.+.5)/I)+.021*cos(i+2.*T), 1.75-.007*pow(i-I3/2., 2.));
        
        // ears
        p_grp3 -= c_inv(p, vec2(.65-.2*cos(2.5*i/(I3)+1.5), -.03+.5*(i-I3/2.+4.5)/I3)+.01*cos(.5*i+2.6*T), 1.75-.007*pow(i-I3/2., 2.));
        p_grp3 -= c_inv(p, vec2(-.65+.2*cos(2.5*i/(I3)+1.5), -.03+.5*(i-I3/2.+4.5)/I3)+.01*cos(.5*i+2.6*T), 1.75-.007*pow(i-I3/2., 2.));
        
        // temples
        p_grp3 -= c_inv(p, vec2(.75-.1*sin(2.5*i/(I3)+.5), .4+.75*(i-I/2.+4.5)/I3)+.01*cos(.35*i+1.6*T), 1.-.003*pow(i-I3/2., 2.));
        p_grp3 -= c_inv(p, vec2(-.75+.1*sin(2.5*i/(I3)+.5), .4+.75*(i-I/2.+4.5)/I3)+.01*cos(.35*i+1.6*T), 1.-.003*pow(i-I3/2., 2.));
        
        // chin
        p_grp3 += c_inv(p, vec2(.4*(i-I3/2.+.5)/I3, -.7-.03*cos(4.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));
	    
	// side chins
	p_grp3 -= c_inv(p, vec2(.37-.051*cos(8.*i/(I3)-2.52), -.5+.5*py_scale*(i-I3/2.+.5)/I)+.01*cos(i+2.*T), 1.75-.007*pow(i-I3/2., 2.));
	p_grp3 -= c_inv(p, vec2(-.37+.051*cos(8.*i/(I3)-2.52), -.5+.5*py_scale*(i-I3/2.+.5)/I)+.01*cos(i+2.*T), 1.75-.007*pow(i-I3/2., 2.));
        
	p_grp3 -= c_inv(p, vec2(.7*(i-I3/2.+.5)/I3-.33, .37+.02*cos(T)+.03*cos(4.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));
	p_grp3 -= c_inv(p, vec2(-.7*(i-I3/2.+.5)/I3+.33, .37+.02*cos(T)+.03*cos(4.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));
	    
        // top eyelids
        p_grp3 += c_inv(p, vec2(.5*(i-I3/2.+.5)/I3-.33, .27+.02*cos(T)+.03*cos(4.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));
        p_grp3 += c_inv(p, vec2(-.5*(i-I3/2.+.5)/I3+.33, .27+.02*sin(1.3723*T)+.03*cos(4.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));
	
	// bottom eyelids
	p_grp3 += c_inv(p, vec2(.35*(i-I3/2.+.5)/I3-.33, .17-.02*cos(T)-.03*cos(4.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));	    
	p_grp3 += c_inv(p, vec2(-.35*(i-I3/2.+.5)/I3+.33, .17-.02*cos(T)-.03*cos(5.*i/(I3+1.)-PI/1.7)), 1.-.005*pow(i-I3/2., 2.));	    
    }
        
    
    // everything is added together in a single statement
    p =
        (
            // eyes
            + c_inv(p, vec2(-.33, .2), 4.)
            + c_inv(p, vec2(.33, .2), 4.)
            
            //nose
            - c_inv(p, vec2(-.065, -.17), 1.7)
            - c_inv(p, vec2(.065, -.17), 1.7)
            
            // upper lip
            + p_grp1/2.
            
            // lower lip
            + p_grp2
            
            // side
            + p_grp3
        ) / 17.;
    
    // saving coords for later
    vec2 p2  = p;
    
    // translate grid
    p += (.5*T) * vec2(.13, 1.);
    
    // fractalize
    vec2 p3 = p;
    if(true) {
        for(float i=0.; i<14.; i++) {
            p3 += i * vec2(.1215, .12);
            p3 = rotate(p3, 1.+1.4*I+.1*sin(.05*T-.1));
            p3 = abs(mod(p3, 40.)-20.);
        }
    }
    
    // apply grid
	f = grid(p3);
    
    //trying make lines an even thickness (produces pixelization artifacts)
    float wd = length(vec2(dFdx(p.x), dFdx(p.y)));
    f /= wd * .015 * res.x;
    
    f = min(1., f+.73);
    
    // apply random cells
    f += .07 * (.5 - hash12(floor(p3)));
    
    vec3 RGB = vec3(f);
    
    // faux lighting
    f += 1.5*(.014 * length(p2+15.) - .85);
    //f += 1.5*(.014 * length(p2+30.*m) - .85);
    
    RGB += mix(vec3(.03, .3, .4), 2.9*vec3(1., .6, .2), f)-.7;    
    
	gl_FragColor = vec4(RGB, 1.);
}