#define PI 3.14159
#define ANGLE 360.
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(){
  vec2 r = resolution, st = (gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  st *= rotate2d(radians((floor(time*20.)*23.5)));
  vec3 color = vec3(0.0);
	
  color = vec3( st.x,st.y, 0.0);
  color *= vec3( circle(st,0.2));
  gl_FragColor = vec4(vec3(color),1);
}