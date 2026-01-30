
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
      float t = time/10.;
      vec2 p = (( vec2(gl_FragCoord.x,gl_FragCoord.y) / resolution.x ) - vec2(.5,.5 * (resolution.y/resolution.x)) ) * 5.*mouse;
      float r = .3;
      float c = .1;
      vec4 color;
	if(length(vec2(p.x,p.y))> r * abs(sin(p.y*time))*5.  ) {
         gl_FragColor = vec4(p.x* p.y*sin(time)*10.,.5,.5,.5 );
 	} else if(abs(p.y - sin(p.x*4.)/2.) < .5 ) {
	  gl_FragColor = vec4(-p.x* p.y*cos(time*p.y)*2.,.5,.5,.5 );       
	} else if(abs(p.y - sin(p.x*2.)/2.) < .5 ) {
	  gl_FragColor = vec4(-p.x*tan(time*p.x)*2.,.5,.5,.5 );       
	} else if(abs(p.y - sin(p.x*2.)/2.) < .8 ) {
	  gl_FragColor = vec4(-p.x*sin(time*p.y/2.)*2.,.5,.5,.5 );       
	}
	else {
         gl_FragColor = vec4( -p.y*.4,0.5,0.5,0.0 );
	}
    
}
