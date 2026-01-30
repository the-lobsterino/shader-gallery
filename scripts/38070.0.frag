#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
void main()
{
vec2 g = gl_FragCoord.xy;
	
    vec4 f = vec4(.8,.2,.5,1);
    vec2 s = resolution.xy;
    
    vec2 n = vec2(100.,5.);
        n *= (mouse);
    
    n = max(n, vec2(0.01));
    
	vec4 h = texture2D(backbuffer, g / s * 0.995); // the magie is the 0.995 of s
   	
    g = (g+g-s)/s.y*n.y;
    
    vec2 k = vec2(1.6,0) + time,a;
    float m;
    
    
    for (float i=0.;i<100.;i++)
    {   
    	if ( i > n.x) break;
        a = g - sin(k + 6.28218/n.x*i);
        m += 0.01/dot(a,a);
    }
    
    gl_FragColor = m * 0.03 + h * 0.97 + step(h, f) * 0.01;
}