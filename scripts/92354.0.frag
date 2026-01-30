#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

  vec2 p = ( gl_FragCoord.xy / resolution.xy ) *2. - vec2(1,1);
	
  gl_FragColor = vec4(
   cos(5.14/20.*p.x)* .1/abs(p.y - .8*sin(3.28*(time+p.x))) * vec3(1, .1, .2), 
    1
  );

}
