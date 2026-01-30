#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// http://stackoverflow.com/a/10625698
float random(vec2 p)
{
  // We need irrationals for pseudo randomness.
  // Most (all?) known transcendental numbers will (generally) work
  const vec2 r = vec2(
    23.1406926327792690,  // e^pi (Gelfond's constant)
     2.6651441426902251); // 2^sqrt(2) (Gelfond–Schneider constant)
  return fract( cos( mod(123456789., 1e-7 + 256. * dot(p,r) ) ) );  
}

void main( void ) {
    	float x = sin(gl_FragCoord.x + time);
    	float y = cos(gl_FragCoord.y + time);

	vec2 seed = vec2(x,y);
	float color = random(seed);
	
	gl_FragColor = vec4( color, color, color, 1.0 );
}