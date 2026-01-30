#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// based on the follow tweet:
// https://twitter.com/zozuar/status/90

void main()
{
    vec2 coords = gl_FragCoord.xy - ( vec2(-0.5+mouse.x,mouse.y-0.5)) * resolution;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (coords-.5*resolution.xy)/resolution.y * abs(1.5+sin(time*0.0666));
    float t = time*0.25;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = 0.2;
    float S = 10.+sin(t/3.);
    float a = clamp(sin(t)-.8,0.,.2);
	float b = 0.0;
	float c = 0.0;
    mat2 m = rotate2D(cos(time*0.002));

    for (float j = 0.; j < 20.; j++) {
        p *= m;
        n *= m;
        q = p * S + t + n; // wtf???
        a += dot(sin(q)/S, vec2(1.0));
	 b += dot(cos(q)/S, vec2(0.0));
	    c += dot(sin(q+1.5)/S, vec2(1.0));
        n -= cos(q);
        S *= 1.2;
    }

    vec3 col = vec3(a*1.5,b,c);//5, 3, 1) * (a + .2) + a + a - d;
    
    
    // Output to screen
    gl_FragColor = vec4(col.r*col.r,col.r,col.b+col.r, 1);
}