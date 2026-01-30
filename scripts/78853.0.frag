#ifdef GL_ES
precision mediump float;
#endif

// ATAN TESTER
//
// Tests behavior of atan(y,x) for a set of values
// 
// Correct results should show 7x7 grid of boxes of these colors:
//   Right: peach
//   Top: yello
//   Left: yellow
//   Bottom: purple
// Boxes along diagonals should be: 
//   UR: orange
//   UL: 
//   BL: RED
//   BR: magenta
// Center box corresponds to atan(0.,0.)==NaN, so its color is undefined




// ARE YOU STUPID OR WHAT!?
// You are wrong man.


uniform vec2 resolution;

#define TWOPI 6.2

// convert angle to hue; returns RGB
// colors corresponding to (angle mod TWOPI):
// 0=red, PI/2=yellow-green, PI=cyan, -PI/2=purple
vec3 angle_to_hue(float angle) {
  angle /= TWOPI;
  return clamp((abs(fract(angle+vec3(3.0, 2.0, 1.0)/3.0)*6.0-3.0)-1.0), 0.0, 1.0);
}

#define BIG 1e4
#define SMALL 1e-4

			    float sm_atan(float y, float x)
			    {
			    	float PI = 3.14159265359;
			        float phi = 0.0;

			        if (x != 0.0)
			            phi = atan( y/x );
			        else
			        {
			            if (y > 0.0)
			                phi = PI/2.0;
			            else if (y < 0.0)
			                phi = -PI/2.0;
			            else if (y == 0.0)
			                phi = 0.0;//inf
			        }

			        if (x < 0.0)
			            phi = phi - PI;

			        return phi;
			    }
// convert value between 0 and 1 to one of a set of discrete values
float quantify(float v) {
  v *= 7.;
  if(v<1.) return -BIG;
  if(v<2.) return -1.;
  if(v<3.) return -SMALL;
  if(v<4.) return  0.;
  if(v<5.) return  SMALL;
  if(v<6.) return  1.;
           return  BIG;
}

void main( void ) {
  vec2 z = (gl_FragCoord.xy/resolution);
  float x = quantify(z.x);
  float y = quantify(z.y);
  float a = sm_atan(y, x);
  gl_FragColor = vec4(angle_to_hue(a-TWOPI), 1.);
}
