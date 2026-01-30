#ifdef GL_ES
precision mediump float;
#endif

#define MAX_ITER 10

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
     
     vec2 v_texCoord = gl_FragCoord.xy / resolution;
     
     vec2 p =  v_texCoord * 10.0 - vec2(10.0);
     vec2 i = p;
     
     float c = 5.0;
     
     float inten = 0.1;

     for (int n = 0; n < MAX_ITER; n++) 
     {
          float t = (time/5.0) * (1.0 - (3.0 / float(n+1)));
          
          i = p + vec2(cos(t - i.x) + sin(t*2.0 + i.y),
                          sin(t - i.y) + cos(t + i.x));
                          
          c += 1.0/length(vec2(p.x / (sin(i.x + t)/inten),
                                    p.y / (cos(i.y+t)/inten)));
     }

     c /= float(MAX_ITER);
     c = 2.5 - sqrt(c);

     vec4 texColor = vec4( sin(i.x)/2.0, cos(i.x)/2.0, sin(i.y + p.y)/2.0, 1.0);
	
     //vec4 texColor = vec4(sin(time * p.x), cos(time), tan(0.30), 1.0);
     
     texColor.r *= pow((1.0 / (1.0 - (c*0.4 + 0.0))), 0.1);
     texColor.g *= pow((2.0 / (2.0 - (c*1.9 + 2.0))), 0.8);
     texColor.b *= pow((1.0 / (1.0 - (c*0.1 + 2.0))), 0.8);
     //texColor.rgb *= pow((1.0 / (1.0 - (c*1.0 + 0.0))), 0.8);
	
     
     gl_FragColor = 0.5 + texColor;
}  