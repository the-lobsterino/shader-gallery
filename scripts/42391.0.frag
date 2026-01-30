#extension GL_OES_standard_derivatives : enable
    precision mediump float;
    uniform float     time;
    uniform vec2     resolution;

    const float position = 0.0;
    const float scale = 1.0;
    const float intensity = 1.0;

  float band(vec2 pos, float amplitude, float frequency) {
	float light = clamp(amplitude * frequency, 0.001 + 0.001 / scale, 5.0) * scale / abs(- pos.y);
	return light;
  }

  void main() {

  vec2 coord = gl_FragCoord.xy/resolution;
  coord *= 30.0;
  // Pick a coordinate to visualize in a grid

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord) - 0.5) / (fwidth(coord)/2.0);
  float line = min(grid.x, grid.y);
  vec3 color = vec3(1.5, 0.3, 10.0);
  float spectrum = 0.0;
  const float lim = 5.0;

  for(float i = 0.0; i < lim; i++){
      spectrum += band(coord, 1.0, clamp(sin(time)*2.0, 0.3, 5.0));
  }
  // Just visualize the grid lines directly
  gl_FragColor = vec4(color * spectrum, 1.0 - min(line, 1.0));
	    
	   
                
  }