#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// hash without sine
// https://www.shadertoy.com/view/4djSRW
#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
//#define MOD3 vec3(.1031, .11369, .13787) // int range
float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
/*float hash13(vec3 p3) {
	p3  = fract(p3 * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}*/

#define pi 3.14159265
#define tx(o) texture(iChannel0, uv-o)

#define T .4*time

float rStripes(vec2 p, vec2 o, float freq) {
    float ang = 2. * pi * hash12(floor(p)-o);
    vec2 dir = vec2(sin(ang), cos(ang));
    float f;
    
	f = .5 + .5 * cos(3.*T+freq*pi*dot(p, dir));
	//f = 2. * abs(fract(dot(freq*p, dir)+3.*T)-.5);
	//f = 4. * pow(abs(fract(dot(freq*p, dir)+.5*T)-.5), 2.);
	//f = fract(dot(freq*p, dir)+.5*T);
    
    return f;
}

float rStripesLin(vec2 p, float freq) {
    vec3 o = vec3(-1., 0., 1.); 
    return
        mix(
            mix(
                rStripes(p, o.zy, freq),
                rStripes(p, o.yy, freq),
                //fract(p.x)
                smoothstep(0., 1., fract(p.x))
            ),
            mix(
                rStripes(p, o.zx, freq),
                rStripes(p, o.yx, freq),
                //fract(p.x)
                smoothstep(0., 1., fract(p.x))
            ),
            //fract(p.y)
            smoothstep(0., 1., fract(p.y))
		);
}

void main( void ) {
	vec2 res = resolution.xy;
	vec2 p = (gl_FragCoord.xy-res/2.) / res.y;
	
	float f = rStripesLin(p*16., .25);
	//f = min(f, rStripesLin(p*16.+53.3845, .25));
    
    gl_FragColor = vec4(vec3(f), 1.);
}