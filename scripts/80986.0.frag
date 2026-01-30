#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    
    vec2 U = gl_FragCoord.xy;
    vec4 f = resolution.xyxy;
      f = length(U+=U-f.xy)/f+.1230;
      f = sin(f.w-.21) * vec4(sin(1300./f + atan(U.x,U.y)*530. - time*1115.0).w < 0.);
      f = sin(f.w-.12) * 1.-vec4(sin(011.0/f + atan(U.x,U.y)*51. + time*71.5).w < 0.8);	

    gl_FragColor = vec4(0, f.x, 0, 1)*24.3;

	
}