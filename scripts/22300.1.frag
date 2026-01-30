//copypasta = cc0

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform sampler2D backbuffer;
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 
  float theta = time*3.75;
  vec2 ballPos = vec2(cos(theta), sin(theta))*0.5;
  vec2 texPos = vec2(gl_FragCoord.xy/resolution);
  vec2 texDelta = vec2(1.0/resolution);
 
  if(distance(pos, ballPos) < 0.13)
  {
    gl_FragColor = vec4(1.0);
  }else
  {
    //gl_FragColor =
    //texture2D(backbuffer, texPos+vec2(0.0, -texDelta.y))*0.33+
    //texture2D(backbuffer, texPos+vec2(texDelta.x, -texDelta.y))*0.33+
    //texture2D(backbuffer, texPos+vec2(-texDelta.x, -texDelta.y))*0.33;
	  vec2 position = texPos;
	  vec2 pixel = 1./resolution;
	  #define ppixels backbuffer
	  float sum = 0.;
		sum += texture2D(ppixels, position + pixel * vec2(-1., -1.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(-1., 0.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(-1., 1.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(1., -1.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(1., 0.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(1., 1.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(0., -1.)).g;
		sum += texture2D(ppixels, position + pixel * vec2(0., 1.)).g;
		vec4 me = texture2D(ppixels, position);
		gl_FragColor = vec4(sum)*0.12223;
  }
}
