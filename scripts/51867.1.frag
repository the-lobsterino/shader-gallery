precision mediump float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
  float lineWidth = 3.0;
  float frame = time * 60.0;
  float innerCircle = resolution.y / 5.0;
  vec2 p = (gl_FragCoord.xy - (resolution / 2.));
  float dist = (p.x + p.y) / 2.0;
  dist += mix(frame, -frame, step(innerCircle, length(p)));
  gl_FragColor = mix(vec4(0), vec4(1), mod(floor(dist / lineWidth), 2.0)); 		
}