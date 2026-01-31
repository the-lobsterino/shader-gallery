#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;


mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// based on the follow tweet:
// https://twitter.com/zozuar/status/1621229990267310081
void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    float t = time;
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float S = 8.;
    float a = 0.035;
	   mat2 m = rotate2D(p.x*0.1+length(p)*0.2+0.5);

    for (float j = 0.; j < 6.; j++) {
	    
        p *= m*0.875;
        n *= m;
        q = (p * S + t * 0.6 + sin(t * 0.25) * 4.0 + j + a - n);// wtf???
        a += dot(cos(q)/S, vec2(0.55));
        n -= sin(q.yx);
        S *= 1.3 ;
	    m=m*1.05;
    }

    vec3 col = vec3(.95, .95, 1.125) * (((a*2.7)+0.15 ) + a );
	col*=.85;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
