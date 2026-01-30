#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    
    vec2 U = gl_FragCoord.xy;
    vec4 f = resolution.xyxy;
      f = length(U+=U-f.xy)/f+2.0;
      f = sin(f.w-.1) * vec4(sin(100./f + atan(U.x,U.y)*50. - time*999.0).w < 0.8);
      f = sin(f.w-.1) * 1.-vec4(sin(10.0/f + atan(U.x,U.y)*5. + time*999.5).w < 0.8);	

    gl_FragColor = vec4(0, f.x, 0, 5)*5.5;

	
}