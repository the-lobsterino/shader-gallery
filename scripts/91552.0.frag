// ------------------------- //
// |Original By SONENEIS :)| //
// ------------------------- //

#if GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float sdCirc(vec2 uv,float r){
  return length(uv) - r;
}
float sdRect(vec2 uv,vec4 rect,float r){
  return length(max(abs(uv-rect.xy)-rect.zw,0.0)) - r;
}

float segm7(vec2 uv,int n1,int n2,int n3,int n4,int n5,int n6,int n7,int dp){
  float res = 1.0;

  //   ——1——
  // |       |
  // 2       3
  // |       |
  //   ——4——
  // |       |
  // 5       6
  // |       |
  //   ——7——   (dp)

  if(n1 == 1) res = min(res,sdRect(uv,vec4(0.0,0.4,0.1,0.01),0.05));
  if(n4 == 1) res = min(res,sdRect(uv,vec4(0.0,0.0,0.1,0.01),0.05));
  if(n7 == 1) res = min(res,sdRect(uv,vec4(0.0,-0.4,0.1,0.01),0.05));
  if(n3 == 1) res = min(res,sdRect(uv,vec4(0.2,0.2,0.01,0.1),0.05));
  if(n2 == 1) res = min(res,sdRect(uv,vec4(-0.2,0.2,0.01,0.1),0.05));
  if(n6 == 1) res = min(res,sdRect(uv,vec4(0.2,-0.2,0.01,0.1),0.05));
  if(n5 == 1) res = min(res,sdRect(uv,vec4(-0.2,-0.2,0.01,0.1),0.05));
  if(dp == 1) res = min(res,sdCirc(uv-vec2(0.35,-0.4),0.05));

  return res;
}

float digit(vec2 uv,int d,int dp){
  float res = 1.0;
  
  if(d == 0) res = min(res,segm7(uv,1,1,1,0,1,1,1,dp));
  if(d == 1) res = min(res,segm7(uv,0,0,1,0,0,1,0,dp));
  if(d == 2) res = min(res,segm7(uv,1,0,1,1,1,0,1,dp));
  if(d == 3) res = min(res,segm7(uv,1,0,1,1,0,1,1,dp));
  if(d == 4) res = min(res,segm7(uv,0,1,1,1,0,1,0,dp));
  if(d == 5) res = min(res,segm7(uv,1,1,0,1,0,1,1,dp));
  if(d == 6) res = min(res,segm7(uv,1,1,0,1,1,1,1,dp));
  if(d == 7) res = min(res,segm7(uv,1,0,1,0,0,1,0,dp));
  if(d == 8) res = min(res,segm7(uv,1,1,1,1,1,1,1,dp));
  if(d == 9) res = min(res,segm7(uv,1,1,1,1,0,1,1,dp));

  return res;
}

void main(){
  vec2 uv = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
  vec3 col = vec3(0.0);
  
  float size = 1.0;  
	
  int nUni = int(mod(time*01.00,10.));
  int nTen = int(mod(time*00.10,10.));
  int nHun = int(mod(time*00.01,10.));
  int nTho = int(mod(time*00.001,10.));

  //unit
  col = mix(vec3(0.04,0.07,0.05),col,smoothstep(0.0,1.5/resolution.y,digit(size*uv-vec2(1.0,0),8,1)));
  col = mix(vec3(0.10,1.0,0.500),col,smoothstep(0.0,3.0/resolution.y,digit(size*uv-vec2(1.0,0),nUni,0)));
  //ten
  col = mix(vec3(0.04,0.07,0.05),col,smoothstep(0.0,1.5/resolution.y,digit(size*uv-vec2(0.3,0),8,1)));
  col = mix(vec3(0.10,1.0,0.500),col,smoothstep(0.0,3.0/resolution.y,digit(size*uv-vec2(0.3,0),nTen,0)));
  //hundred
  col = mix(vec3(0.04,0.07,0.05),col,smoothstep(0.0,1.5/resolution.y,digit(size*uv-vec2(-0.4,0),8,1)));
  col = mix(vec3(0.10,1.0,0.500),col,smoothstep(0.0,3.0/resolution.y,digit(size*uv-vec2(-0.4,0),nHun,0)));
  //thousand
  col = mix(vec3(0.04,0.07,0.05),col,smoothstep(0.0,1.5/resolution.y,digit(size*uv-vec2(-1.1,0),8,1)));
  col = mix(vec3(0.10,1.0,0.500),col,smoothstep(0.0,3.0/resolution.y,digit(size*uv-vec2(-1.1,0),nTho,0)));
	
  gl_FragColor = vec4(col,1.8);
}
