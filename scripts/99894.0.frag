#ifdef GL_ES
precision mediump float;
#endif

// ATAN TESTER
//
// Tests behavior of atan(y,x) for a set of values
// 
// Correct results should show 7x7 grid of boxes of these colors:
//   Right: red
//   Top: yellow
//   Left: cyan
//   Bottom: purple
// Boxes along diagonals should be: 
//   UR: orange
//   UL: green
//   BL: blue
//   BR: magenta
// Center box corresponds to atan(0.,0.)==NaN, so its color is undefined


uniform vec2 resolution;

#define TWOPI 6.28318530718

// convert angle to hue; returns RGB
// colors corresponding to (angle mod TWOPI):
// 0=red, PI/2=yellow-green, PI=cyan, -PI/2=purple
vec3 angle_to_hue(float angle) {
  angle /= TWOPI;
  return clamp((abs(fract(angle+vec3(3.0, 2.0, 1.0)/3.0)*6.0-3.0)-1.0), 0.0, 1.0);
}

#define BIG 1e4
#define SMALL 1e-4

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
  vec2 uv = (gl_FragCoord.xy/resolution.y);
	
	vec2 centered = uv - 0.5;

            float circlePoint = centered.x * centered.x + centered.y * centered.y;

            if (circlePoint > 0.25){
                discard;
            }

            if (circlePoint >= 0.25 - 0.02 && circlePoint <= 0.25){
                
                float angle = atan(centered.y, centered.x) + 3.14;
                //if(angle > 3.14) angle -= 1.0;
		    if(angle > 3.14) angle = 3.14-angle;
                vec3 blue = vec3(0.0,216.0,247.0)/255.0;

                gl_FragColor = vec4(mix(blue, vec3(1.0), angle / 3.14), 1.0);
               
                return;
            }
}
