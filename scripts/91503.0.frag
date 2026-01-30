//by soneneis :)

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

float circ(vec2 uv,float r){
	return step(length(uv)-r,0.0);
}
float rect(vec2 uv,vec4 rect,float r){
	return step(length(max(abs(uv-rect.xy)-rect.zw,0.0))-r,0.0);
}

float segm7(vec2 uv,int n1,int n2,int n3,int n4,int n5,int n6,int n7,int dp){
	float res = 0.0;
	
	//   — 1 —
	// |       |
	// 2       3
	// |       |
	//   — 4 —
	// |       |
	// 5       6
	// |       |
	//   — 7 —
		
	if(n1 == 1) res += rect(uv,vec4(0.0,0.4,0.1,0.01),0.05);
	if(n4 == 1) res += rect(uv,vec4(0.0,0.0,0.1,0.01),0.05);
	if(n7 == 1) res += rect(uv,vec4(0.0,-0.4,0.1,0.01),0.05);	
	if(n3 == 1) res += rect(uv,vec4(0.2,0.2,0.01,0.1),0.05);
	if(n2 == 1) res += rect(uv,vec4(-0.2,0.2,0.01,0.1),0.05);
	if(n6 == 1) res += rect(uv,vec4(0.2,-0.2,0.01,0.1),0.05);
	if(n5 == 1) res += rect(uv,vec4(-0.2,-0.2,0.01,0.1),0.05);
	if(dp == 1) res += circ(uv-vec2(0.35,-0.4),0.05);
	
	return res;
}

float digit(vec2 uv,int d,int dp){
	float res = 0.0;
	
	d = int(mod(float(d),9.0));
  if(d == 0) res += segm7(uv,1,1,1,0,1,1,1,dp);
  if(d == 1) res += segm7(uv,0,0,1,0,0,1,0,dp);
  if(d == 2) res += segm7(uv,1,0,1,1,1,0,1,dp);
  if(d == 3) res += segm7(uv,1,0,1,1,0,1,1,dp);
  if(d == 4) res += segm7(uv,0,1,1,1,0,1,0,dp);
  if(d == 5) res += segm7(uv,1,1,0,1,0,1,1,dp);
  if(d == 6) res += segm7(uv,1,1,0,1,1,1,1,dp);
  if(d == 7) res += segm7(uv,1,0,1,0,0,1,0,dp);
  if(d == 8) res += segm7(uv,1,1,1,1,1,1,1,dp);
  if(d == 9) res += segm7(uv,1,1,1,1,0,1,1,dp);
	
	return res;
}

void main(){
  vec2 uv = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
  vec3 col = vec3(0.0);
  
  col += segm7(uv,1,1,1,1,1,1,1,1);
  col *= vec3(0.05,0.1,0.075);
  
  col += digit(uv,int(time*2.0),int(mod(time*2.0,2.0)));
  col *= vec3(0.1,1.0,0.5);
  
  //col += segm7(uv,1,1,1,1,1,1,1,1);
  //col *= vec3(0.1,0.5,0.2);
  //col *= vec3(0.1,1.0,0.5);
  
  gl_FragColor = vec4(col,1.0);
}
