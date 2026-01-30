#ifdef GL_ES
precision mediump float;
#endif
 
// Posted by SnyperWolf
 
uniform float time;
uniform vec2 resolution;
 
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
	v += 1.-abs(pow(noise(p)-0.2,0.9))*1.51;
	return v;
}
 
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	position.y+=0.2;
	
	vec2 coord= vec2(position.x,5.*position.y);
	vec2 p = (coord*.018+.5);
	float c1 = color(p*.3+time*.0003);
	float c2 = color(p*.3-time*.0003);
	
	float c3 = color(p*.2-time*.0003);
	float c4 = color(p*.2+time*.0003);
	
	float cf = pow(c1*c2*c3*c4+0.3,4.);
	
	vec3 c = vec3(cf);
	gl_FragColor = vec4(c+vec3(0.1,0.16,0.6), 1.);
}