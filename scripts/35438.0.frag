#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// testing clockwise and count clockwise triangle hit
// coded in 2 variants (which may be faster?)

float dir(vec2 a, vec2 b){
	return a.x * b.y - b.x * a.y; //cross product	
}

bool insideTri(vec2 p, vec2 a, vec2 b, vec2 c)
{
  bool b1 = dir(p-a, b-a) > 0.0;
  bool b2 = dir(p-b, c-b) > 0.0;
  bool b3 = dir(p-c, a-c) > 0.0;
  return b1 == b2 && b2==b3;
}

bool insideTri2(vec2 p, vec2 a, vec2 b, vec2 c)
{
  vec2 u = p-a;
  vec2 v = p-b;
  vec2 w = p-c;
  float r = dir(u, v);
  float s = dir(v, w);
  float t = dir(w, u);
  return ((r>=0.) && (s>=0.) && (t>=0.))
      || ((r<=0.) && (s<=0.) && (t<=0.));
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;

	float col = 0.0;
	vec2 pa = vec2( 0.1, 0.0);
	vec2 pc = vec2( 0.8, -0.6);
	vec2 pb = vec2( 0.3,  0.6);
	vec2 dr = vec2( 0.2, 0.0);
	if(insideTri2(p,pa,pb,pc)) col = 1.0;   //ccw
	pb.x = -pb.x; 
	pc.x = -pc.x; 
	if(insideTri2(p,-pa,pb,pc)) col = 0.5;  //cw

	gl_FragColor = vec4( vec3( col ) , 1.0 );
}