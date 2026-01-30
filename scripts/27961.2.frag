#ifdef GL_ES
precision mediump float;
#endif

#define MAX_ITER 8

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 contColor(vec2 p, float nh3, float nmvoc, float noX)
{
     vec4 color = vec4(0,0,0,1);
     
     if(p.y < 1.0 - nh3)color = vec4(1,0,1,1);
     if(p.y < 1.0 - nmvoc)color = vec4(0,1,0,1);	
     if(p.y < 1.0 - noX)color = vec4(1,1,0,1);
	
     return color;	
}

void main( void )
{ 
     vec2 p = gl_FragCoord.xy / resolution;

     gl_FragColor = contColor(p, 0.3, 0.5, 0.7);
} 
 