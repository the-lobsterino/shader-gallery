#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float  time;

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);

  float radius = 0.9;
  float radiusMovSpeed = 1.0;
  float speed = 100.0;
  float timeSpeedDiff = 0.11;
  float circleSize = 0.03;
  float distanceDiff = 0.1;

  vec3 colorDest = vec3(0.0),col2 = vec3(0.0);
  for(float i = 0.0;i < 19.0; i++){
    float j = i + 1.0;
    vec2 q = p+ vec2((radius*cos(time*radiusMovSpeed))*cos(time*(speed+timeSpeedDiff*j) + j*distanceDiff),(radius*sin(time*radiusMovSpeed))*sin(time*(speed+timeSpeedDiff*j) + j*distanceDiff));
    float l = circleSize/length(q);
    float l2 = circleSize/length(q)*length(q-10.0);  
    colorDest += vec3(l-1.0,l-0.09,l-0.05);
    col2 += vec3(l2-0.1,l2-0.9,l2-0.05);	  
  }
  gl_FragColor = vec4(vec3(colorDest),1.0);
	gl_FragColor += vec4(vec3(col2),1.0);
}