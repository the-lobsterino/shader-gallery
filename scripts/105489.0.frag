#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
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
    vec3 col = vec3(0);
    float t = time*0.275;
	
    float dd = length(uv)+0.7;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = dot(p,p);
    float S = (dd-0.3)*5.0;
    float a = 0.0;
    mat2 m = rotate2D(dd*1.15);

    for (float j = 0.; j < 8.; j++) {
        p *= m;
        n *= m;
        q = p * S + t * 4. + sin(t * 1. - d * 8.) * .0018 + 3.*j - .95*n; // wtf???
        a += dot(cos(q)/S, vec2(.52));
        n += sin(q+(dd*12.6));
        S *= 1.225;
    }
	a=abs(a*2.0);
	
    col = vec3(1.2, 0.95, 0.7) * (a+0.4) - d;
    
    
    // Output to screen
    gl_FragColor = vec4(col*dd,1.0);
}
