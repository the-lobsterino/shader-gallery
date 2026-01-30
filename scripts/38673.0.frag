// WarpingHexagons, WIP. @psonice_cw
// I'm sure there's a less fugly way of making a hexagonal grid, but hey :)
// Maybe you can simplify this!
// rearranged for easy use by I.G.P.

#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
 
#define hexaGridSize 55.0
#define thicknessMin 0.1
#define thicknessMax 0.105
#define color1 vec3(0.7, 0.2, 0.2)
#define color2 vec3(0.0, 0.0, 0.0)

 
// return 1.0 for hexagonal grid
float hexagonTiling (in vec2 position         
	            ,in float gridSize
	            ,in float gridThickness) 
{
  vec2 pos = position / gridSize; 
  pos.x *= 0.57735 * 2.0;
  pos.y += mod(floor(pos.x), 2.0)*0.5;
  pos = abs((mod(pos, 1.0) - 0.5));
  float d = abs(max(pos.x*0.5 + pos.y, pos.y*1.0) - 0.5);
  return smoothstep(0.0, gridThickness, d);
}

void main(void) 
{
  vec2 pos = gl_FragCoord.xy;

  // rotate and scale position
  float cost = cos(time*0.12);      // rotate
  float sint = sin(time*0.12);
  //pos = vec2(cost*pos.x + sint*pos.y, sint*pos.x - cost*pos.y);
 // pos *= (1.2+0.3*sin(0.5*time));   // scale
	
  float thickness = thicknessMin + (thicknessMax - thicknessMin) ;

  float k = hexagonTiling(pos, hexaGridSize, thickness);
	 
  vec3 color = mix(color1,color2,k);
  gl_FragColor = vec4(color, 1.0);
}