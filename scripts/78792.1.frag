/*
 * Original shader from: https://www.shadertoy.com/view/sl3Szf
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define r(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define T (iTime+step(40.,iTime)*11.)

void mainImage( out vec4 O, vec2 U ) {
    vec3 R = iResolution,                          //Setup camera
         ro = vec3(0,0,-2),                        //
         rd = normalize(vec3((2.*U-R.xy)/R.x,.8)); //
    ro.zx *= r(T*.0);                              //
    rd.zx *= r(T*.0);                              //
    float t=.0,f=1.,i=f,h=f;     //Setup variables
    vec3 c = vec3(0), p=c;       //
    mat2 r1 = r(.1+T*.03);       //
    for (int x=0;x<250;++x) {    //
        if (t>=3.) break;        //
        p = ro+rd*t;             //
        for (int i=0;i<20;i++) { //
            p = abs(p.yzx)*1.1-vec3(.044,0,.22); //Iterate point
            p.yz *= r1;                                 //
        }
        h = length(p-vec3(clamp(p.xy,-.2,.8),0.))*.14; //Find and step by distance
        i = max(h,.002)*f;                             //
        t += i;                                        //
        c += exp(2.-t*3.) * (cos(p.x*6.+vec3(9,4,5.3))*.5+.5) * max(0.,f-4e2*h) * i*20.2; //fog, colour, threshold, weight
        f*=1.005; //Accelerate ray
    }
    
    O = sqrt(c).rgbb; //Cheap gamma
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}