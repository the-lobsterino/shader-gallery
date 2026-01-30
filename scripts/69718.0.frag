
#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
uniform sampler2D backBuffer;
varying vec2 surfacePosition;
 
void main( void ) {
	
	vec4 o = texture2D(backBuffer,gl_FragCoord.xy/resolution);
 
	float t = mouse.y + mouse.x;//1.0;//time * 0.001;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * (50.0 / (sin(t)*10.0));
	
	//position.xy -= 25.0;
	
	float v = dot(surfacePosition,surfacePosition);
 
	float color = fract( cos((surfaceSize.x*surfaceSize.y)/v) + cos(position.x*position.y+v+t) );
	
	color = fract( abs(color) + color*2.0 - 1.0 + t);
 
	gl_FragColor = vec4( fract( o.xyz + (fract(vec3(color) - o.yzx) * 2.0 - 1.0) ), 1.0 );
 
}
