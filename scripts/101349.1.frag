#extension GL_OES_standard_derivatives : enable

precision mediump float;

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
 
	 float t = time*.1;
	float brightness = (sin(t*12.) +1.) *.1;
	float fluffi = (sin(t*2.) +1.) *.1 + 1.1; // change slowly!
	float detail = 9.;
	
	
	// Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(2);
   
    
    vec2 n = vec2(1);
    vec2 q = vec2(1);
    vec2 p = uv;
    float d = dot(p,p);
    float S = detail;
    float a = 0.05;
    mat2 m = rotate2D(2.2);

    for (float j = 0.; j < 11.; j++) {
        p *= m;
        n *= m;
        q = p * S + t * 4. + sin(t * 4. - d * 3.) * 2.09 + j + n; // wtf???
        a += dot(cos(q)/S, vec2(.2));
        n -= sin(q);
        S *= fluffi;
    }

       col = vec3(3, 1, 7) * (a  + brightness) + a + a ;
	 
	
	
	//col -=d; // vignette
    
    
    // Output to screen
    gl_FragColor = vec4(col,7.0);
}