
// Necip's transfer from https://www.youtube.com/watch?v=9oYssHkOn0I
// More examples: https://github.com/lewislepton/shadertutorialseries


#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform vec2 u_resolution;
uniform float time;

void main(){
  vec2 coord = surfacePosition;
  coord += 0.45;
	
  vec3 color = vec3(0.10);
  vec2 translate = vec2(-0.5, -0.5);
  coord += translate;

  for(int i = 0; i < 90; i++){
    float radius = 0.8+0.2*(sin(1.9*time));
    float rad = (radians(360.0 / 67.0) * float(i))+(time*3.14*1.0);
	float rad2 = (radians(190.0 / 90.0) * float(i))+(time*3.14*1.0);

    color += 0.002 / length(coord + vec2(radius * sin(rad), radius * sin(rad2)));
  }

  gl_FragColor = vec4(color, 2.0);
}