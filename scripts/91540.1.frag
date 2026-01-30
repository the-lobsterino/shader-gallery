#if GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float sdRect(vec2 uv,vec4 rect,float r){
  return length(max(abs(uv-rect.xy)-rect.zw,0.036)) - r;
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
  if(dp == 1) res = min(res,sdRect(uv,vec4(0.35,-0.4,0.01,0.01),0.05));

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

  col += mix(vec3(0.04,0.07,0.05),col,smoothstep(0.0,0.0/resolution.y,digit(uv,8,1)));
  col += mix(vec3(0.10,1.0,0.500),col,smoothstep(0.0,2.0/resolution.y,digit(uv,int(mod(time*9.,10.0)),int(mod(time*4.0,2.0)))));
  col += mix(vec3(0.10,0.5,0.800),col,smoothstep(0.0,2.0/resolution.y,digit(uv-vec2(-0.8,0.0),int(mod(time,10.0)),int(mod(time,2.0)))));	

  gl_FragColor = vec4(col,1.0);
}
