#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main()
{
    float 
        t = time,
        p;
    
    vec2 
	g = gl_FragCoord.xy,
        s = resolution.xy,
        u = (g+g-s)/s.y,
        ar = vec2(
            atan(u.x, u.y) * 3.18 + t*2., 
            length(u)*3. + fract(t*.5)*4.);
    
    p = floor(ar.y)/5.;
	
    ar = abs(fract(ar)-.5);
	
    gl_FragColor = 
        mix(
            vec4(1,.3,0,1), 
            vec4(.3,.2,.5,1), 
            vec4(fract((p)))) 
        * .1/dot(ar,ar) * .1 
        + texture2D(backbuffer, g / s) * .9;
    gl_FragColor.a = 1.;
}