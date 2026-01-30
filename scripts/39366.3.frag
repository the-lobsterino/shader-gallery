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
	
    float t = (time)*0.1;
	
    fragCoord *= mat2(cos(t),sin(t),-sin(t),cos(t));
    
    for ( float i = 3.0; i< 11.0; i++) 
    {    
        vec2  pos = (fragCoord*i*0.5 - t - 2.5);
        vec2 check = vec2(mod(floor(pos.x)+floor(pos.y), 2.),.0);
	    
        if (check.x == 0.) 
	{
    	    fragColor = vec4(0.08 * i);
            break;
        }
    }
}

void main( void ) 
{
	mainImage(gl_FragColor,surfacePosition*3.0-mouse);
}