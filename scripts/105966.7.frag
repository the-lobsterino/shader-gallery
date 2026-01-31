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
    float t = time;
    //vec2 umouse = (mouse / resolution) -3.5;
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
	//p.y += sin(t*0.3+p.x*.4)*1.1;
    float d = dot(p,p);
    float S = 3.25;
    float a = 0.2;
	   mat2 m = rotate2D(length(p)*.25+0.5);

    for (float j = 0.; j < 9.; j++) {
	    
        p *= m*1.05;
        n *= m*0.985;
        q = (p * S + t * 0.6 + sin(t * 0.25 - d * 4.0) * 4.0 + j + a - n);// wtf???
        a += dot(cos(q)/S, vec2(0.36));
        n -= sin(q);
        S *= 1.4 ;
	    m=m*1.065;
    }

   a=abs(a)+0.35;
  a = pow(a,3.);
    col = vec3(1., 1.5, .85) * a ;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
