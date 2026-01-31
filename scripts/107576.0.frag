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
 vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p *= rotate3d((time * 4.0) * PI);
    float t;
    //if (sin(time) == 10.0)
    //    t = 0.075 / abs(1.0 - length(p));
    //else
    t = 0.075 / abs(1.0/*sin(time)*/ - length(p));
    gl_FragColor = vec4(vec3(t)  * vec3(0.20*(sin(time)+3.0), p.y*0.8, 3.0), 1.0);
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = .5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(0);
    float t = time;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv*1.5;
    float d = 0.1;//dot(p,p);
    float S = 22.;
    float a = -0.005;
    mat2 m = rotate2D(5.);
 
    for (float j = 0.; j < 3.; j++) {
     m*=1.03;
        p *= m;
        n *= m;
        q = p * S + t * 4. + sin(t * 1. - d * 8.) * .0018 + 3.*j - .95*n; // wtf???
        a += dot(cos(q)/S, vec2(.2));
        n -= sin(q);
        S *= 1.4;
    }
 
    col = vec3(3.5, 2.4, 4.5) * (a + .182) + 9.*a + a + d;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
	}