precision mediump float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
  vec2 p = (gl_FragCoord.xy / resolution.xy);
  gl_FragColor = 
    vec4(
      vec3(
        cos(
          sin(
            pow(
              mix(
                sin(p.x * 100.0) 
                + cos(p.y * 100.0)
                , sin(p.x * 100.0)
                , 0.81
              )
              , time * 10.0
            )
          ) * 10.0)
      )
      , 1.0
    );
}