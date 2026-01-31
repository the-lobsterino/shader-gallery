#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.933))) * 43758.5453);
}

void main( void ) {

  vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 7.;
  position.x *= resolution.x / resolution.y;
  position *= 3.0;

  float color = 0.0;
  for(float i = 0.0; i < 50.0; i++)
  {
    vec2 randCoord = vec2(rand(vec2(i, i)), rand(vec2(i, i+10.0)));

    // Rotate randCoord in a 3D effect
    float radius = 1.0; // Adjust the radius as needed
    float angle = 2.0 * 3.14159 * (time + randCoord.y);
    randCoord.x = radius * cos(angle);
    randCoord.y = radius * sin(angle);

    // Apply 2D rotation matrix
    float theta = time;
    vec2 rotatedCoord;
    rotatedCoord.x = randCoord.x * cos(theta) - randCoord.y * sin(theta);
    rotatedCoord.y = randCoord.x * sin(theta) + randCoord.y * cos(theta);

    rotatedCoord = rotatedCoord * 2.0 - 1.0;
    color += 1.0 / distance(position, rotatedCoord) * 0.5;
  }
  color *= 0.02;
  color = pow(color, 0.7);
  gl_FragColor = vec4( vec3(color + rand(position) * (1.0 / 128.0)), 1.0);
  gl_FragColor = pow(gl_FragColor, vec4(1.5, 1.2,0.86, 1.0));
}