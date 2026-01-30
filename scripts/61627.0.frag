
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
  coord += 0.5;
	
  vec3 color = vec3(0.0);
  vec2 translate = vec2(-0.5, -0.5);
  coord += translate;

  for(int i = 0; i < 40; i++){
    float radius = 0.3+0.1*(sin(3.0*time));
    float rad = (radians(360.0 / 40.0) * float(i))+(time*3.14*2.0);
	float rad2 = (radians(360.0 / 40.0) * float(i))+(time*3.14*1.0);

    color += 0.003 / length(coord + vec2(radius * cos(rad), radius * sin(rad2)));
  }

  gl_FragColor = vec4(color, 1.0);
}