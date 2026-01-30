#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 UV = vec2(0.4,0.4);


float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float sdfCircle(vec2 p, float r) {
  return length(p) - r;
}


vec4 fragment() {
	float mult = 2.2;
	float t = time;
  float octaves = 64.0;//*sin(time);
	float oct2 = 32.;
	vec2 pos;
	pos.x = (gl_FragCoord.x / resolution.x*0.5) - UV.x*0.5;
	pos.y = (gl_FragCoord.y / resolution.y*0.5) - UV.y*0.5;
	pos.y *= resolution.y / resolution.x;
  float noiseAmount = noise(vec2(octaves * pos.x, octaves * pos.y - time*10.));
	float nA2 = noise(vec2(oct2*pos.x, oct2 * pos.y - time*5.));
  float yGradient = clamp(pos.y, 0.0, 1.0) * 0.6;
  vec2 sdfNoise = vec2(noiseAmount * 0.1, noiseAmount * 2.5 * yGradient);
  vec2 p = pos- sdfNoise/mult;

	
	vec4 colY = vec4(0.9*noiseAmount, 0.9*noiseAmount,0.1* noiseAmount,nA2) * vec4(step(sdfCircle(p, mult*0.018), mult*0.0001*nA2));
	vec4 colO = vec4(0.9*noiseAmount, 0.6*noiseAmount, 0.*noiseAmount,nA2) * vec4(step(sdfCircle(p, mult*0.02), mult*0.0001*nA2));
	vec4 colO2 = vec4(0.9*nA2, 0.45*nA2, 0.*nA2,nA2) * vec4(step(sdfCircle(p, mult*0.0225), mult*0.0001*nA2));
vec4 colR = vec4(0.9*nA2, 0.3*nA2, 0.*nA2,nA2) * vec4(step(sdfCircle(p, mult*0.024), mult*0.0001*nA2));
	return mix(mix(mix(colY,colO,2./3.) , colO2, 2./3.),colR ,1./3.);	
}
void main( void ) {


	gl_FragColor = fragment();// + vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}