// See: https://www.shadertoy.com/view/flBSzw

precision mediump float;

uniform float time;
uniform vec2 resolution;

// Cole Peterson


#define R resolution.xy
#define ss(a, b, t) smoothstep(a, b, t)
#define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))

void main( void ) {
    float t = time*.25 - 1.5;
    
    vec2 uv = vec2(gl_FragCoord.xy - 0.5*R.xy)/R.y;
    uv += vec2(cos(t*.15)*1.8, sin(t*.1)*2.1 - .4);
    
   // if(iMouse.z > 0.)
     //   uv += m*5.;
    
    uv *= rot(3.1415/4.);
    uv = fract(uv * .35) - .5;
    uv = abs(uv);
    
    vec2 v = vec2(cos(.09), sin(.09));
    float dp = dot(uv, v);
    uv -= v*max(0., dp)*2.;
    
    float w = 0.;
    for(float i = 0.; i < 33.;i++){
        uv *= 1.23;
        uv = abs(uv);
    	uv -= 0.36;
    	uv -= v*min(0., dot(uv, v))*2.;
        uv.y += cos(uv.x*45.)*.007;
        w += dot(uv, uv) ;
    }
    
    w += sin(time * .15);
	
    float n = (w*12. + dp*15.);
    vec3 col = 1. - (.6 + .6*cos(vec3(.45, 0.6, .81) * n + vec3(-.6, .3, -.6)));
    
    col *= max(ss(.0, .11, abs(uv.y*.4)), .8);
    col = pow(col * 1.2, vec3(1.6));
    gl_FragColor = vec4(1.-exp(-col), 1.);

}