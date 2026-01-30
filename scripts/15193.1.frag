#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float rand(float n){
 return fract(sin(n) * 43758.5453);
}

float h(vec2 p) {
 return rand(rand(p.x)+rand(p.y)+rand(time));
}

void main( void ) {
 vec2 pos = gl_FragCoord.xy/resolution;
 bool right = false;
 if(pos.x > 0.5) {
  right = true;
  pos -= vec2(0.5,0);
 }
	
 bool self = false;
 int count = 0;
 
 for(int i=-1; i<2; i++)
	 for(int j=-1; j<2; j++) {
		 
	 }
 gl_FragColor = vec4(0);
}