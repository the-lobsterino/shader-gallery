precision highp float;
uniform float time;
uniform vec2  resolution;

vec3 C1 = vec3(0.3,0.7,0.9);
vec3 C2 = vec3(0.9,0.3,0.6);
vec3 C3 = vec3(0.7,0.9,0.3);

float line( vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h );

    return pow(1.0-d,50.0);
}

float two(vec2 c, vec2 p) {
  float l1 = line(p, c-vec2(0.1,0.0), c+vec2(0.1,0.0));
  float l2 = line(p, c-vec2(0.1,0.2), c+vec2(0.1,-0.2));
  float l3 = line(p, c-vec2(0.1,-0.2), c+vec2(0.1,0.2));
  float l4 = line(p, c-vec2(0.1,0.2), c+vec2(-0.1,0.0));
  float l5 = line(p, c-vec2(-0.1,-0.2), c+vec2(0.1,0.0));
  return l1+l2+l3+l4+l5;
}

float zero(vec2 c, vec2 p) {
    float l1 = line(p, c-vec2(-0.1,0.2), c+vec2(0.1,0.2));
    float l2 = line(p, c-vec2(0.1,0.2), c+vec2(0.1,-0.2));
    float l3 = line(p, c-vec2(0.1,-0.2), c+vec2(0.1,0.2));
    float l4 = line(p, c-vec2(0.1,0.2), c+vec2(-0.1,0.2));
    return l1+l2+l3+l4;
}

float one(vec2 c, vec2 p) {
    return line(p, c-vec2(-0.1,0.2), c+vec2(0.1,0.2));
}

float nine(vec2 c, vec2 p) {
    float l1 = line(p, c-vec2(-0.1,0.2), c+vec2(0.1,0.2));
    float l2 = line(p, c-vec2(0.1,0.0), c+vec2(0.1,0.0));
    float l3 = line(p, c-vec2(0.1,-0.2), c+vec2(0.1,0.2));
    float l4 = line(p, c-vec2(0.1,0.0), c+vec2(-0.1,0.2));
    return l1+l2+l3+l4;
}

float M(vec2 c, vec2 p) {
	float h = 0.3305687/2.0;
	float w = 0.17654029/2.0;
	float mh = 0.48459715;
	float inw = 0.02251185;
	float inh = 0.186019-h;
	
	float l1 = line(p, c-vec2(w, h),c-vec2(w,-h));
	float l2 = line(p, c+vec2(w, h),c+vec2(w,-h));
	float l3 = line(p, c+vec2(-w,h), c+vec2(inw-w, h));
	float l4 = line(p, c+vec2(w,h), c+vec2(w-inw, h));
	float l5 = line(p, c+vec2(-inw/2.0,inh), c+vec2(inw-w, h));
	float l6 = line(p, c+vec2(inw/2.0,inh), c+vec2(w-inw, h));
	float l7 = line(p, c+vec2(-inw/2.0, inh), c+vec2(inw/2.0, inh));
	return l1+l2+l3+l4+l5+l6+l7;
}

void main() {
  float a = 2.0-length((gl_FragCoord.xy/resolution.xy)*2.0-1.0);
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  // uv.x *= resolution.x/resolution.y;
  vec2 st = uv*2.0-1.0;
  st *= 2.0;
  st.x *= resolution.x/resolution.y;
	float m = M(vec2(-0.8, 0.5), st);
  float t = two(vec2(-0.45,0.0), st);
  float z = zero(vec2(-0.15,0.0), st);
  float o = one(vec2(0.15,0.0), st);
  float n = nine(vec2(0.45, 0.0), st);

  float th = mod(time,3.0);
  vec3 COLOR = (th<1.0 ? th : 0.0)*C1 + (1.0<th&&th<2.0 ? th-1.0 : 0.0)*C2 + (2.0<th&&th<3.0 ? th-2.0 :0.0)*C3;
  gl_FragColor = vec4(COLOR*(m+t+z+o+n),1.0);
}
