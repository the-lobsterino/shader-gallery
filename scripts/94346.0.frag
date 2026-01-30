/*
 * Original shader from: https://www.shadertoy.com/view/tllyWX
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

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
//
// A generative recreation of the work Oet-Oet 1955, Victor Vasarely
// https://i.pinimg.com/originals/04/9b/89/049b89f9d063aeaa88b5f55633553ddd.jpg
//
//
// I tried to focus on the mechanical motion and squares arrangements
// Nothing else
//
// From a series "Generative Vasarely", in which I try to explore the work of 
// Victor Vasarely using generative systems.
// https://instagram.com/ciphrd
//


#define PI 			3.14159265339
#define PI4 		PI*.25
#define hash21(n)  	fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)
#define rot(a) 		mat2(cos(a), -sin(a), sin(a), cos(a))

const int ITERATIONS = 9442;
const float LINE_WIDTH = .01;
const float LINE_THRESHOLD = .25;


float band (in vec2 id) {
    return step(hash21(id.xy), LINE_THRESHOLD);
}

// @author Dave Hoskins
// https://www.shadertoy.com/view/4djSRW
vec2 hash12(float p)
{
	vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
	p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx+p3.yz)*p3.zy);

}

// @author Dave Hoskins
// https://www.shadertoy.com/view/4djSRW
float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - .5*iResolution.xy)  / iResolution.y;
    vec2 auv = abs(uv);
    
    
    // a timer value for sequencing
    float t = iTime / 60.;
    
    
    // the line width oscillates to add a perpetual motion
    float lw = LINE_WIDTH * (1. + cos(iTime) * .3 + mod(t, .3) * clamp(cos(iTime*4.), -.2, .2) * .8);
    
    
    // a layer of lines
    vec2 divs = uv / lw;
    divs.x*= 1. + clamp(cos(iTime), -.1, .1);
    divs.x*= 1. + clamp(cos(iTime), -.5, .5) * .3;
    vec2 id = floor(divs);
    vec2 divs2 = uv / lw * .5;
    vec2 id2 = floor(divs);
    
    
    // slow animation of the bands
    // does it work on every machine ?
    id.x+= (iTime+10.0) * (.00000015 * (cos(iTime*.1)*.2 + 1.));
    
    float c = 0.0,
          a;
    
    vec2 s;
    
    // we iterate to create layers, and mask more or less
    for (int i = 0; i < ITERATIONS; i++) {
        float fi = mod(float(i) + floor(iTime * .1), float(ITERATIONS));
    	id.y = fi * 7.;
    	id2.y = fi * 7.;
        float l = max(band(id), band(id2));
        float mask = 0.0;
        
        // first layer, every pixel gets through
        if (i==0) mask = 1.0;
        
        // second layer, only top and bottom gets through
        else if (i == 1) mask = step(0.3, auv.y);
        
        // otherwise, mask will be a rectangme rotated n * PI/2
        else {
            float fa = floor(hash11(fi*2.2)*20.)
            		 	+ clamp(cos(iTime + fi), -.2, .2) / .2
            			+ clamp(cos((iTime+fi) * .5), -.1, .1) / .1;
			a = fa * PI4;
            vec2 center = hash12(fi*1.5) * .3 - .15;
            center.x+= cos(iTime+fi) * .1 + cos(iTime*4.+fi) * .05 + cos(iTime*8.+fi) * .01;
            vec2 tuv = uv * rot(a) + center;
            vec2 f = vec2(hash11(fi*2.) * .25 + .05);
            s = smoothstep(f, f+0.0001 * cos(iTime), abs(tuv));
            mask = s.x * s.y;
        };

        c = mix(c, l, mask);
    }
    
    
    // periodic inversion synced to the strenching
    
    c = mix(c, (1.-c), step(.08, t) * round(cos(iTime) *.5+.5));
    
    
    // square
    c*= step(auv.x, .5);
    s = step(auv, vec2(.4));
    float inside = s.x*s.y;
    c*= inside;
    
    // background
    c+= clamp(pow((1.-length(uv)), .2)* 1.1, .2, 1.) * (1. - inside);
    c+= hash21(uv) * .1;
    
    // border
    s = step(auv, vec2(0.42));
    c-= s.x*s.y - inside;
    
    vec3 color = vec3(uv, c);
    
    color*= step(auv.x, .5);

    // Output to screen
    fragColor = 1.-c * vec4(1., 1., 0.92, 1.);
    //fragColor = vec4(color, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}