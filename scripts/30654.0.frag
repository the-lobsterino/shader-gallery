// Glowing Line
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;


void main( void )
{     
	
  vec2 uv=gl_FragCoord.xy/resolution*2.0-1.0;
  uv.x*=resolution.x/resolution.y;	
  float p= abs(uv.y*300.0);
  
	
  vec3 color=vec3(1.0*p,1.0*p,1.0*p);
  gl_FragColor=vec4(color,1.0);
}