#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
#define time time-gl_FragCoord.y/100.-gl_FragCoord.x/(100.+sin(time+gl_FragCoord.y/150.)*5.)
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.8, 0.8, 1., 0.8);
    
    for ( float i = 3.0; i< 6.0; i++) 
    {    
        vec2  pos = (0.4*fragCoord.xy*i / resolution.y*10.5 - time);
        vec2 check = vec2(mod(floor((pos.y*5.)+sin(time+pos.x*2.)*(sin(time*4.)*40.)), 20.),.0);
        if (check.x == 0.) 
	{
    	    fragColor = vec4(0.18 * i, 0.18 * i, 0.18 * i + .3, 0.18 * i);
            break;
        }
    }
}

void main( void ) 
{
	mainImage(gl_FragColor,gl_FragCoord.xy);
}