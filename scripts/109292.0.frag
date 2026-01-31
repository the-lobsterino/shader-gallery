// dogshit edits 4 u

#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 66.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}


float y(vec3 p) {	
  float d = 100.0;
  const float n = 30.0;
  for(float i=0.0; i<n; i++)
  {
    float t1 = i / n;
	  float v = (0.5*sin(time))*0.9;
	  
	  t1 += cos(v+time*0.74);
    float t = t1*t1;
    float r = 0.3 + 0.8 * ( t);
    float dd = length(p - vec3(0.0, r*cos(time+3.14*t), r*sin(time+3.14*t))) - 0.25 * t;
    d = opSmoothUnion(d,dd,0.04);
  }
  return d;
}

float dist(vec3 p) {	
  return min(y(p),y(vec3(1.0,-1.0,-1.0)*p));
}


void main( void ) {
	
float ss = 16.0*sin(time*0.9);
	vec2 gg = gl_FragCoord.xy;
	gg = ceil(gg / ss) * ss;	
  vec3 pos = vec3( 8.0, 0.0, 0.0); // Eye position
  vec3 lk  = vec3(-2.0, 0.0, 0.0); // Look direction   ( distance determines FOV )
  vec3 up  = vec3( 0.0, 0.0, 1.0); // Upward direction ( length determines the scale )
	
  vec2  uv = -1.0 + 2.0 * ( gg / resolution.xy );
  uv.y *= resolution.y/resolution.x;

  vec3 ray = pos;
  vec3 dir = normalize(lk + up*uv.y + cross(normalize(lk),up)*uv.x );
  float maxd = 10.0;
  float d = 0.0;
  for(int i = 0 ; i < 80; i++) {
      float d = dist(ray);
      if (abs(d) <.0001 || d > maxd) break;
      ray += dir * d * 0.99;
  }
  vec3 hit = ray;
	
  vec2 h   = vec2(0.001, 0.0);
  vec3 N   = normalize(vec3(
    dist(hit + h.xyy),
    dist(hit + h.yxy),
    dist(hit + h.yyx)) - dist(hit));

  vec3 light = normalize(vec3(1.0,0.5,0.7));
  float col = 0.0;
  if(d < maxd) col = pow(dot(N, light),1.0);
  gl_FragColor = vec4(col*1.3,col*0.7,col, 1);
}