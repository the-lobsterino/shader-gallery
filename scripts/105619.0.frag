#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 rotate2D(float r) {
    return mat2(tan(r), cos(r), -sin(r), cos(r));
}

// based on the follow tweet:
// https://twitter.com/zozuar/status/1621229990267310081
void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(0);
    float t = time;
	
	uv *= rotate2D(1.1/length(uv*.5)+t*-11.075);    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = dot(p,p);
    float S = 6.;
    float a = 0.0;
	   mat2 m = rotate2D(0.5);

    for (float j = 0.; j < 12.; j++) {
	    
        p *= m;
        n *= m;
        q = p * S + t * 0.25 + sin(t * 0.25 - d * 4.0) * 4.0 + j + a - n; // wtf???
        a += dot(cos(q)/S, vec2(0.4));
        n -= sin(q+q*0.2);
        S *= 1.4;
	    m=m*1.04;
    }

    col = vec3(2.3, 3.8, 4.8) * ((a*1.0)+.1 ) + a + a - d;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
