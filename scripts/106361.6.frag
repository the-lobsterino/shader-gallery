#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 fakerot(float r) {
    return mat2(0.415, 0.7, -sin(r), cos(r));
}


void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = .5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(0);
	
	float xt = time*0.85;
	
    float t = fract(xt*0.1)*6.28;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
	
	uv.y += sin(uv.y*4.0+fract(xt*0.025)*6.28)*0.05;
	
    vec2 p = uv;
    float S = 22.;
    float a = 0.0;
    mat2 m = fakerot(4.95);
	

    for (float j = 0.; j < 5.; j++) {
        p *= m;
        n *= m*.665;
        q = p * S +  sin(t+uv.y*5.0) * 4. + (2.*j) - .95*n; // wtf???
        a += dot(cos(q)/S, vec2(.296));
        n -= sin(q*0.98);
        S *= 1.44;
    }

	
    col = vec3(1.95, 1.25, 0.9) * (a + .175) + 9.*a + a;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
}