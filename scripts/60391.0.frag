#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

#define M_PI 3.1415926535897932384626433832795


uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
uniform float startRandom;

const float layers = 8.0;

const vec2 s = vec2(50.0, 9.0);

const float m = 5.0;
const float a = 2.5;
const float b = 1.2;
const float c = 1.4;

float f(float x) {
  float y = 0.0;
  for (float n = 1.0; n <= m; n += 1.0) {
    y += pow(n, -a) * sin(.225 * pow(n, b) / 7.0 * x - n * n * c);
  }
  return y;
}

void main( void ) {

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  uv -= vec2(0.6);
  uv *= s;

  vec3 c = vec3(0.0);
  if (startRandom > 1.9) c.g += 1.0;

  for (float j = 0.0; j < layers; j += 1.0) {
    float i = layers - j - 1.0;
    if (uv.y - 0.5 * 0.2 * (layers - i) -
      1.0 / layers * (i - layers / 2.0) * 5.0
        <
        f(5.0 * uv.x - (time+(100.0*startRandom)) * 50.0 *
          (2.0 * mod(j, 2.0) - 1.0) *
            (layers - i) - pow(i, 1.49)))
    {
	    float modOfLayer = mod(j, 7.0);
	    float r = 0.0;
	    float g = 0.0;
	    float b = 0.0;
	    if (modOfLayer == 0.0)  {
		    r = 1.0;
	    }
	    else if (modOfLayer == 1.0)  {
		    r = 1.0;
		    g = 0.5;
	    }
	    else if (modOfLayer == 2.0)  {
		    r = 1.0;
		    g = 1.0;
	    }
	    else if (modOfLayer == 3.0)  {
		    g = 1.0;
	    }
	    else if (modOfLayer == 4.0)  {
		    g = 0.5;
		    b = 0.5;
	    }
	    else if (modOfLayer == 5.0)  {
		    b = 1.0;
	    }
	    else if (modOfLayer == 6.0)  {
		    r = 1.0;
		    b = 1.0;
	    }
	    /*c = vec3(r / layers * i,
		     g / layers * i,
		     b / layers * i );*/
	    c = vec3(r * i , g * i, b * i);
	    //if (c.b < 0.2) c.b = 0.2;
    }

  }

  gl_FragColor = vec4(c, 1.0);

}