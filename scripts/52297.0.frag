// co3moz - mandelbrot
precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

#define ITERATION 640
float cave(vec2 p)
{
	float r=length(p+vec2(1.0,0.0));
	return smoothstep(0.01,0.0,abs(r-0.25));	
}
float cave2(vec2 p)
{
	p.x+=-0.25;
	float r=length(p);
	return smoothstep(0.01,0.0,abs(r-r*r/.5-p.x));
}
float cave3(vec2 p)
{
	float r=length(p+vec2(1.0+0.25+0.25/4.2,0.0));
	return smoothstep(0.002,0.0,abs(r-0.25/4.2));
}
float cave4(vec2 p)
{
	vec2 ctr=vec2(-0.125,0.7445);
	float r=0.095;
	return smoothstep(0.0003,0.0,abs(length(p-ctr)-r));	
}
vec3 mandelbrot(vec2 p) {
  vec2 s = p;
  float d = 0.0, l;
	
  for (int i = 0; i < ITERATION; i++) {
    s = vec2(s.x * s.x - s.y * s.y + p.x, 2.0 * s.x * s.y + p.y);
    l = length(s);
    d += l + 0.2;
    if (l > 2.0) return vec3(sin(d * 0.0314), sin(d * 0.02), sin(d * 0.01));
  }
	
  return vec3(0.0);
}

float pi=atan(1.0)*4.0;
  float ang=mod(time*0.1,8.0*pi);
  float t=cos(ang),r=0.5*(1.-t);
  
  vec2 c1=vec2((r+0.0005)*t+0.25,(r+0.0005)*sin(ang));
  vec2 c2=vec2(0.2501*cos(ang)-1.0,0.2501*sin(ang));
  vec2 c3=vec2(0.25/4.2*cos(ang)-1.0-0.25-0.25/4.2,0.25/4.2*sin(ang));
  vec2 c4=vec2(-0.125,0.7445)+0.095*vec2(cos(ang),sin(ang));
  vec2 c= (ang<2.0*pi)?c1:(ang<4.0*pi)?c2:(ang<6.0*pi)?c3:c4;

vec3 Julia(vec2 p)
{
  vec2 s = p;
  float d = 0.0, l;
  for (int i = 0; i < ITERATION; i++) {
    s = vec2(s.x * s.x - s.y * s.y + c.x, 2.0 * s.x * s.y + c.y);
    l = length(s);
    d += l + 0.2;
    if (l > 2.0) break;
  }
    if(length(p-c)<0.01)return vec3(1.0,1.0,1.0);else return vec3(sin(d * 0.0314), sin(d * 0.02), sin(d * 0.01));		
}
void main() {
  vec2 p = surfacePosition*4.0;	
  gl_FragColor = vec4(max(max(max(max(max(Julia(p),mandelbrot(p)),0.5*cave2(p)),0.5*cave(p)),0.5*cave3(p)),cave4(p)), 1.0);
	vec2 D = -normalize(p)*3.333;
	float rot = time;
	mat2 rotr = mat2(cos(rot), sin(rot), -sin(rot), cos(rot));
	gl_FragColor = max(gl_FragColor, (
		+texture2D(backbuffer, (rotr*(D+vec2(0,1))+gl_FragCoord.xy)/resolution)
		+texture2D(backbuffer, (rotr*(D+vec2(0,-1))+gl_FragCoord.xy)/resolution)
		+texture2D(backbuffer, (rotr*(D+vec2(1,0))+gl_FragCoord.xy)/resolution)*0.5
		+texture2D(backbuffer, (rotr*(D+vec2(-1,0))+gl_FragCoord.xy)/resolution)*0.5
		)/3.-1./256.);
}