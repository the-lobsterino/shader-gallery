#ifdef GL_ES
precision mediump float;
#endif
 
// Posted by Trisomie21 : 2D noise experiment (pan/zoom)
 
// failed attempt at faking caustics
 
uniform float time;
uniform vec2 resolution2332;
uniform sampler2D tex;
varying vec2 surfacePosition;
 
vec4 textureRND2D(vec2 uv){
  uv = floor(fract(uv)*1e3);
	float v = uv.x+uv.y*1e3;
	return fract(1e5*sin(vec4(v*1e-2, (v+1.)*1e-2, (v+1e3)*1e-2, (v+1e3+1.)*1e-2)));
}
 
float noise(vec2 p) {
	vec2 f = fract(p*1e3);
	vec4 r = textureRND2D(p);
	f = f*f*(3.0-2.0*f);
	return (mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y));	
}
 
float color(vec2 p) {
	float v = 0.0;
	v += 1.-abs(pow(noise(p)-0.5,0.75))*1.7;
	return v;
}
 
void main( void ) {
vec2 cPos = -1.0 + 2.0 * gl_FragCoord.xy / resolution2332.xy;
float cLength = length(cPos);

vec2 uv = gl_FragCoord.xy/resolution2332.xy+(cPos/cLength)*cos(cLength*12.0-time*4.0)*0.03;
vec3 col = texture2D(tex,uv).xyz;
}