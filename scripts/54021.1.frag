#ifdef GL_ES
precision highp float; 
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void )
{
	    float a = 12.0;
            if (a / 12. < 1.){
                gl_FragColor = vec4(1.,0.,0.,1.);
            }
	else {gl_FragColor = vec4(0.,1.,0.,1.);}
}