//  Modded by @DennisHjorth, I couldn't help myself but to make my own movements

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.8);
	
    fragCoord += vec2(3.0*cos(time*.2+sin(time*.1)),4.*sin(cos(time*.1)+time*.2));
	
    float t = cos(sin(time*.1)+time*.2)+(time)*0.3;
	
    fragCoord *= mat2(cos(t),sin(t),-sin(t),cos(t));
    
    for ( float i = 2.0; i< 32.0; i++) 
    {    
        vec2  pos = (fragCoord*i*0.75 - t - 2.5);
        vec2 check = vec2(mod(floor(pos.x)+floor(pos.y), 3.),.0);
	    
        if (check.x == 0.) 
	{
    	    fragColor = vec4(0.08 * i);
            break;
        }
    }
}

void main( void ) 
{
	mainImage(gl_FragColor,surfacePosition*3.0);
}