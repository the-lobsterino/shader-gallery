#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// modified by @hintz

void main() 
{
    vec2 p =  gl_FragCoord.xy / resolution.xy ;
    vec3 col =vec3(0.0);
   
   for(float j = 0.0; j < 6.0; j++)
    {
        for(float i = 1.0; i < 64.0; i++)
	{
            p.x += 0.1 / (i + j) * sin(i * 4.00 * p.y + time * 2.19 + cos((0.8335 * time / (7.11 * i)) * i - j));
            p.y += 0.1 / (i + j) * cos(i * 8.00 * p.x + time * 1.32 + sin((time * 0.7713 / (6. * i)) * i + j));
        }
	    
        col[int(j)] = (cos(7.0*p.x*p.x) + sin(7.0*p.y*p.y)) ;
    }
	
    gl_FragColor = vec4(0.45 * col   + sin(0.5 ) , 1.0);
}