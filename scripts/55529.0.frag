precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
  float speed = 0.5;
  float pi = 3.141952;
  
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 mouse_uv = mouse.xy;
  vec3 phase_diff = vec3(0, pi/2., pi);
  vec3 color = 0.5 + 0.5 * cos(mouse_uv.xxx + vec3(speed,speed,speed) * time + uv.xyx + phase_diff);
  gl_FragColor = vec4(color,1.0);
  
  // The following codes are for validations
  // gl_FragColor = vec4(uv.x,uv.y,0.5,1);
  //gl_FragColor = vec4(mouse_uv.x,mouse_uv.y,0,1);
}
