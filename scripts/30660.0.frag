#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;

vec3 renderPont(float x, float y, float size){
  vec2  pos = vec2(resolution.x*x, resolution.y*y);
  float dist = length(gl_FragCoord.xy - pos);
  	
  return vec3(pow((size / dist),6.0));
}

void main() {
	float x1=0.5+sin(time)/4.0;
	float y1=0.5+cos(time)/4.0;
	
	vec3 color=  renderPont(0.5, 0.5, 25.0); 	
	color = max( renderPont(x1, y1, 15.0), color);
	
	
	gl_FragColor = vec4(color, 1.0);
}