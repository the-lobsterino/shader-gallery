#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float mandelbrot(vec2 c) {
  const int max_itr = 50;
  int _i 	    = max_itr;
  vec2 z    = vec2(0.0, 0.0);
  vec2 zn   = vec2(0.0, 0.0);
  vec2 zero = vec2(0.0, 0.0);

  for(int i = 0; i < max_itr; i++) {
    zn.x = z.x * z.x - z.y * z.y + c.x;
    zn.y = z.x * z.y * 2.0       + c.y;
    z = zn;

    if( distance(z, zero) > 2.0 ) {
      _i = i;
      break;
    }
  }

  return float(_i) / float(max_itr);
}

vec3 get_rgb(float n) {
  float _n = n*5.0;
	
  return n == 1.0 ? vec3(0.0) :
  	 n == 0.0 ? vec3(1.0) :
	 n  < 0.1 ? vec3(n, n/1.1, n/1.3) :
	 n  < 0.2 ? vec3(_n   , 0.0, 0.0) :
	 n  < 0.3 ? vec3(0.0,    _n, 0.0) :
	 n  < 0.4 ? vec3(0.0,   0.0,  _n) :
	 n  < 0.5 ? vec3(_n,     _n, 0.0) : 
	 n  < 0.6 ? vec3(0.0,    _n,  _n) :
	 n  < 0.7 ? vec3(0.5, _n, 0.0) :
		    vec3(n*1.0, n/1.1, n/1.3);
}

void main() {
  vec2 st  = gl_FragCoord.xy / resolution.xy;
  vec2 _st = st / 0.47;
  float test = (time / 20000.0);
  vec2 c   = vec2(_st.x - 1.5, _st.y - test);
  
  vec3 rgb = get_rgb(mandelbrot(c));
	
  gl_FragColor = vec4(rgb, 1.0);
}
