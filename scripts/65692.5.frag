#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backgroundSurface;

vec4 EncodeFloatRGBA( float v ) {
  vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
  enc = fract(enc);
  enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);
  return enc;
}

float whathash (vec2 st,vec2 ss,vec2 m) {
	return cos(dot(st,st)*(ss.x*ss.y)*(cos(m.x*m.y)*2.0-1.0))*0.5+0.5;
}
	
void main( void ) {
	vec2 xy = surfacePosition;//(gl_FragCoord.xy / resolution);// * 2.0 - 1.0;
	float t = fract(time+xy.x*xy.y);
	float h = whathash(xy,surfaceSize,vec2(t,1.0-t));
	vec4 o = EncodeFloatRGBA(h);
	//o.xyz = fract(o.yzw+(1.0-o.x));
	gl_FragColor = o;//vec4(o.xyz,1.0);
}