//based on a great tutorial found at:
//https://inspirnathan.com/posts/47-shadertoy-tutorial-part-1

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iTime = time;
vec2 iResolution = resolution;

vec3 sdfCircle(vec2 uv, float r, vec2 offset) {
  float x = uv.x - offset.x;
  float y = uv.y - offset.y;
  float d = length(vec2(x, y)) - r;  
  return 
	d > 0. ? 
	  vec3(.0) : 
	  0.1 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
}

void main()
{
 
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord/iResolution.xy; // <0,1>
  vec2 uvstatic = fragCoord/iResolution.xy;
  uvstatic.x *= iResolution.x/iResolution.y;

  uvstatic.x += 1.0*iTime/40.0;
  uvstatic.y -= 1.0*iTime/20.0;
	
  uv.x -= 0.5+0.3*sin(iTime/3.);
  uv.y -= 0.5+0.2*cos(iTime/4.);
  uv.x *= iResolution.x/iResolution.y;
	
  vec2 offset = vec2(sin(iTime*2.)*0.2, cos(iTime*2.)*(0.0+.15*sin(iTime/5.)));
  vec3 col = sdfCircle(uv, .05+.01*sin(iTime/10.), offset);

  for (float counter = .25; counter < (.5); counter += 0.01) { 
    offset = vec2(sin(iTime*(1.+counter))*.2, cos(iTime*(1.+counter)) * (0.0+.15*sin(iTime/5.)));
    col += sdfCircle(uv, .05+.01*sin(iTime/10.), offset);	
  };
	  
  vec3 background = mod(floor(7.0*uvstatic.x) + floor(7.0*uvstatic.y),2.0) == 0.0 ? vec3(.2,.2,.2) : vec3(.7);

  col = background + col;
	
  // Output to screen
  gl_FragColor = vec4(col,1.0);
}
